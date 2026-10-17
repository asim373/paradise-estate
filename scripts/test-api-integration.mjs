import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const testUrl = process.env.TEST_DATABASE_URL;
const prefix = `phase63-${randomUUID()}`;
const port = 3216;
const externalBaseUrl = process.env.TEST_API_BASE_URL;
const baseUrl = externalBaseUrl ?? `http://127.0.0.1:${port}`;
let passed = 0;

function check(condition, message) {
  assert.ok(condition, message);
  passed += 1;
}

function verifyTestUrl(value) {
  if (!value) throw new Error("TEST_DATABASE_URL is required.");
  const url = new URL(value);
  if (url.hostname !== "127.0.0.1" || url.port !== "5432" || url.pathname !== "/paradise_estate_test") {
    throw new Error("TEST_DATABASE_URL must target only 127.0.0.1:5432/paradise_estate_test.");
  }
}

async function waitForServer(url, child) {
  let lastStatus = "no response";
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`The isolated Next.js test server exited before becoming ready: ${child.testOutput || "no startup output"}`);
    try {
      const response = await fetch(`${url}/api/properties`);
      if (response.ok) return;
      lastStatus = `HTTP ${response.status}`;
    } catch {
      // The server is still starting.
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for the isolated Next.js test server (${lastStatus}): ${child.testOutput || "no startup output"}`);
}

function startServer(databaseUrl, serverPort = port) {
  const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
  const child = spawn(process.execPath, [nextCli, "dev", "--hostname", "127.0.0.1", "--port", String(serverPort)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      DIRECT_URL: databaseUrl,
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.testOutput = "";
  const appendOutput = (chunk) => {
    child.testOutput = `${child.testOutput}${chunk}`.replace(/postgres(?:ql)?:\/\/[^\s'"`]+/gi, "postgresql://<redacted>").slice(-1_000);
  };
  child.stdout.on("data", appendOutput);
  child.stderr.on("data", appendOutput);
  return child;
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    delay(5_000),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

