import { createHash } from "node:crypto";
import { access, copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultOutputDirectory = path.join(projectRoot, "build", "catalog-migration");

const parseArguments = (values) => {
  const result = { outputDirectory: defaultOutputDirectory, copyAssets: true };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value === "--output") {
      const candidate = values[index + 1];
      if (!candidate) throw new Error("--output requires a directory path.");
      result.outputDirectory = path.resolve(process.cwd(), candidate);
      index += 1;
      continue;
    }

    if (value === "--no-assets") {
      result.copyAssets = false;
      continue;
    }

    throw new Error(`Unknown argument: ${value}`);
  }

  return result;
};

const uniqueValues = (values) => [...new Set(values)];
const safeInteger = (value) =>
  Number.isInteger(value) && value >= 0 ? value : null;
const positiveInteger = (value) =>
  Number.isInteger(value) && value > 0 ? value : null;
const positiveMoney = (value) =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.trunc(value)
    : null;

const cleanAssetReference = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  return decodeURIComponent(value.split(/[?#]/u, 1)[0]);
};

const firstAccessiblePath = async (candidates) => {
  for (const candidate of candidates) {
    try {
      await access(candidate, fsConstants.R_OK);
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  return null;
};

const resolveAssetPath = async (assetReference) => {
  const cleaned = cleanAssetReference(assetReference);
  if (!cleaned || cleaned.startsWith("data:")) return null;

  const candidates = [];
  if (cleaned.startsWith("file://")) {
    candidates.push(fileURLToPath(cleaned));
  }
  if (cleaned.startsWith("/src/")) {
    candidates.push(path.join(projectRoot, cleaned.slice(1)));
  }
  if (cleaned.startsWith("src/")) {
    candidates.push(path.join(projectRoot, cleaned));
  }
  if (path.isAbsolute(cleaned)) candidates.push(cleaned);
  candidates.push(path.resolve(projectRoot, cleaned.replace(/^\/+/, "")));

  return firstAccessiblePath(uniqueValues(candidates));
};

const createPortableAsset = async ({
  sourceReference,
  outputDirectory,
  copyAssets,
  assetCache,
  warnings,
}) => {
  const sourcePath = await resolveAssetPath(sourceReference);
  if (!sourcePath) {
    warnings.push(`Image source could not be resolved: ${String(sourceReference)}`);
    return {
      sourceReference: sourceReference ?? null,
      sourcePath: null,
      portablePath: null,
    };
  }

  const relativeSourcePath = path.relative(projectRoot, sourcePath).replaceAll(path.sep, "/");
  if (!copyAssets) {
    return {
      sourceReference,
      sourcePath: relativeSourcePath,
      portablePath: null,
    };
  }

  if (assetCache.has(sourcePath)) {
    return {
      sourceReference,
      sourcePath: relativeSourcePath,
      portablePath: assetCache.get(sourcePath),
    };
  }

  const contents = await readFile(sourcePath);
  const digest = createHash("sha256").update(contents).digest("hex").slice(0, 12);
  const extension = path.extname(sourcePath).toLowerCase() || ".bin";
  const baseName = path.basename(sourcePath, extension).replace(/[^a-zA-Z0-9_-]+/gu, "-");
  const portablePath = `assets/${digest}-${baseName}${extension}`;
  const targetPath = path.join(outputDirectory, portablePath);

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  assetCache.set(sourcePath, portablePath);

  return {
    sourceReference,
    sourcePath: relativeSourcePath,
    portablePath,
  };
};

const duplicateValues = (values) => {
  const counts = new Map();
  for (const value of values.filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
};

const buildVariantDrafts = (product) => {
  const basePrice = positiveMoney(product.priceToman ?? product.price);
  const legacyStockHint = safeInteger(product.stock);
  const sourceVariants = Array.isArray(product.variants) && product.variants.length
    ? product.variants
    : null;

  if (!sourceVariants) {
    return [
      {
        sourceId: "default",
        name: product.weight || "گزینه اصلی",
        sku: product.productCode,
        weightLabel: product.weight || null,
        weightGrams: positiveInteger(product.weightGrams),
        regularPriceToman: basePrice,
        salePriceToman: positiveMoney(product.salePriceToman),
        stockQuantity: 0,
        legacyStockHint,
        isDefault: true,
        isActive: false,
        sortOrder: 10,
      },
    ];
  }

  return sourceVariants.map((variant, index) => ({
    sourceId: String(variant.id ?? `variant-${index + 1}`),
    name: String(variant.name ?? `گزینه ${index + 1}`),
    sku: String(variant.productCode ?? `${product.productCode}-${index + 1}`),
    weightLabel: variant.weight ?? null,
    weightGrams: index === 0 ? positiveInteger(product.weightGrams) : null,
    regularPriceToman: positiveMoney(variant.price ?? basePrice),
    salePriceToman: null,
    stockQuantity: 0,
    legacyStockHint,
    isDefault: index === 0,
    isActive: false,
    sortOrder: (index + 1) * 10,
  }));
};

const exportCatalog = async () => {
  const options = parseArguments(process.argv.slice(2));
  const outputDirectory = options.outputDirectory;
  const assetCache = new Map();
  const warnings = [];
  const blockers = [];

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  const vite = await createServer({
    root: projectRoot,
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true },
  });

  let sourceCatalog;
  try {
    sourceCatalog = await vite.ssrLoadModule("/src/data/products.ts");
  } finally {
    await vite.close();
  }

  const sourceCategories = Array.isArray(sourceCatalog.categories)
    ? sourceCatalog.categories.filter((category) => category.slug !== "all")
    : [];
  const sourceProducts = Array.isArray(sourceCatalog.products)
    ? sourceCatalog.products
    : [];

  const categories = sourceCategories.map((category, index) => ({
    name: String(category.name),
    slug: String(category.slug),
    description: null,
    isActive: false,
    sortOrder: (index + 1) * 10,
  }));
  const categorySlugs = new Set(categories.map((category) => category.slug));

  const products = [];
  for (const [index, product] of sourceProducts.entries()) {
    const primaryImage = Array.isArray(product.images) ? product.images[0] : null;
    const image = await createPortableAsset({
      sourceReference: primaryImage?.url,
      outputDirectory,
      copyAssets: options.copyAssets,
      assetCache,
      warnings,
    });
    const variants = buildVariantDrafts(product);
    const missingPrices = variants.filter((variant) => !variant.regularPriceToman);

    if (!categorySlugs.has(product.categorySlug)) {
      blockers.push(
        `Product ${product.productCode} references unknown category ${product.categorySlug}.`,
      );
    }
    if (missingPrices.length) {
      warnings.push(
        `Product ${product.productCode} requires manual pricing for ${missingPrices.length} variant(s).`,
      );
    }

    products.push({
      sourceId: String(product.id),
      name: String(product.name),
      slug: String(product.slug),
      productCode: String(product.productCode),
      categorySlug: String(product.categorySlug),
      shortDescription: product.shortDescription ?? null,
      description: product.longDescription ?? null,
      ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
      allergens: Array.isArray(product.allergens) ? product.allergens : [],
      shelfLife: product.shelfLife ?? null,
      storageInstructions: product.storageTips ?? null,
      preparationTimeDays: positiveInteger(product.preparationTimeDays),
      requiresCooling: product.requiresCooling === true,
      contentVerified: false,
      mediaVerified: false,
      isActive: false,
      isFeatured: product.isFeatured === true,
      sortOrder: (index + 1) * 10,
      seo: product.seo ?? null,
      legacy: {
        badges: Array.isArray(product.badges) ? product.badges : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        flavors: Array.isArray(product.flavors) ? product.flavors : [],
        quantityPerPack: positiveInteger(product.quantityPerPack),
        shippingScope: product.shippingScope ?? null,
        shippingNote: product.shippingNote ?? null,
      },
      image: {
        ...image,
        alt: primaryImage?.alt ?? product.name,
      },
      variants,
      reviewRequired: {
        price: missingPrices.length > 0,
        stock: true,
        content: true,
        media: true,
      },
    });
  }

  const duplicateCategorySlugs = duplicateValues(categories.map((category) => category.slug));
  const duplicateProductSlugs = duplicateValues(products.map((product) => product.slug));
  const duplicateProductCodes = duplicateValues(products.map((product) => product.productCode));
  const allVariants = products.flatMap((product) =>
    product.variants.map((variant) => ({ ...variant, productCode: product.productCode })),
  );
  const duplicateVariantSkus = duplicateValues(allVariants.map((variant) => variant.sku));

  for (const duplicate of duplicateCategorySlugs) {
    blockers.push(`Duplicate category slug: ${duplicate.value} (${duplicate.count}).`);
  }
  for (const duplicate of duplicateProductSlugs) {
    blockers.push(`Duplicate product slug: ${duplicate.value} (${duplicate.count}).`);
  }
  for (const duplicate of duplicateProductCodes) {
    blockers.push(`Duplicate product code: ${duplicate.value} (${duplicate.count}).`);
  }
  for (const duplicate of duplicateVariantSkus) {
    blockers.push(`Duplicate variant SKU: ${duplicate.value} (${duplicate.count}).`);
  }

  const productsMissingPrice = products.filter((product) =>
    product.variants.some((variant) => !variant.regularPriceToman),
  );
  const productsMissingImage = products.filter((product) => !product.image.sourcePath);
  const status = blockers.length ? "blocked" : warnings.length ? "review-required" : "ready";

  const manifest = {
    format: "winimi-legacy-frontend-catalog-v1",
    generatedAt: new Date().toISOString(),
    source: {
      repository: "sajadkhavas/cooci",
      branch: "phase-20/full-integration",
      file: "src/data/products.ts",
    },
    importPolicy: {
      categoriesActive: false,
      productsActive: false,
      variantsActive: false,
      contentVerified: false,
      mediaVerified: false,
      stockQuantity: 0,
      note: "This export is draft-only. Prices, stock, content and media require review before publication.",
    },
    categories,
    products,
  };

  const report = {
    status,
    summary: {
      categories: categories.length,
      products: products.length,
      variants: allVariants.length,
      uniqueAssets: assetCache.size,
      productsMissingPrice: productsMissingPrice.length,
      productsMissingImage: productsMissingImage.length,
      duplicateVariantSkus: duplicateVariantSkus.length,
      blockers: blockers.length,
      warnings: warnings.length,
    },
    duplicateVariantSkus,
    productsMissingPrice: productsMissingPrice.map((product) => ({
      productCode: product.productCode,
      name: product.name,
      variants: product.variants
        .filter((variant) => !variant.regularPriceToman)
        .map((variant) => variant.name),
    })),
    productsMissingImage: productsMissingImage.map((product) => ({
      productCode: product.productCode,
      name: product.name,
      sourceReference: product.image.sourceReference,
    })),
    blockers,
    warnings,
  };

  await writeFile(
    path.join(outputDirectory, "catalog-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(outputDirectory, "catalog-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );

  console.log(`CATALOG_EXPORT_STATUS=${status}`);
  console.log(`CATEGORIES=${report.summary.categories}`);
  console.log(`PRODUCTS=${report.summary.products}`);
  console.log(`VARIANTS=${report.summary.variants}`);
  console.log(`UNIQUE_ASSETS=${report.summary.uniqueAssets}`);
  console.log(`PRODUCTS_MISSING_PRICE=${report.summary.productsMissingPrice}`);
  console.log(`PRODUCTS_MISSING_IMAGE=${report.summary.productsMissingImage}`);
  console.log(`DUPLICATE_VARIANT_SKUS=${report.summary.duplicateVariantSkus}`);
  console.log(`BLOCKERS=${report.summary.blockers}`);
  console.log(`WARNINGS=${report.summary.warnings}`);
  console.log(`OUTPUT=${outputDirectory}`);
};

exportCatalog().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
