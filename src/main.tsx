import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/modern-pages.css";
import "./styles/brand-theme.css";
import { registerServiceWorker } from "@/lib/registerServiceWorker";

createRoot(document.getElementById("root")!).render(<App />);
registerServiceWorker();
