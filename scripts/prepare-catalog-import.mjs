import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const defaultInputDirectory = path.resolve("build/catalog-migration");

const parseArguments = (values) => {
  const result = {
    inputDirectory: defaultInputDirectory,
    outputDirectory: null,
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value === "--input") {
      const candidate = values[index + 1];
      if (!candidate) throw new Error("--input requires a directory path.");
      result.inputDirectory = path.resolve(process.cwd(), candidate);
      index += 1;
      continue;
    }

    if (value === "--output") {
      const candidate = values[index + 1];
      if (!candidate) throw new Error("--output requires a directory path.");
      result.outputDirectory = path.resolve(process.cwd(), candidate);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${value}`);
  }

  result.outputDirectory ??= path.join(result.inputDirectory, "prepared");
  return result;
};

const readJson = async (filePath) =>
  JSON.parse(await readFile(filePath, "utf8"));

const duplicateValues = (values) => {
  const counts = new Map();
  for (const value of values.filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
};

const migrationResolutions = new Map([
  [
    "tiramisu-24cm",
    {
      action: "merge-standalone-product-into-existing-variant",
      targetProductCode: "VIN-TS-018",
      targetVariantSku: "VIN-TL-019",
      reason:
        "The standalone 24 cm tiramisu duplicates the 24 cm variant already attached to the main tiramisu product.",
    },
  ],
]);

const prepareImport = async () => {
  const options = parseArguments(process.argv.slice(2));
  const sourceManifestPath = path.join(
    options.inputDirectory,
    "catalog-manifest.json",
  );
  const sourceManifest = await readJson(sourceManifestPath);

  if (sourceManifest.format !== "winimi-legacy-frontend-catalog-v1") {
    throw new Error(
      `Unsupported catalog format: ${String(sourceManifest.format)}`,
    );
  }
  if (!Array.isArray(sourceManifest.categories)) {
    throw new Error("Source catalog categories must be an array.");
  }
  if (!Array.isArray(sourceManifest.products)) {
    throw new Error("Source catalog products must be an array.");
  }

  const blockers = [];
  const warnings = [];
  const excludedProducts = [];
  const pendingProducts = [];
  const readyProducts = [];

  for (const product of sourceManifest.products) {
    const resolution = migrationResolutions.get(product.slug);
    if (resolution) {
      const targetProduct = sourceManifest.products.find(
        (candidate) => candidate.productCode === resolution.targetProductCode,
      );
      const targetVariant = targetProduct?.variants?.find(
        (variant) => variant.sku === resolution.targetVariantSku,
      );

      if (!targetProduct || !targetVariant) {
        blockers.push(
          `Resolution target missing for ${product.productCode}: ${resolution.targetProductCode}/${resolution.targetVariantSku}.`,
        );
      }

      excludedProducts.push({
        sourceId: product.sourceId,
        slug: product.slug,
        productCode: product.productCode,
        name: product.name,
        ...resolution,
      });
      continue;
    }

    const pendingReasons = [];
    const missingPriceVariants = (product.variants ?? []).filter(
      (variant) =>
        !Number.isFinite(variant.regularPriceToman) ||
        variant.regularPriceToman <= 0,
    );
    if (missingPriceVariants.length) {
      pendingReasons.push({
        code: "missing-price",
        variants: missingPriceVariants.map((variant) => ({
          name: variant.name,
          sku: variant.sku,
        })),
      });
    }
    if (!product.image?.portablePath) {
      pendingReasons.push({ code: "missing-portable-image" });
    }
    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      pendingReasons.push({ code: "missing-variant" });
    }

    const normalizedProduct = {
      ...product,
      contentVerified: false,
      mediaVerified: false,
      isActive: false,
      variants: (product.variants ?? []).map((variant) => ({
        ...variant,
        stockQuantity: 0,
        isActive: false,
      })),
    };

    if (pendingReasons.length) {
      pendingProducts.push({
        ...normalizedProduct,
        migrationStatus: "pending-review",
        pendingReasons,
      });
      continue;
    }

    readyProducts.push({
      ...normalizedProduct,
      migrationStatus: "draft-ready",
    });
  }

  const categories = sourceManifest.categories.map((category) => ({
    ...category,
    isActive: false,
  }));
  const categorySlugs = new Set(categories.map((category) => category.slug));

  for (const product of readyProducts) {
    if (!categorySlugs.has(product.categorySlug)) {
      blockers.push(
        `Ready product ${product.productCode} references unknown category ${product.categorySlug}.`,
      );
    }
  }

  const duplicateCategorySlugs = duplicateValues(
    categories.map((category) => category.slug),
  );
  const duplicateProductSlugs = duplicateValues(
    readyProducts.map((product) => product.slug),
  );
  const duplicateProductCodes = duplicateValues(
    readyProducts.map((product) => product.productCode),
  );
  const readyVariants = readyProducts.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productCode: product.productCode,
    })),
  );
  const duplicateVariantSkus = duplicateValues(
    readyVariants.map((variant) => variant.sku),
  );

  for (const duplicate of duplicateCategorySlugs) {
    blockers.push(
      `Duplicate category slug: ${duplicate.value} (${duplicate.count}).`,
    );
  }
  for (const duplicate of duplicateProductSlugs) {
    blockers.push(
      `Duplicate product slug: ${duplicate.value} (${duplicate.count}).`,
    );
  }
  for (const duplicate of duplicateProductCodes) {
    blockers.push(
      `Duplicate product code: ${duplicate.value} (${duplicate.count}).`,
    );
  }
  for (const duplicate of duplicateVariantSkus) {
    blockers.push(
      `Duplicate ready variant SKU: ${duplicate.value} (${duplicate.count}).`,
    );
  }

  if (pendingProducts.length) {
    warnings.push(
      `${pendingProducts.length} product(s) remain pending and are excluded from the draft import bundle.`,
    );
  }
  if (excludedProducts.length) {
    warnings.push(
      `${excludedProducts.length} duplicate standalone product(s) were resolved explicitly.`,
    );
  }

  const status = blockers.length ? "blocked" : "ready-for-draft-import";
  const preparedManifest = {
    format: "winimi-catalog-draft-import-v1",
    generatedAt: new Date().toISOString(),
    source: {
      ...sourceManifest.source,
      generatedAt: sourceManifest.generatedAt,
      manifest: sourceManifestPath,
    },
    importPolicy: {
      categoriesActive: false,
      productsActive: false,
      variantsActive: false,
      contentVerified: false,
      mediaVerified: false,
      stockQuantity: 0,
      note:
        "Only draft-ready products are included. Pending and explicitly excluded source products are preserved in the report and are never imported automatically.",
    },
    categories,
    products: readyProducts,
  };

  const report = {
    status,
    summary: {
      sourceProducts: sourceManifest.products.length,
      categories: categories.length,
      readyProducts: readyProducts.length,
      readyVariants: readyVariants.length,
      pendingProducts: pendingProducts.length,
      excludedProducts: excludedProducts.length,
      duplicateReadyVariantSkus: duplicateVariantSkus.length,
      blockers: blockers.length,
      warnings: warnings.length,
    },
    pendingProducts: pendingProducts.map((product) => ({
      sourceId: product.sourceId,
      productCode: product.productCode,
      slug: product.slug,
      name: product.name,
      pendingReasons: product.pendingReasons,
    })),
    excludedProducts,
    duplicateReadyVariantSkus: duplicateVariantSkus,
    blockers,
    warnings,
  };

  await mkdir(options.outputDirectory, { recursive: true });
  await writeFile(
    path.join(options.outputDirectory, "catalog-import-manifest.json"),
    `${JSON.stringify(preparedManifest, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(options.outputDirectory, "catalog-import-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );

  console.log(`CATALOG_PREPARE_STATUS=${status}`);
  console.log(`SOURCE_PRODUCTS=${report.summary.sourceProducts}`);
  console.log(`CATEGORIES=${report.summary.categories}`);
  console.log(`READY_PRODUCTS=${report.summary.readyProducts}`);
  console.log(`READY_VARIANTS=${report.summary.readyVariants}`);
  console.log(`PENDING_PRODUCTS=${report.summary.pendingProducts}`);
  console.log(`EXCLUDED_PRODUCTS=${report.summary.excludedProducts}`);
  console.log(
    `DUPLICATE_READY_VARIANT_SKUS=${report.summary.duplicateReadyVariantSkus}`,
  );
  console.log(`BLOCKERS=${report.summary.blockers}`);
  console.log(`WARNINGS=${report.summary.warnings}`);
  console.log(`OUTPUT=${options.outputDirectory}`);
};

prepareImport().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
