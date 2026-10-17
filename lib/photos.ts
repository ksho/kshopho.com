import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PhotoEntry } from "@/content/site";

export type Photo = {
  /** Stable id used for lightbox deep links (#id). */
  id: string;
  src: string;
  width: number;
  height: number;
  /** CSS object-position used when the image is cropped to fill. */
  focal: string;
  alt: string;
};

const PHOTO_DIR = path.join(process.cwd(), "public", "photos");

/** Reads intrinsic pixel dimensions from a JPEG, PNG or WebP header. */
function readDimensions(buf: Buffer): { width: number; height: number } {
  // PNG
  if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // WebP (VP8 / VP8L / VP8X)
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        width: 1 + buf.readUIntLE(24, 3),
        height: 1 + buf.readUIntLE(27, 3),
      };
    }
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: 1 + (b & 0x3fff), height: 1 + ((b >> 14) & 0x3fff) };
    }
    if (chunk === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
  }
  // JPEG: walk the markers until a start-of-frame segment.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
        continue;
      }
      const isSOF =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSOF) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  throw new Error("Unsupported image format");
}

/**
 * Resolves gallery entries from `content/site.ts` into photos with real
 * dimensions. Runs on the server at build time only.
 */
export async function loadPhotos(entries: PhotoEntry[], defaultAlt: string): Promise<Photo[]> {
  return Promise.all(
    entries.map(async (entry) => {
      const file = path.join(PHOTO_DIR, entry.file);
      let buf: Buffer;
      try {
        buf = await readFile(file);
      } catch {
        throw new Error(`Photo not found: public/photos/${entry.file} (listed in content/site.ts)`);
      }
      const { width, height } = readDimensions(buf);
      return {
        id: entry.file.replace(/\.[^.]+$/, ""),
        src: `/photos/${entry.file}`,
        width,
        height,
        focal: entry.focal ?? "50% 50%",
        alt: entry.alt ?? defaultAlt,
      };
    }),
  );
}
