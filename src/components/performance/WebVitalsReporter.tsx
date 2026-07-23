import { useEffect } from "react";
import { observeCoreWebVitals } from "@/lib/performance/web-vitals";

export const WebVitalsReporter = () => {
  useEffect(() => observeCoreWebVitals(), []);
  return null;
};
