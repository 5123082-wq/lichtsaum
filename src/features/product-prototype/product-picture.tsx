import type { ComponentProps, Ref } from "react";
import images from "./product-images.json";

type ImageFile = { src: string; width: number; height: number; bytes: number };
type ImageVariant = { avif: ImageFile[]; webp: ImageFile[] };
const media: Record<string, { original: string; variants: Record<string, ImageVariant> }> = images;
const sizes = "(max-width: 400px) calc(100vw - 32px), (max-width: 1440px) 92vw, 1312px";
const srcSet = (files: ImageFile[]) => files.map(file => `${file.src} ${file.width}w`).join(", ");

type Props = Pick<ComponentProps<"img">, "loading" | "fetchPriority" | "onLoad" | "onError"> & {
  image: string;
  alt: string;
  className?: string;
  hidden?: boolean;
  imageRef?: Ref<HTMLImageElement>;
  mobileVariant?: "straight" | "wave" | "scallop";
};

export function ProductPicture({ image, alt, className, hidden, imageRef, mobileVariant, ...props }: Props) {
  const asset = Object.values(media).find(item => item.original === image)!;
  const desktop = asset.variants.desktop;
  const mobile = asset.variants[mobileVariant ?? "mobile"];
  const tablet = asset.variants.tablet;
  const fallback = desktop.webp[desktop.webp.length - 1];
  // Cover scales the panoramas to the card's clamp(28rem, 35vw, 34rem) height.
  const desktopSizes = fallback.width / fallback.height > 2.7
    ? "clamp(76.103rem, 95.129vw, 92.411rem)"
    : sizes;

  return <picture className={className} hidden={hidden}>
    {mobile ? <>
      {mobile.avif.length ? <source media="(max-width: 760px)" type="image/avif" srcSet={srcSet(mobile.avif)} sizes={sizes} /> : null}
      <source media="(max-width: 760px)" type="image/webp" srcSet={srcSet(mobile.webp)} sizes={sizes} />
    </> : null}
    {tablet ? <>
      {tablet.avif.length ? <source media="(max-width: 1000px)" type="image/avif" srcSet={srcSet(tablet.avif)} sizes={sizes} /> : null}
      <source media="(max-width: 1000px)" type="image/webp" srcSet={srcSet(tablet.webp)} sizes={sizes} />
    </> : null}
    {desktop.avif.length ? <source type="image/avif" srcSet={srcSet(desktop.avif)} sizes={desktopSizes} /> : null}
    {/* These files are pre-sized and encoded; a runtime optimizer would re-encode the cloth. */}
    <img {...props} alt={alt} ref={imageRef} src={fallback.src} srcSet={srcSet(desktop.webp)} sizes={desktopSizes}
      width={fallback.width} height={fallback.height} decoding="async" />
  </picture>;
}
