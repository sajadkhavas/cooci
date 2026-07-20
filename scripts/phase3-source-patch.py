from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    source = file_path.read_text(encoding="utf-8")
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected exactly one match, found {count}\n--- expected ---\n{old}")
    file_path.write_text(source.replace(old, new, 1), encoding="utf-8")


# Product detail: select a safe variant, preserve variant discounts and send authoritative stock snapshots.
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''  getProductSalePrice,\n  getProductStock,\n  getPublicAllergens,''',
    '''  getProductSalePrice,\n  getProductStock,\n  getPreferredProductVariant,\n  getPublicAllergens,''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''  getStockPresentation,\n  isProductContentVerified,''',
    '''  getStockPresentation,\n  getVariantDiscountPercent,\n  getVariantDisplayPrice,\n  getVariantRegularPrice,\n  getVariantSalePrice,\n  isProductContentVerified,''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''  const selectedVariant = useMemo(\n    () =>\n      product?.variants?.find((variant) => variant.id === selectedVariantId) ??\n      product?.variants?.[0],\n    [product, selectedVariantId],\n  );''',
    '''  const selectedVariant = useMemo(\n    () =>\n      product?.variants?.find((variant) => variant.id === selectedVariantId) ??\n      (product ? getPreferredProductVariant(product) : undefined),\n    [product, selectedVariantId],\n  );''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''  const regularPrice = selectedVariant?.price ?? getProductRegularPrice(product);\n  const salePrice = selectedVariant ? undefined : getProductSalePrice(product);\n  const activePrice = salePrice ?? regularPrice;''',
    '''  const regularPrice = selectedVariant\n    ? getVariantRegularPrice(selectedVariant)\n    : getProductRegularPrice(product);\n  const salePrice = selectedVariant\n    ? getVariantSalePrice(selectedVariant)\n    : getProductSalePrice(product);\n  const activePrice = selectedVariant\n    ? getVariantDisplayPrice(selectedVariant)\n    : salePrice ?? regularPrice;''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''  const discountPercent = salePrice ? getDiscountPercent(product) : 0;''',
    '''  const discountPercent = selectedVariant\n    ? getVariantDiscountPercent(selectedVariant)\n    : salePrice\n      ? getDiscountPercent(product)\n      : 0;''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''          availability:\n            activeStock > 0\n              ? "https://schema.org/InStock"\n              : "https://schema.org/OutOfStock",\n          url: `${brandConfig.website}/products/${product.slug}`,''',
    '''          ...(inventoryVerified\n            ? {\n                availability:\n                  activeStock > 0\n                    ? "https://schema.org/InStock"\n                    : "https://schema.org/OutOfStock",\n              }\n            : {}),\n          url: `${brandConfig.website}/products/${encodeURIComponent(product.slug)}`,''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''        priceToman: activePrice,\n        requiresCooling: Boolean(product.requiresCooling),\n        image: product.images[0]?.url ?? "",\n        selectedVariant: selectedVariant\n          ? {\n              id: selectedVariant.id,\n              name: selectedVariant.name,\n              priceToman: activePrice,\n            }''',
    '''        priceToman: activePrice,\n        regularPriceToman:\n          regularPrice && regularPrice > activePrice ? regularPrice : undefined,\n        stock: activeStock,\n        requiresCooling: Boolean(product.requiresCooling),\n        image: product.images[0]?.url ?? "",\n        selectedVariant: selectedVariant\n          ? {\n              id: selectedVariant.id,\n              name: selectedVariant.name,\n              priceToman: activePrice,\n              stock: activeStock,\n            }''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''        description={product.seo?.description ?? product.shortDescription}''',
    '''        description={product.seo?.description || publicDescription}''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''              { name: product.category, href: `/products?category=${product.categorySlug}` },''',
    '''              {\n                name: product.category,\n                href: `/products?category=${encodeURIComponent(product.categorySlug)}`,\n              },''',
)
replace_once(
    "src/pages/ProductDetailPage.tsx",
    '''              اطلاعات داخلی محصول نمایش داده می‌شود؛ ارتباط با منبع اصلی کاتالوگ موقتاً برقرار نیست.''',
    '''              آخرین اطلاعات دریافت‌شده نمایش داده می‌شود؛ به‌روزرسانی کاتالوگ موقتاً ناموفق بود.''',
)

# Product card: never add unknown stock and never publish unverified marketing copy.
replace_once(
    "src/components/ProductCard.tsx",
    '''  getPublicProductBadges,\n  getStockPresentation,''',
    '''  getPublicProductBadges,\n  getPublicProductSummary,\n  getStockPresentation,''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''  const publicBadges = getPublicProductBadges(product);''',
    '''  const publicBadges = getPublicProductBadges(product);\n  const publicSummary = getPublicProductSummary(product);''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''  const isOutOfStock = inventoryVerified && stock <= 0;\n  const isCartAtStockLimit = Boolean(\n    inventoryVerified && cartItem && cartItem.quantity >= stock,\n  );''',
    '''  const isOutOfStock = stock <= 0;\n  const isCartAtStockLimit = Boolean(\n    cartItem && stock > 0 && cartItem.quantity >= stock,\n  );''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''      toast.error("این محصول براساس موجودی تأییدشده ناموجود است");''',
    '''      toast.error(\n        inventoryVerified\n          ? "این محصول براساس موجودی تأییدشده ناموجود است"\n          : "موجودی قابل سفارش این محصول هنوز از سرور دریافت نشده است",\n      );''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''        to={`/products/${product.slug}`}''',
    '''        to={`/products/${encodeURIComponent(product.slug)}`}''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''            to={`/products?category=${product.categorySlug}`}''',
    '''            to={`/products?category=${encodeURIComponent(product.categorySlug)}`}''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''        <Link to={`/products/${product.slug}`} className="rounded-xl">''',
    '''        <Link\n          to={`/products/${encodeURIComponent(product.slug)}`}\n          className="rounded-xl"\n        >''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''          {product.shortDescription}''',
    '''          {publicSummary}''',
)
replace_once(
    "src/components/ProductCard.tsx",
    '''                to={`/products/${product.slug}`}''',
    '''                to={`/products/${encodeURIComponent(product.slug)}`}''',
)

# Products page: apply related URL changes atomically and avoid unbounded query input.
replace_once(
    "src/pages/ProductsPage.tsx",
    '''  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;''',
    '''  return Number.isFinite(parsed) && parsed > 0\n    ? Math.min(10_000, parsed)\n    : 1;''',
)
replace_once(
    "src/pages/ProductsPage.tsx",
    '''    isBackendCatalogEnabled,\n  } = useCatalogProducts({''',
    '''    isBackendCatalogEnabled,\n    refetch,\n  } = useCatalogProducts({''',
)
replace_once(
    "src/pages/ProductsPage.tsx",
    '''  const updateParam = (key: string, value: string | null) => {\n    const next = new URLSearchParams(searchParams);\n    if (!value || value === "all" || value === "featured") next.delete(key);\n    else next.set(key, value);\n    if (key !== "page") next.delete("page");\n    setSearchParams(next, { replace: true });\n  };''',
    '''  const updateParams = (updates: Record<string, string | null>) => {\n    const next = new URLSearchParams(searchParams);\n    Object.entries(updates).forEach(([key, value]) => {\n      if (!value || value === "all" || value === "featured") next.delete(key);\n      else next.set(key, value);\n    });\n    if (!("page" in updates)) next.delete("page");\n    setSearchParams(next, { replace: true });\n  };\n\n  const updateParam = (key: string, value: string | null) =>\n    updateParams({ [key]: value });''',
)
replace_once(
    "src/pages/ProductsPage.tsx",
    '''                      updateParam("category", category.slug);\n                      if (dietOnly) updateParam("diet", null);''',
    '''                      updateParams({ category: category.slug, diet: null });''',
)
replace_once(
    "src/pages/ProductsPage.tsx",
    '''                  onChange={(event) => updateParam("q", event.target.value)}''',
    '''                  onChange={(event) =>\n                    updateParam("q", event.target.value.slice(0, 120))\n                  }''',
)
replace_once(
    "src/pages/ProductsPage.tsx",
    '''                onClick={() => updateParam("diet", dietOnly ? null : "true")}''',
    '''                onClick={() =>\n                  updateParams(\n                    dietOnly\n                      ? { diet: null }\n                      : { diet: "true", category: null },\n                  )\n                }''',
)
replace_once(
    "src/pages/ProductsPage.tsx",
    '''                  onClick={() => window.location.reload()}''',
    '''                  onClick={() => void refetch()}''',
)

# Cart page: reconcile exact product slugs and block checkout until that finishes.
replace_once(
    "src/pages/CartPage.tsx",
    '''import { useEffect } from "react";\n''',
    '''''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''import { useCatalogProducts } from "@/hooks/useCatalog";''',
    '''import { useCartCatalogReconciliation } from "@/hooks/useCartCatalogReconciliation";''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''  const { products: catalogProducts } = useCatalogProducts();\n  const navigate = useNavigate();\n\n  useEffect(() => {\n    if (catalogProducts.length > 0) syncWithCatalog(catalogProducts);\n  }, [catalogProducts, syncWithCatalog]);''',
    '''  const navigate = useNavigate();\n  const {\n    isLoading: cartCatalogLoading,\n    isReconciled: cartCatalogReconciled,\n    error: cartCatalogError,\n    refetch: refetchCartCatalog,\n  } = useCartCatalogReconciliation(items, syncWithCatalog);''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''    if (!isReadyForCheckout) {\n      toast.error("ابتدا مشکلات موجودی یا محصولات نامعتبر سبد را برطرف کنید");''',
    '''    if (cartCatalogLoading || !cartCatalogReconciled || cartCatalogError) {\n      toast.error("ابتدا تطبیق سبد با کاتالوگ سرور را کامل کنید");\n      return;\n    }\n    if (!isReadyForCheckout) {\n      toast.error("ابتدا مشکلات موجودی یا محصولات نامعتبر سبد را برطرف کنید");''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''                       سبد شما شامل محصول یخچالی است؛ ارسال این سفارش فقط برای تهران و کرج امکان‌پذیر خواهد بود.''',
    '''                       سبد شما شامل محصول یخچالی است؛ ارسال سرد فقط برای تهران، کرج و اندیشه امکان‌پذیر خواهد بود.''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''              <div className="space-y-4 lg:col-span-2">\n                {hasCoolingItems && (''',
    '''              <div className="space-y-4 lg:col-span-2">\n                {cartCatalogLoading && (\n                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary" role="status">\n                    در حال تطبیق تک‌تک محصولات سبد با کاتالوگ سرور…\n                  </div>\n                )}\n\n                {cartCatalogError && (\n                  <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-destructive" role="alert">\n                    <p className="font-bold">به‌روزرسانی سبد ناموفق بود</p>\n                    <p className="mt-1 text-sm leading-7">{cartCatalogError.message}</p>\n                    <button\n                      type="button"\n                      onClick={() => void refetchCartCatalog()}\n                      className="mt-3 rounded-xl border border-destructive/30 px-4 py-2 text-sm font-bold"\n                    >\n                      تلاش دوباره\n                    </button>\n                  </div>\n                )}\n\n                {hasCoolingItems && (''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''                    disabled={!isReadyForCheckout}''',
    '''                    disabled={\n                      !isReadyForCheckout ||\n                      cartCatalogLoading ||\n                      !cartCatalogReconciled ||\n                      Boolean(cartCatalogError)\n                    }''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''                  {!isReadyForCheckout && (''',
    '''                  {(!isReadyForCheckout ||\n                    cartCatalogLoading ||\n                    !cartCatalogReconciled ||\n                    cartCatalogError) && (''',
)
replace_once(
    "src/pages/CartPage.tsx",
    '''                       برای ادامه، وضعیت موجودی همه محصولات باید معتبر باشد.''',
    '''                       برای ادامه، قیمت و موجودی همه محصولات باید با کاتالوگ سرور تطبیق داده شود.''',
)

print("Phase 3 page transformations applied successfully.")
