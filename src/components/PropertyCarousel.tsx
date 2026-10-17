"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";

type PropertyCarouselProps = {
  images: string[];
  alts: string[];
  propertyName: string;
};

export function PropertyCarousel({ images, alts, propertyName }: PropertyCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const move = useCallback((direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }, [images.length]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX;
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (endX === undefined) return;
    const distance = endX - startX;
    if (Math.abs(distance) < 40) return;
    move(distance > 0 ? -1 : 1);
  }

  return (
    <div
      className="relative outline-none focus-visible:ring-2 focus-visible:ring-charcoal/60 focus-visible:ring-offset-2"
      tabIndex={0}
      aria-label={`${propertyName} image gallery`}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="image-frame aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
        <Image
          src={images[activeIndex]}
          alt={alts[activeIndex]}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
        <span className="bg-charcoal/75 px-3 py-2 text-xs font-semibold tracking-[.12em] text-white" aria-live="polite">
          {activeIndex + 1} / {images.length}
        </span>
        <div className="pointer-events-auto flex gap-2">
          <button type="button" className="flex h-11 w-11 items-center justify-center border border-white/50 bg-charcoal/75 text-lg text-white transition hover:bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" onClick={() => move(-1)} aria-label={`Previous image in ${propertyName} gallery`}>
            ←
          </button>
          <button type="button" className="flex h-11 w-11 items-center justify-center border border-white/50 bg-charcoal/75 text-lg text-white transition hover:bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" onClick={() => move(1)} aria-label={`Next image in ${propertyName} gallery`}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
