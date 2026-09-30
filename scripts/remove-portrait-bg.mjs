// One-off local background removal for the portrait photo.
// Flood-fills the backdrop starting from the image border, following
// color gradients pixel-to-neighbor (so it works on a non-flat studio
// backdrop), gated by a "does this even look like backdrop" grayness +
// luminance check so it can't leak through soft/blurred edges into the
// subject's skin, hair, or clothing. Then feathers the resulting alpha
// mask slightly so the cutout edge isn't jagged. No external service.
import sharp from "sharp";
import { join } from "node:path";

const SRC = join(process.cwd(), "public", "images", "profile", "rayan.png");
const STEP_TOLERANCE = 14; // max per-step color distance between adjacent pixels
const MAX_SATURATION = 16; // backdrop is a desaturated gray studio backdrop
const MIN_LUM = 55;
// Sampled backdrop tops out ~145; a shadowed fold in the white shirt dips to
// ~200, which is what let the old 205 cutoff leak through at the collar.
// 170 sits cleanly in the gap between the two.
const MAX_LUM = 170;

async function main() {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isBackground = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  const idx = (x, y) => y * width + x;

  function colorAt(i) {
    const o = i * channels;
    return [data[o], data[o + 1], data[o + 2]];
  }

  function looksLikeBackdrop(r, g, b) {
    const maxc = Math.max(r, g, b);
    const minc = Math.min(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return maxc - minc <= MAX_SATURATION && lum >= MIN_LUM && lum <= MAX_LUM;
  }

  function colorDist(a, b) {
    const dr = a[0] - b[0];
    const dg = a[1] - b[1];
    const db = a[2] - b[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function seed(x, y) {
    const i = idx(x, y);
    if (visited[i]) return;
    const c = colorAt(i);
    visited[i] = 1;
    if (looksLikeBackdrop(...c)) {
      isBackground[i] = 1;
      queue[qTail++] = i;
    }
  }

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (qHead < qTail) {
    const i = queue[qHead++];
    const x = i % width;
    const y = (i / width) | 0;
    const c = colorAt(i);

    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const ni = idx(nx, ny);
      if (visited[ni]) continue;
      const nc = colorAt(ni);
      visited[ni] = 1;
      if (colorDist(c, nc) <= STEP_TOLERANCE && looksLikeBackdrop(...nc)) {
        isBackground[ni] = 1;
        queue[qTail++] = ni;
      }
    }
  }

  // Morphological "opening" (erode then dilate) on the background mask so
  // thin tendrils that snuck in along a bright collar/shirt edge get closed
  // back up, without disturbing the broad, genuinely-connected backdrop.
  function erodeOrDilate(mask, radius, mode) {
    const out = new Uint8Array(mask.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let value = mode === "erode" ? 1 : 0;
        outer: for (let dy = -radius; dy <= radius; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) continue;
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= width) continue;
            const v = mask[idx(nx, ny)];
            if (mode === "erode" && v === 0) {
              value = 0;
              break outer;
            }
            if (mode === "dilate" && v === 1) {
              value = 1;
              break outer;
            }
          }
        }
        out[idx(x, y)] = value;
      }
    }
    return out;
  }

  const opened = erodeOrDilate(erodeOrDilate(isBackground, 3, "erode"), 3, "dilate");

  const alpha = new Float32Array(width * height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = opened[i] ? 0 : 255;

  const feathered = new Float32Array(width * height);
  const radius = 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          sum += alpha[idx(nx, ny)];
          count++;
        }
      }
      feathered[idx(x, y)] = sum / count;
    }
  }

  for (let i = 0; i < feathered.length; i++) {
    data[i * channels + 3] = Math.round(feathered[i]);
  }

  const bgCount = isBackground.reduce((a, b) => a + b, 0);
  console.log(`Background pixels: ${((bgCount / (width * height)) * 100).toFixed(1)}%`);

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(SRC.replace(".png", "-cutout.png"));

  console.log(`Wrote ${SRC.replace(".png", "-cutout.png")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
