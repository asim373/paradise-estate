import type { PropertySpecifications as PropertySpecificationsData } from "@/types/property";
import { formatNumber } from "@/lib/format";

type PropertySpecificationsProps = {
  specifications: PropertySpecificationsData;
};

function DetailList({ items }: { items: Array<[string, string | undefined]> }) {
  return <dl className="divide-y divide-charcoal/10 border-y border-charcoal/10">
    {items.filter(([, value]) => value).map(([label, value]) => <div className="grid gap-2 py-4 sm:grid-cols-[.8fr_1.2fr]" key={label}><dt className="eyebrow text-taupe">{label}</dt><dd className="text-sm leading-6 text-charcoal">{value}</dd></div>)}
  </dl>;
}

export function PropertySpecifications({ specifications }: PropertySpecificationsProps) {
  const overview = [
    ["Bedrooms", `${specifications.bedrooms}`],
    ["Bathrooms", `${specifications.fullBathrooms} full${specifications.halfBathrooms ? ` · ${specifications.halfBathrooms} half` : ""}`],
    ["Interior", `${formatNumber(specifications.interiorSquareFeet)} sq ft`],
    ["Parking", specifications.parking],
  ];

  return <section className="border-t border-charcoal/10 bg-ivory" aria-labelledby="property-specifications-heading">
    <div className="page-shell py-20 sm:py-24">
      <div className="max-w-2xl"><p className="eyebrow text-taupe">The particulars</p><h2 id="property-specifications-heading" className="mt-4 font-serif text-4xl sm:text-5xl">Considered in every detail.</h2><p className="prose-copy mt-6">A concise specification of this residence, prepared with attention to the details that make it distinctive.</p></div>

      <div className="mt-12 grid gap-px border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
        {overview.map(([label, value]) => <div className="bg-white px-5 py-6 sm:px-6" key={label}><p className="eyebrow text-taupe">{label}</p><p className="mt-3 font-serif text-xl leading-tight">{value}</p></div>)}
      </div>

      <div className="mt-20 grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="eyebrow text-taupe">Interior & living spaces</p><h3 className="mt-4 font-serif text-3xl">A plan made for living well.</h3></div>
        <DetailList items={[["Kitchens", specifications.interior.kitchens], ["Living spaces", specifications.interior.livingSpaces], ["Dining", specifications.interior.dining], ["Family / lounge", specifications.interior.familyOrLounge], ["Office / study", specifications.interior.officeOrStudy], ["Laundry", specifications.interior.laundry], ["Storage", specifications.interior.storage], ["Additional", specifications.interior.additional], ["Levels", specifications.levels ? `${specifications.levels}` : undefined], ["Lot size", specifications.lotSize]]} />
      </div>

      <div className="mt-20 grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="eyebrow text-taupe">Architecture & finishes</p><h3 className="mt-4 font-serif text-3xl">Material character, clearly expressed.</h3></div>
        <DetailList items={[["Architectural style", specifications.architecture.style], ["Flooring", specifications.architecture.flooring], ["Kitchen", specifications.architecture.kitchenFinishes], ["Bathrooms", specifications.architecture.bathroomFinishes], ["Windows & light", specifications.architecture.windowsAndLight], ["Ceilings & structure", specifications.architecture.ceilingsAndStructure], ["Distinctive details", specifications.architecture.distinctiveDetails]]} />
      </div>

      <div className="mt-20 grid gap-14 lg:grid-cols-2">
        <div><p className="eyebrow text-taupe">Outdoor spaces</p><h3 className="mt-4 font-serif text-3xl">A natural extension of home.</h3><ul className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">{specifications.outdoor.map((feature) => <li className="py-4 text-sm leading-6" key={feature}>{feature}</li>)}</ul></div>
        <div><p className="eyebrow text-taupe">Amenities & facilities</p><h3 className="mt-4 font-serif text-3xl">Quietly capable.</h3><ul className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">{specifications.facilities.map((feature) => <li className="py-4 text-sm leading-6" key={feature}>{feature}</li>)}</ul></div>
      </div>
    </div>
  </section>;
}
