const ASSET_BASE = "https://api.sartree.com";

const normalize = (value?: string | null): string => (value || "").trim();

const buildUrlFromPath = (path: string) => {
  if (path.startsWith("/storage/")) return `${ASSET_BASE}${path}`;
  if (path.startsWith("storage/")) return `${ASSET_BASE}/${path}`;
  if (path.startsWith("/")) return `${ASSET_BASE}${path}`;
  return `${ASSET_BASE}/storage/${path.replace(/^\/+/, "")}`;
};

const pickFromImages = (images: any[]): string | undefined => {
  for (const img of images) {
    if (!img) continue;
    if (typeof img === "string" && normalize(img)) return img;
    if (typeof img === "object") {
      const candidate = normalize(img.url || img.name || img.path || img.src);
      if (candidate) return candidate;
    }
  }
  return undefined;
};

export const resolveImageUrl = (raw?: string | null): string => {
  const value = normalize(raw);
  if (!value) return "";
  if (/^data:image\//i.test(value)) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return buildUrlFromPath(value);
};

export const extractProductImage = (product: any, fallback?: string): string => {
  if (!product) return fallback || "";
  const candidates: Array<string | undefined> = [
    product.image,
    product.image_url,
    product.product_image,
    product.image_path,
    product.thumbnail,
  ];

  if (Array.isArray(product.images) && product.images.length > 0) {
    candidates.unshift(pickFromImages(product.images));
  }

  for (const candidate of candidates) {
    const resolved = resolveImageUrl(candidate);
    if (resolved) return resolved;
  }

  return fallback || "";
};

