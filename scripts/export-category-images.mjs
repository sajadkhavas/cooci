import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const categoryImages = [
  {
    slug: "cookies",
    name: "کوکی‌های خانگی",
    source: "src/assets/cookies/lifestyle-breaking.jpg",
  },
  {
    slug: "mini-cookies",
    name: "مینی کوکی",
    source: "src/assets/cookies/gallery-baking-process.jpg",
  },
  {
    slug: "cakes",
    name: "کیک و دسر",
    source: "src/assets/cookies/hero-main.jpg",
  },
  {
    slug: "diet",
    name: "رژیمی و بدون قند افزوده",
    source: "src/assets/cookies/lifestyle-twine.jpg",
  },
  {
    slug: "pastry",
    name: "رول و کروسان",
    source: "src/assets/cookies/gallery-bakery-interior.jpg",
  },
  {
    slug: "gift",
    name: "باکس هدیه",
    source: "src/assets/cookies/gallery-gift-boxes.jpg",
  },
];

const parseArguments = (values) => {
  const result = {
    outputDirectory: path.resolve("build/category-images"),
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--output") {
      const candidate = values[index + 1];
      if (!candidate) throw new Error("--output requires a directory path.");
      result.outputDirectory = path.resolve(process.cwd(), candidate);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${value}`);
  }

  return result;
};

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

const exportCategoryImages = async () => {
  const options = parseArguments(process.argv.slice(2));
  const assetsDirectory = path.join(options.outputDirectory, "assets");
  const blockers = [];
  const images = [];

  await rm(options.outputDirectory, { recursive: true, force: true });
  await mkdir(assetsDirectory, { recursive: true });

  for (const category of categoryImages) {
    const sourcePath = path.resolve(process.cwd(), category.source);
    let sourceStat;

    try {
      sourceStat = await stat(sourcePath);
    } catch {
      blockers.push(`Missing source image for ${category.slug}: ${category.source}`);
      continue;
    }

    if (!sourceStat.isFile() || sourceStat.size <= 0) {
      blockers.push(`Invalid source image for ${category.slug}: ${category.source}`);
      continue;
    }

    const extension = path.extname(sourcePath).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
      blockers.push(`Unsupported image extension for ${category.slug}: ${extension}`);
      continue;
    }

    const fileName = `${category.slug}${extension === ".jpeg" ? ".jpg" : extension}`;
    const portablePath = `assets/${fileName}`;
    const destinationPath = path.join(options.outputDirectory, portablePath);
    const contents = await readFile(sourcePath);

    await copyFile(sourcePath, destinationPath);

    images.push({
      slug: category.slug,
      name: category.name,
      sourcePath: category.source,
      portablePath,
      targetPath: `bakery/categories/${fileName}`,
      sizeBytes: contents.length,
      sha256: sha256(contents),
    });
  }

  const duplicateTargets = images
    .map((image) => image.targetPath)
    .filter((value, index, values) => values.indexOf(value) !== index);
  for (const target of new Set(duplicateTargets)) {
    blockers.push(`Duplicate target path: ${target}`);
  }

  const manifest = {
    format: "winimi-category-images-v1",
    generatedAt: new Date().toISOString(),
    source: {
      repository: "sajadkhavas/cooci",
      branch: "phase-20/full-integration",
    },
    policy: {
      categoriesRemainInactive: true,
      overwriteExistingImages: false,
      note:
        "The bundle only prepares category image files. Backend synchronization must validate hashes and keep all categories inactive.",
    },
    images,
  };

  const report = {
    status: blockers.length ? "blocked" : "ready",
    summary: {
      expectedImages: categoryImages.length,
      exportedImages: images.length,
      uniqueTargets: new Set(images.map((image) => image.targetPath)).size,
      blockers: blockers.length,
    },
    blockers,
  };

  await writeFile(
    path.join(options.outputDirectory, "category-images-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(options.outputDirectory, "category-images-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );

  console.log(`CATEGORY_IMAGE_EXPORT_STATUS=${report.status}`);
  console.log(`EXPECTED_IMAGES=${report.summary.expectedImages}`);
  console.log(`EXPORTED_IMAGES=${report.summary.exportedImages}`);
  console.log(`UNIQUE_TARGETS=${report.summary.uniqueTargets}`);
  console.log(`BLOCKERS=${report.summary.blockers}`);
  console.log(`OUTPUT=${options.outputDirectory}`);

  if (blockers.length) {
    for (const blocker of blockers) console.log(`BLOCKER=${blocker}`);
    process.exitCode = 1;
  }
};

exportCategoryImages().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