async function request(path, key, body, options = {}) {
  const response = await fetch(`${options.baseUrl ?? baseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": key,
      ...options.headers,
    },
    body: options.rawBody ?? JSON.stringify(body),
  });
  const payload = await response.json();
  check(!/prisma|postgres|database|password|connection string/i.test(JSON.stringify(payload)), `${path} must not disclose database details.`);
  return { response, payload };
}

async function runEndpointSuite({ client, path, table, payload, invalidPayload, verifyRow }) {
  const baseKey = `${prefix}-${table.toLowerCase()}`;
  const success = await request(path, `${baseKey}-success`, payload);
  check(success.response.status === 201 && success.payload.data?.accepted === true, `${path} accepts a valid submission.`);
  await verifyRow(`${baseKey}-success`, payload);

  const replay = await request(path, `${baseKey}-success`, payload);
  check(replay.response.status === 200 && replay.payload.data?.replayed === true, `${path} replays an identical request.`);
  const conflict = await request(path, `${baseKey}-success`, { ...payload, message: `${payload.message ?? payload.notes} changed`, notes: `${payload.notes ?? payload.message} changed` });
  check(conflict.response.status === 409, `${path} rejects a conflicting idempotency replay.`);

  const duplicateKey = `${baseKey}-concurrent-identical`;
  const concurrentIdentical = await Promise.all([
    request(path, duplicateKey, payload),
    request(path, duplicateKey, payload),
  ]);
  const duplicateStatuses = concurrentIdentical.map(({ response }) => response.status).sort();
  check(duplicateStatuses.join(",") === "200,201", `${path} commits only one concurrent identical request.`);
  const duplicateCount = await client.query(`SELECT count(*)::int AS count FROM public."${table}" WHERE "idempotencyKey" = $1`, [duplicateKey]);
  check(duplicateCount.rows[0].count === 1, `${table} database uniqueness prevents duplicate rows.`);

  const conflictKey = `${baseKey}-concurrent-conflict`;
  const concurrentConflict = await Promise.all([
    request(path, conflictKey, payload),
    request(path, conflictKey, { ...payload, name: "Different Test Name" }),
  ]);
  const conflictStatuses = concurrentConflict.map(({ response }) => response.status).sort();
  check(conflictStatuses.join(",") === "201,409", `${path} handles concurrent conflicting idempotency keys predictably.`);
  const conflictCount = await client.query(`SELECT count(*)::int AS count FROM public."${table}" WHERE "idempotencyKey" = $1`, [conflictKey]);
  check(conflictCount.rows[0].count === 1, `${table} preserves one row for a conflicting concurrent key.`);

  const missing = await request(path, `${baseKey}-missing`, invalidPayload.missing);
  check(missing.response.status === 400, `${path} rejects missing required fields.`);
  const invalidEmail = await request(path, `${baseKey}-email`, invalidPayload.email);
  check(invalidEmail.response.status === 400, `${path} rejects invalid email.`);
  const invalidProperty = await request(path, `${baseKey}-property`, invalidPayload.property);
  check(invalidProperty.response.status === 400, `${path} rejects an invalid property reference.`);
}

async function runMalformedChecks(malformedBaseUrl) {
  const malformedInquiry = await request("/api/inquiries", `${prefix}-malformed-inquiry`, {}, { rawBody: "not-json", baseUrl: malformedBaseUrl });
  check(malformedInquiry.response.status === 400, "Inquiry API rejects malformed JSON.");
  const malformedViewing = await request("/api/viewing-requests", `${prefix}-malformed-viewing`, {}, { rawBody: "not-json", baseUrl: malformedBaseUrl });
  check(malformedViewing.response.status === 400, "Viewing API rejects malformed JSON.");
}

async function main() {
  verifyTestUrl(testUrl);
  const client = new Client({ connectionString: testUrl });
  await client.connect();
  let server;
  let malformedServer;
  const propertyId = `${prefix}-property`;

  try {
    const identity = await client.query("SELECT current_database() AS database, inet_server_addr()::text AS host, inet_server_port() AS port");
    check(identity.rows[0].database === "paradise_estate_test" && String(identity.rows[0].host).startsWith("127.0.0.1") && Number(identity.rows[0].port) === 5432, "The database target is the isolated local test database.");

    if (externalBaseUrl) {
      await waitForServer(baseUrl, { exitCode: null, testOutput: "external isolated server" });
    } else {
      server = startServer(testUrl);
      await waitForServer(baseUrl, server);
    }

    await client.query(
      `INSERT INTO public."Property" ("id", "slug", "cityId", "name", "city", "state", "address", "price", "propertyType", "description", "editorialHeading", "editorialNote", "editorialQuote", "coverImage", "coverAlt", "bedrooms", "fullBathrooms", "halfBathrooms", "interiorSquareFeet", "specifications", "updatedAt")
       VALUES ($1, $2, 'new-york', 'Phase 6.3 Test Residence', 'New York', 'New York', '1 Test Lane', 1000000, 'Townhouse', 'Isolated API test fixture.', 'Fixture heading', 'Fixture note', 'Fixture quote', '/images/test.jpg', 'Test image', 3, 2, 0, 2000, '{}', NOW())`,
      [propertyId, `${prefix}-residence`],
    );

    const inquiryPayload = { name: "Phase Test", email: "phase63@example.test", phone: "555-0100", message: "Please contact me about this residence.", propertyId };
    await runEndpointSuite({
      client,
      path: "/api/inquiries",
      table: "PropertyInquiry",
      payload: inquiryPayload,
      invalidPayload: {
        missing: { ...inquiryPayload, name: "" },
        email: { ...inquiryPayload, email: "invalid-email" },
        property: { ...inquiryPayload, propertyId: `${prefix}-missing-property` },
      },
      verifyRow: async (key, expected) => {
        const row = await client.query('SELECT "name", "email", "message", "propertyId" FROM public."PropertyInquiry" WHERE "idempotencyKey" = $1', [key]);
        check(row.rowCount === 1 && row.rows[0].name === expected.name && row.rows[0].email === expected.email && row.rows[0].message === expected.message && row.rows[0].propertyId === propertyId, "Inquiry persistence keeps submitted values and the property relationship.");
      },
    });

    const viewingPayload = { name: "Phase Test", email: "phase63@example.test", phone: "555-0100", notes: "Please arrange a viewing.", requestedDate: "2026-12-01T15:00:00.000Z", propertyId };
    await runEndpointSuite({
      client,
      path: "/api/viewing-requests",
      table: "ViewingRequest",
      payload: viewingPayload,
      invalidPayload: {
        missing: { ...viewingPayload, propertyId: undefined },
        email: { ...viewingPayload, email: "invalid-email" },
        property: { ...viewingPayload, propertyId: `${prefix}-missing-property` },
      },
      verifyRow: async (key, expected) => {
        const row = await client.query('SELECT "name", "email", "notes", "propertyId", to_char("requestedDate", \'YYYY-MM-DD HH24:MI:SS.MS\') AS "requestedDate" FROM public."ViewingRequest" WHERE "idempotencyKey" = $1', [key]);
        check(row.rowCount === 1 && row.rows[0].name === expected.name && row.rows[0].email === expected.email && row.rows[0].notes === expected.notes && row.rows[0].propertyId === propertyId && row.rows[0].requestedDate === expected.requestedDate.slice(0, 23).replace('T', ' '), "Viewing persistence keeps submitted values, date, and property relationship.");
      },
    });

    if (!externalBaseUrl) {
      await stopServer(server);
      server = undefined;
      malformedServer = startServer(testUrl, 3217);
      await waitForServer("http://127.0.0.1:3217", malformedServer);
      await runMalformedChecks("http://127.0.0.1:3217");
    }

    console.log(`PASS ${passed} integration assertions.`);
  } finally {
    await stopServer(server);
    await stopServer(malformedServer);
    await client.query('DELETE FROM public."PropertyInquiry" WHERE "idempotencyKey" LIKE $1', [`${prefix}%`]);
    await client.query('DELETE FROM public."ViewingRequest" WHERE "idempotencyKey" LIKE $1', [`${prefix}%`]);
    await client.query('DELETE FROM public."Property" WHERE "id" = $1', [propertyId]);
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Integration test failed: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exitCode = 1;
});
