"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { Photo } from "@/lib/photos";
import { Lightbox } from "@/components/Lightbox";

type Props = { photos: Photo[] };

/**
 * Justified "cobblestone" rows of photos. Each row is a flex line; items get
 * a basis proportional to their aspect ratio so every row shares one height.
 * Clicking a photo opens the lightbox and records the photo in the URL hash.
 */
export function Cobblestone({ photos }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = useCallback(
    (index: number) => {
      setOpenIndex(index);
      window.history.replaceState(null, "", `#${photos[index].id}`);
    },
    [photos],
  );

  const close = useCallback(() => {
    setOpenIndex(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  // Deep links: /page#photo-id opens that photo.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const index = photos.findIndex((p) => p.id === id);
      if (index >= 0) setOpenIndex(index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [photos]);

  return (
    <section className="cobblestone" aria-label="Gallery">
      <div className="cobblestone__frame">
        <div className="cobblestone__grid">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              id={`photo-${photo.id}`}
              className="cobblestone__item"
              style={{ "--w": photo.width, "--h": photo.height } as CSSProperties}
              onClick={() => open(index)}
              aria-label={`Open photo ${index + 1} of ${photos.length}`}
              aria-haspopup="dialog"
            >
              <Image
                className="cobblestone__img"
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                quality={80}
                priority={index < 2}
                loading={index < 2 ? undefined : "lazy"}
                sizes="(max-width: 800px) 100vw, 40vw"
                style={{ "--focal": photo.focal } as CSSProperties}
              />
            </button>
          ))}
        </div>
      </div>
      {openIndex !== null && (
        <Lightbox photos={photos} index={openIndex} onNavigate={open} onClose={close} />
      )}
    </section>
  );
}
