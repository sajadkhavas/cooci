import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { WifiOff } from "lucide-react";
import { isBackendEnabled } from "@/lib/api";
import { loadStoreSettings } from "@/lib/content";

export const loader = async (_args: LoaderFunctionArgs) => {
  const settings = isBackendEnabled
    ? (await loadStoreSettings().catch(() => undefined))?.settings ?? {}
    : {};
  return {
    title: typeof settings["pwa.offline_title"] === "string"
      ? settings["pwa.offline_title"]
      : "اتصال اینترنت در دسترس نیست",
    description: typeof settings["pwa.offline_description"] === "string"
      ? settings["pwa.offline_description"]
      : "پس از اتصال دوباره، صفحه را تازه‌سازی کنید.",
  };
};

export default function OfflinePage() {
  const { title, description } = useLoaderData<typeof loader>();
  return (
    <section className="container-custom flex min-h-[65vh] items-center justify-center py-16 text-center">
      <div className="max-w-xl rounded-[2rem] border border-[#27390c]/15 bg-white/75 p-8 shadow-soft sm:p-12">
        <WifiOff className="mx-auto text-[#58741f]" size={48} aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-black text-[#27390c] sm:text-3xl">{title}</h1>
        <p className="mt-4 leading-8 text-[#27390c]/70">{description}</p>
        <button className="mt-7 rounded-full bg-[#d0e596] px-6 py-3 font-black text-[#27390c]" onClick={() => window.location.reload()}>
          تلاش دوباره
        </button>
      </div>
    </section>
  );
}
