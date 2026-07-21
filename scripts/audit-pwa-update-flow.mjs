import fs from "node:fs";

const filePath = "src/components/pwa/PwaUpdatePrompt.tsx";
const errors = [];

if (!fs.existsSync(filePath)) {
  errors.push(`Missing PWA update component: ${filePath}`);
} else {
  const source = fs.readFileSync(filePath, "utf8");
  const requireText = (text, label) => {
    if (!source.includes(text)) errors.push(`${filePath}: missing ${label}`);
  };
  const forbidText = (text, label) => {
    if (source.includes(text)) errors.push(`${filePath}: contains forbidden ${label}`);
  };

  requireText("useRef", "explicit update intent ref");
  requireText("const updateRequestedRef = useRef(false)", "initial no-reload state");
  requireText("if (updateRequestedRef.current) window.location.reload();", "intent-gated controller reload");
  requireText("updateRequestedRef.current = true", "update intent before SKIP_WAITING");
  requireText('waitingWorker.postMessage({ type: "SKIP_WAITING" })', "waiting worker activation");
  forbidText(
    "const handleControllerChange = () => window.location.reload();",
    "unconditional first-install reload",
  );
}

if (errors.length) {
  console.error(`PWA update-flow audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("PWA update-flow audit passed: first install is stable and reload requires explicit user intent.");
