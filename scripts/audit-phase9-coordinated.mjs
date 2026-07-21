import fs from "node:fs";
import path from "node:path";

const backendRoot = path.resolve(process.cwd(), process.argv[2] || "backend");
const matrixPath = path.resolve(process.cwd(), "e2e/phase9-matrix.json");
const errors = [];
const checkedEvidence = [];

if (!fs.existsSync(backendRoot)) {
  errors.push(`Coordinated backend checkout is missing: ${backendRoot}`);
}

let matrix;
try {
  matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8"));
} catch (error) {
  errors.push(`Invalid Phase 9 matrix: ${error.message}`);
}

const readEvidence = (root, evidence, scenarioId) => {
  const separator = evidence.indexOf("::");
  if (separator <= 0 || separator === evidence.length - 2) {
    errors.push(`${scenarioId}: malformed evidence pointer ${evidence}`);
    return;
  }

  const relativePath = evidence.slice(0, separator);
  const token = evidence.slice(separator + 2);
  const absolutePath = path.resolve(root, relativePath);
  if (!absolutePath.startsWith(`${root}${path.sep}`)) {
    errors.push(`${scenarioId}: evidence escapes repository root: ${relativePath}`);
    return;
  }
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${scenarioId}: backend evidence file is missing: ${relativePath}`);
    return;
  }

  const source = fs.readFileSync(absolutePath, "utf8");
  if (!source.includes(token)) {
    errors.push(`${scenarioId}: backend evidence token is missing in ${relativePath}: ${token}`);
    return;
  }
  checkedEvidence.push({ scenarioId, path: relativePath, token });
};

const requiredBackendScenarios = new Set([
  "desktop-mobile-browser-matrix",
  "expired-session",
  "rate-limit-retry",
  "changed-stock",
  "changed-delivery-zone",
  "duplicate-submit-idempotency",
  "payment-terminal-and-replay",
]);

if (matrix) {
  for (const scenario of matrix.scenarios || []) {
    const evidence = Array.isArray(scenario.backendEvidence)
      ? scenario.backendEvidence
      : [];
    if (requiredBackendScenarios.has(scenario.id) && evidence.length === 0) {
      errors.push(`${scenario.id}: coordinated backend evidence is required`);
    }
    for (const pointer of evidence) {
      readEvidence(backendRoot, pointer, scenario.id);
    }
  }
}

const acceptancePath = path.join(
  backendRoot,
  "tests/Feature/EndToEndAcceptanceTest.php",
);
if (fs.existsSync(acceptancePath)) {
  const acceptance = fs.readFileSync(acceptancePath, "utf8");
  const invariants = [
    "assertTooManyRequests()",
    "phase18-dry-checkout-0001",
    "assertConflict()",
    "assertJsonPath('meta.replayed', true)",
    "phase18-chilled-rejected-0001",
    "assertUnprocessable()",
    "$this->assertSame(23",
    "InventoryReservationStatus::Consumed",
    "assertUnauthorized()",
  ];
  for (const invariant of invariants) {
    if (!acceptance.includes(invariant)) {
      errors.push(`Backend acceptance invariant is missing: ${invariant}`);
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  matrixVersion: matrix?.version,
  passed: errors.length === 0,
  checkedBackendEvidence: checkedEvidence,
  errors,
};
fs.writeFileSync(
  "phase9-coordinated-audit.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

if (errors.length) {
  console.error(`Phase 9 coordinated audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Phase 9 coordinated audit passed with ${checkedEvidence.length} verified backend evidence pointer(s).`,
);
