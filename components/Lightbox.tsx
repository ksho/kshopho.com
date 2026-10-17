"use client";

import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import type { Photo } from "@/lib/photos";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/Icons";

type Props = {
  photos: Photo[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
};

const OVERLAY_FADE_MS = 250;
const STAGE_DELAY_MS = 100;

export function Lightbox({ photos, index, onNavigate, onClose }: Props) {
  const photo = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  const [overlayVisible, setOverlayVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const closing = useRef(false);

  // Fade the overlay in on mount, then reveal the image a beat later.
  useEffect(() => {
    previousFocus.current = document.activeElement;
    const raf = requestAnimationFrame(() => setOverlayVisible(true));
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(raf);
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus({ preventScroll: true });
      }
    };
  }, []);

  // Warm the browser cache with the next photo.
  useEffect(() => {
    if (!hasNext) return;
    const next = photos[index + 1];
    const { props } = getImageProps({
      src: next.src,
      width: next.width,
      height: next.height,
      alt: "",
      quality: 80,
      sizes: "100vw",
    });
    const img = new window.Image();
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
  }, [hasNext, index, photos]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setOverlayVisible(false);
    window.setTimeout(onClose, OVERLAY_FADE_MS);
  }, [onClose]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(index + 1);
  }, [hasNext, index, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(index - 1);
  }, [hasPrev, index, onNavigate]);

  // Keyboard: arrows to move, Escape or Down to close.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          goNext();
          break;
        case "ArrowDown":
        case "Escape":
          event.preventDefault();
          close();
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, close]);

  // Touch: swipe sideways to move, swipe up/down to close.
  const touchStart = useRef<{ x: number; y: number; multi: boolean } | null>(null);
  const onTouchStart = (event: TouchEvent) => {
    const t = event.changedTouches[0];
    touchStart.current = { x: t.screenX, y: t.screenY, multi: event.touches.length === 2 };
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || start.multi) return;
    const t = event.changedTouches[0];
    const dx = t.screenX - start.x;
    const dy = t.screenY - start.y;
    if (Math.abs(dy) > 100) close();
    else if (dx < -50) goNext();
    else if (dx > 50) goPrev();
  };

  return (
    <div
      className={`lightbox${overlayVisible ? " is-visible" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Keyed on the photo so each one mounts hidden and fades in fresh. */}
      <Stage key={photo.id} photo={photo} />

      <button
        type="button"
        className={`lightbox__nav lightbox__nav--prev${hasPrev ? "" : " is-hidden"}`}
        onClick={goPrev}
        aria-label="Previous photo"
        tabIndex={hasPrev ? 0 : -1}
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        className={`lightbox__nav lightbox__nav--next${hasNext ? "" : " is-hidden"}`}
        onClick={goNext}
        aria-label="Next photo"
        tabIndex={hasNext ? 0 : -1}
      >
        <ChevronRightIcon />
      </button>
      <button
        ref={closeButtonRef}
        type="button"
        className="lightbox__close"
        onClick={close}
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

/** One photo: mounts invisible, reveals after a beat, un-blurs once loaded. */
function Stage({ photo }: { photo: Photo }) {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), STAGE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <figure className={`lightbox__stage${visible ? " is-visible" : ""}`}>
      <span className="spinner" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
      <Image
        className={`lightbox__img${loaded ? "" : " is-loading"}`}
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        quality={80}
        priority
        sizes="100vw"
        onLoad={() => setLoaded(true)}
      />
      <figcaption className="lightbox__caption" />
    </figure>
  );
}
