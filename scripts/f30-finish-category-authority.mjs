import fs from "node:fs";

const replaceRequired = (file, before, after) => {
  const source = fs.readFileSync(file, "utf8");
  if (!source.includes(before)) {
    throw new Error(`F30 transform anchor missing in ${file}: ${before.slice(0, 80)}`);
  }
  fs.writeFileSync(file, source.replace(before, after));
};

replaceRequired(
  "src/lib/catalog-api.ts",
  `  faq: Array<{ question: string; answer: string }>;\n}`,
  `  faq: Array<{ question: string; answer: string }>;\n  guides: Array<{ href: string; title: string; description: string }>;\n}`,
);

replaceRequired(
  "src/lib/catalog-api.ts",
  `const parseCategoryLandings = (value: unknown): CatalogCategoryLanding[] => {`,
  `const parseGuideLinks = (value: unknown) => {\n  if (!Array.isArray(value)) return [];\n  return value.flatMap((item) => {\n    if (!isRecord(item)) return [];\n    const href = optionalText(item.href);\n    const title = optionalText(item.title);\n    const description = optionalText(item.description);\n    return href && href.startsWith("/") && !href.startsWith("//") && title && description\n      ? [{ href, title, description }]\n      : [];\n  });\n};\n\nconst parseCategoryLandings = (value: unknown): CatalogCategoryLanding[] => {`,
);

replaceRequired(
  "src/lib/catalog-api.ts",
  `        faq: parseCopyPairs(item.faq, "question", "answer") as Array<{\n          question: string;\n          answer: string;\n        }>,`,
  `        faq: parseCopyPairs(item.faq, "question", "answer") as Array<{\n          question: string;\n          answer: string;\n        }>,\n        guides: parseGuideLinks(item.guides),`,
);

replaceRequired(
  "src/pages/ProductsPage.tsx",
  `import {\n  useCatalogCategories,\n  useCatalogProducts,\n} from "@/hooks/useCatalog";`,
  `import { useCatalogProducts } from "@/hooks/useCatalog";\nimport { useCatalogDirectory } from "@/hooks/useCatalogDirectory";`,
);

replaceRequired(
  "src/pages/ProductsPage.tsx",
  `  const { categories, isLoading: categoriesLoading } = useCatalogCategories();\n  const content = slug ? getCategoryContent(slug) : undefined;`,
  `  const { categories, landings, isLoading: categoriesLoading } = useCatalogDirectory();\n  const fallbackContent = slug ? getCategoryContent(slug) : undefined;\n  const content = slug\n    ? landings.find((landing) => landing.slug === slug) ?? fallbackContent\n    : undefined;\n  const editorialCategories = landings.length > 0 ? landings : categoryContents;`,
);

replaceRequired(
  "src/pages/ProductsPage.tsx",
  `  const visibleCategories = buildVisibleCatalogCategories(\n    categoryContents,\n    categories,\n  );`,
  `  const visibleCategories = buildVisibleCatalogCategories(\n    editorialCategories,\n    categories,\n  );`,
);

replaceRequired(
  "src/components/catalog/CategoryShowcase.tsx",
  `import { useCatalogCategories } from "@/hooks/useCatalog";`,
  `import { useCatalogDirectory } from "@/hooks/useCatalogDirectory";`,
);

replaceRequired(
  "src/components/catalog/CategoryShowcase.tsx",
  `  const { categories } = useCatalogCategories();\n  const resolvedLimit = Math.min(Math.max(limit, 0), 6);\n  const visibleCategories = buildVisibleCatalogCategories(\n    categoryContents,\n    categories,\n  )`,
  `  const { categories, landings } = useCatalogDirectory();\n  const editorialCategories = landings.length > 0 ? landings : categoryContents;\n  const resolvedLimit = Math.min(Math.max(limit, 0), 6);\n  const visibleCategories = buildVisibleCatalogCategories(\n    editorialCategories,\n    categories,\n  )`,
);

replaceRequired(
  "src/components/layout/Footer.tsx",
  `import { useCatalogCategories } from "@/hooks/useCatalog";`,
  `import { useCatalogDirectory } from "@/hooks/useCatalogDirectory";`,
);

replaceRequired(
  "src/components/layout/Footer.tsx",
  `  const { settings, content } = useStorefrontSettings();\n  const { categories } = useCatalogCategories();\n  const categoryLinks = buildVisibleCatalogCategories(\n    categoryContents,\n    categories,\n  ).map((category) => ({`,
  `  const { settings, content } = useStorefrontSettings();\n  const { categories, landings } = useCatalogDirectory();\n  const editorialCategories = landings.length > 0 ? landings : categoryContents;\n  const categoryLinks = buildVisibleCatalogCategories(\n    editorialCategories,\n    categories,\n  ).map((category) => ({`,
);

console.log("F30 category authority transform applied.");
