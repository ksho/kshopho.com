"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import type { Photo } from "@/lib/photos";

const DESKTOP_MIN_WIDTH = 901;

type Props = { photos: Photo[] };

/**
 * Horizontal strip of photos (the home page). On desktop the strip is 80vh
 * tall, scrolls sideways with the mouse wheel, and when it would fill the
 * viewport the whole layout "snaps" so the page itself never scrolls.
 * On phones it becomes a single column.
 */
export function Filmstrip({ photos }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Vertical wheel movement scrolls the strip horizontally.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.deltaY) return;
      if (track.scrollWidth <= track.clientWidth) return; // nothing to scroll sideways
      event.preventDefault();
      track.scrollLeft += event.deltaY + event.deltaX;
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  // Snap layout: if the strip is at least as tall as the space between the
  // header and footer, make it fill that space exactly.
  useEffect(() => {
    const body = document.body;
    let resizeTimer: number | undefined;
    let lastWidth = window.innerWidth;

    const measure = () => {
      body.classList.remove("layout-snap");
      if (window.innerWidth < DESKTOP_MIN_WIDTH) return;
      const frame = sectionRef.current?.querySelector<HTMLElement>(".filmstrip__frame");
      const header = document.querySelector<HTMLElement>(".site-header");
      const footer = document.querySelector<HTMLElement>(".site-footer");
      if (!frame || !header || !footer) return;
      const available = window.innerHeight - header.offsetHeight - footer.offsetHeight;
      if (frame.offsetHeight >= available) body.classList.add("layout-snap");
    };

    const onResize = () => {
      if (window.innerWidth === lastWidth) return; // ignore mobile URL-bar height changes
      lastWidth = window.innerWidth;
      body.classList.add("is-resizing");
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        body.classList.remove("is-resizing");
      }, 150);
    };

    measure();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      body.classList.remove("layout-snap", "is-resizing");
    };
  }, []);

  // Clicking a photo centers it in view.
  const onItemClick = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  };

  return (
    <section ref={sectionRef} className="filmstrip" aria-label="Portfolio">
      <div className="filmstrip__frame">
        <div ref={trackRef} className="filmstrip__track">
          {photos.map((photo, index) => {
            const ratio = photo.width / photo.height;
            const orientation = ratio > 1 ? "landscape" : "portrait";
            return (
              <figure
                key={photo.id}
                id={`photo-${photo.id}`}
                className={`filmstrip__item filmstrip__item--${orientation}`}
                style={{ "--w": photo.width, "--h": photo.height, "--focal": photo.focal } as CSSProperties}
                onClick={onItemClick}
              >
                <Image
                  className="filmstrip__img"
                  src={photo.src}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  quality={80}
                  priority={index < 2}
                  loading={index < 2 ? undefined : "lazy"}
                  sizes={`(max-width: 900px) 100vw, calc(80vh * ${ratio.toFixed(4)})`}
                  onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
