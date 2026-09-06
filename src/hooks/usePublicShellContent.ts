import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { resolvePublicShellContent } from "@/lib/public-shell-content";

export const usePublicShellContent = () => {
  const { payload } = useStorefrontSettings();
  return resolvePublicShellContent(payload);
};
