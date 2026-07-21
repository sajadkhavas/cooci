import fs from "node:fs";
import path from "node:path";

const schemaPath = path.resolve(
  process.cwd(),
  process.argv[2] || "deploy/frontend.production.env.schema.json",
);
const envFilePath = process.argv[3]
  ? path.resolve(process.cwd(), process.argv[3])
  : null;

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const parseEnvFile = (filePath) => {
  const parsed = {};
  for (const [index, rawLine] of fs.readFileSync(filePath, "utf8").split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator <= 0) {
      throw new Error(`${filePath}:${index + 1}: invalid KEY=value line`);
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (Object.hasOwn(parsed, key)) {
      throw new Error(`${filePath}:${index + 1}: duplicate variable ${key}`);
    }
    parsed[key] = value;
  }
  return parsed;
};

const source = envFilePath ? parseEnvFile(envFilePath) : process.env;
const errors = [];
const variables = schema.variables || {};
const allowedNames = new Set(Object.keys(variables));
const forbiddenNames = new Set(schema.forbiddenNames || []);

for (const forbiddenName of forbiddenNames) {
  if (source[forbiddenName]) errors.push(`Forbidden production variable is set: ${forbiddenName}`);
}

for (const [name, rule] of Object.entries(variables)) {
  const value = source[name];
  if (rule.required && !value) {
    errors.push(`Missing required production variable: ${name}`);
    continue;
  }
  if (!value) continue;

  if (rule.exact !== undefined && value !== rule.exact) {
    errors.push(`${name} must exactly equal ${JSON.stringify(rule.exact)}`);
  }

  if (rule.type === "https-url" || rule.type === "https-origin") {
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash) {
        throw new Error("not a clean HTTPS URL");
      }
      if (rule.type === "https-origin" && parsed.origin !== value) {
        throw new Error("must be an origin without path, query or trailing slash");
      }
    } catch (error) {
      errors.push(`${name} must be a valid ${rule.type}: ${error.message}`);
    }
  }

  if (rule.type === "boolean-string" && !["true", "false"].includes(value)) {
    errors.push(`${name} must be the string true or false`);
  }

  if (rule.type === "enum" && !rule.values?.includes(value)) {
    errors.push(`${name} must be one of: ${(rule.values || []).join(", ")}`);
  }
}

if (schema.unknownViteVariables === "reject") {
  for (const name of Object.keys(source)) {
    if (name.startsWith("VITE_") && !allowedNames.has(name)) {
      errors.push(`Unknown VITE variable is forbidden in production: ${name}`);
    }
  }
}

const secretNamePattern = /(SECRET|TOKEN|PASSWORD|PRIVATE|MERCHANT|API_KEY|APP_KEY|DATABASE_URL)/i;
for (const name of Object.keys(source)) {
  if (name.startsWith("VITE_") && secretNamePattern.test(name)) {
    errors.push(`Secret-shaped VITE variable is forbidden: ${name}`);
  }
}

const report = {
  schemaVersion: schema.version,
  source: envFilePath ? path.relative(process.cwd(), envFilePath) : "process.env",
  passed: errors.length === 0,
  publicVariables: Object.keys(variables),
  errors,
};
fs.writeFileSync("production-env-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Production environment validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Production environment schema ${schema.version} passed.`);
