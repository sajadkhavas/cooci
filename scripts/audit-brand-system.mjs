import fs from "node:fs";

const errors = [];
const read = (path) => {
  if (!fs.existsSync(path)) {
    errors.push(`Missing brand file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
};

const files = {
  theme: "src/styles/brand-theme.css",
  main: "src/main.tsx",
  brand: "src/config/brand.ts",
  logo: "public/brand/winimi-logo.svg",
  icon192: "public/icons/winimi-192.svg",
  icon512: "public/icons/winimi-512.svg",
  manifest: "public/manifest.webmanifest",
  index: "index.html",
  offline: "public/offline.html",
};

const sources = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, read(path)]),
);

const requireText = (file, text, description = text) => {
  if (!sources[file].includes(text)) {
    errors.push(`${files[file]}: missing ${description}.`);
  }
};

const forbidText = (file, text, description = text) => {
  if (sources[file].toLowerCase().includes(text.toLowerCase())) {
    errors.push(`${files[file]}: contains retired ${description}.`);
  }
};

requireText("theme", "--brand-pastel: 76 60% 74%", "exact #D0E596 HSL token");
requireText("theme", "--primary: var(--brand-pastel)", "pastel primary mapping");
requireText("theme", "--pistachio: var(--brand-pastel)", "legacy green token remap");
requireText("theme", "--sidebar-primary: var(--brand-pastel)", "sidebar primary remap");
requireText("theme", 'background-image: url("/brand/winimi-logo.svg")', "header/footer logo replacement");
requireText("theme", ".text-primary", "accessible dark text override on light backgrounds");
requireText("main", 'import "./styles/brand-theme.css"', "brand stylesheet import");
requireText("brand", 'logoPath: "/brand/winimi-logo.svg"', "official logo path");
requireText("brand", 'primaryColor: "#D0E596"', "official brand hex");
requireText("brand", 'brandInkColor: "#27390C"', "official dark logo ink");
requireText("logo", 'fill="#D0E596"', "pastel logo surface");
requireText("logo", 'stroke="#27390C"', "dark cake mark");
requireText("logo", ">winimi</text>", "Winimi wordmark");
requireText("logo", ">Bakery</text>", "Bakery wordmark");
requireText("icon192", 'fill="#D0E596"', "192 icon pastel surface");
requireText("icon512", 'fill="#D0E596"', "512 icon pastel surface");
requireText("manifest", '"theme_color": "#D0E596"', "PWA pastel theme color");
requireText("index", 'name="theme-color" content="#D0E596"', "browser pastel theme color");
requireText("offline", 'src="/brand/winimi-logo.svg"', "offline logo");
requireText("offline", "background: #d0e596", "offline pastel action");

for (const file of ["icon192", "icon512", "manifest", "index", "offline"]) {
  forbidText(file, "#356f50", "old dark-green brand color #356f50");
  forbidText(file, "#7b9b45", "old olive brand color #7b9b45");
}

const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
};
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (first, second) => {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

const brandContrast = contrast("#D0E596", "#27390C");
if (brandContrast < 7) {
  errors.push(`Brand color contrast is ${brandContrast.toFixed(2)}:1; expected WCAG AAA contrast of at least 7:1.`);
}

const modernImport = sources.main.indexOf('import "./styles/modern-pages.css"');
const brandImport = sources.main.indexOf('import "./styles/brand-theme.css"');
if (brandImport < modernImport) {
  errors.push("src/main.tsx: brand theme must load after the shared modern-page styles.");
}

if (errors.length) {
  console.error(`Winimi brand audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Winimi brand audit passed: #D0E596 is primary, the official logo is wired across browser/PWA/offline surfaces, and contrast is ${brandContrast.toFixed(2)}:1.`,
);
