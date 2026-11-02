import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [path.dirname(require.resolve("next/package.json"))] }));
const directory = "public/images/product/optimized";
await mkdir(directory, { recursive: true });

// Read only the approved public masters. Generation is a manual authoring step, not a build hook.
const masters = [
  ["graphite", "markisenstoff-acryl-graphit-melange.webp"],
  ["sand", "textile-workbench-sand.webp"],
  ["palette", "markisenstoff-farbfaecher-petrol-terrakotta-oliv.webp"],
  ["hems", "hem-comparison-v1.webp"]
];
const manifest = {};
const generated = new Set();
for (const [name, filename] of masters) {
  const input = await readFile(`public/images/product/${filename}`);
  const { width, height } = await sharp(input).metadata();
  const panoramic = width === 3392;
  const variants = { desktop: { widths: [960, 1440, 1920, 2880, width] } };
  if (name !== "hems") {
    for (const [variant, ratio, widths] of [
      ["mobile", 1.12, [480, 800, 1080]],
      ["tablet", 1.5, [800, 1280, 1536, 1920]]
    ]) {
      const cropWidth = Math.min(width, Math.round(height * ratio));
      variants[variant] = {
        widths: [...widths, cropWidth],
        crop: { left: Math.round((width - cropWidth) * (panoramic ? 1 : 0.65)), top: 0, width: cropWidth, height }
      };
    }
  } else {
    // Match the existing three 300%-wide, vertically centred mobile views exactly.
    for (const [index, id] of ["straight", "wave", "scallop"].entries()) {
      variants[id] = { widths: [480, 640], crop: { left: index * 640, top: 210, width: 640, height: 400 } };
    }
  }
  const asset = { original: `/images/product/${filename}`, variants: {} };
  for (const [variant, { widths, crop }] of Object.entries(variants)) {
    const maximum = crop?.width ?? width;
    const outputs = { avif: [], webp: [] };
    for (const size of [...new Set(widths.filter(value => value <= maximum))].sort((a, b) => a - b)) {
      // These two already use quality-75 WebP on the live page; preserve that quality.
      // AVIF at the textile setting is larger for them, so it is deliberately omitted.
      for (const format of panoramic ? ["avif", "webp"] : ["webp"]) {
        let image = sharp(input);
        if (crop) image = image.extract(crop);
        image = image.resize({ width: size, withoutEnlargement: true });
        const { data, info } = await (format === "avif"
          ? image.avif({ quality: 75, effort: 6, chromaSubsampling: "4:4:4" })
          : image.webp({ quality: panoramic ? 85 : 75, effort: 6, smartSubsample: true })).toBuffer({ resolveWithObject: true });
        const hash = createHash("sha256").update(data).digest("hex").slice(0, 12);
        const file = `${name}-${variant}-${size}.${hash}.${format}`;
        await writeFile(`${directory}/${file}`, data);
        generated.add(file);
        outputs[format].push({ src: `/images/product/optimized/${file}`, width: info.width, height: info.height, bytes: info.size });
      }
    }
    asset.variants[variant] = outputs;
  }
  manifest[name] = asset;
  console.log(`${name}: ${Object.values(asset.variants).flatMap(variant => [...variant.avif, ...variant.webp]).length} responsive files`);
}
await writeFile("src/features/product-prototype/product-images.json", `${JSON.stringify(manifest, null, 2)}\n`);
// Prune only this generator's obsolete derivatives after the new manifest is complete.
for (const file of await readdir(directory)) {
  if (/^(graphite|sand|palette|hems)-[a-z]+-\d+\.[a-f0-9]{12}\.(avif|webp)$/.test(file) && !generated.has(file)) await unlink(`${directory}/${file}`);
}
