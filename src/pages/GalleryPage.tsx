import { useQuery } from "@tanstack/react-query";
import { ImageIcon, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { isBackendEnabled } from "@/lib/api";
import { loadGallery } from "@/lib/content";

const GalleryPage = () => {
  const query = useQuery({ queryKey: ["store", "gallery"], queryFn: loadGallery, enabled: isBackendEnabled, staleTime: 5 * 60_000 });
  const items = query.data ?? [];
  return (
    <>
      <SEO title="گالری" description="تصاویر منتشرشده وینیمی از منبع محتوای فروشگاه." />
      <section className="bg-secondary/50 py-12"><div className="container-custom text-center"><h1 className="heading-1">گالری تصاویر</h1><p className="body-large mt-4 text-muted-foreground">تصاویر مدیریت‌شده محصولات، بسته‌بندی و فرآیند آماده‌سازی</p></div></section>
      <section className="section-padding"><div className="container-custom">
        {query.isLoading ? <div className="py-16 text-center" role="status"><Loader2 className="mx-auto mb-3 animate-spin text-primary" aria-hidden="true" />در حال دریافت گالری…</div> : query.error ? <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive" role="alert">{query.error instanceof Error ? query.error.message : "دریافت گالری ناموفق بود."}</div> : items.length === 0 ? <div className="rounded-3xl border border-border bg-card p-10 text-center"><ImageIcon className="mx-auto mb-3 text-muted-foreground" size={42} aria-hidden="true" />هنوز تصویری منتشر نشده است.</div> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{items.map((item, index) => <a key={item.id} href={item.linkUrl || item.imageUrl} target={item.linkUrl ? "_blank" : undefined} rel={item.linkUrl ? "noopener noreferrer" : undefined} className={`group relative overflow-hidden rounded-2xl ${index % 7 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}><img src={item.imageUrl} alt={item.title} className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-white"><p className="font-bold">{item.title}</p>{item.caption && <p className="mt-1 text-xs text-white/75">{item.caption}</p>}</div></a>)}</div>}
      </div></section>
    </>
  );
};

export default GalleryPage;
