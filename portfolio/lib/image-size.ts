import { readFileSync } from "node:fs";

export interface ImageSize {
  width: number;
  height: number;
}

/** Minimal PNG/JPEG dimension reader (server-only) — avoids pulling in a full image-size dependency. */
export function getImageSize(path: string): ImageSize | null {
  try {
    const buf = readFileSync(path);

    // PNG: signature + IHDR chunk holds width/height at fixed offsets.
    if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    // JPEG: walk marker segments until an SOFn frame header.
    if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let offset = 2;
      while (offset < buf.length - 9) {
        if (buf[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buf[offset + 1];
        const isSOF =
          marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
        if (isSOF) {
          return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
        }
        const segmentLength = buf.readUInt16BE(offset + 2);
        offset += 2 + segmentLength;
      }
    }

    return null;
  } catch {
    return null;
  }
}
