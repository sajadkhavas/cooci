import { useEffect, useState } from "react";
import { Edit3, Loader2, MapPin, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createAccountAddress,
  deleteAccountAddress,
  loadAccountAddresses,
  updateAccountAddress,
} from "@/lib/account";
import type {
  BackendAddress,
  BackendAddressInput,
} from "@/lib/backend-contract";

const emptyInput = (fullName: string, mobile: string): BackendAddressInput => ({
  title: "خانه",
  recipientName: fullName,
  mobile,
  province: "",
  city: "",
  address: "",
  postalCode: "",
  isDefault: false,
});

export const AccountAddresses = ({
  fullName,
  mobile,
}: {
  fullName: string;
  mobile: string;
}) => {
  const [addresses, setAddresses] = useState<BackendAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string>();
  const [editingId, setEditingId] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState<BackendAddressInput>(() =>
    emptyInput(fullName, mobile),
  );

  const refresh = async () => {
    setLoading(true);
    try {
      setAddresses(await loadAccountAddresses());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "دریافت آدرس‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const reset = () => {
    setEditingId(undefined);
    setShowForm(false);
    setInput(emptyInput(fullName, mobile));
  };

  const startEdit = (address: BackendAddress) => {
    setEditingId(address.id);
    setInput({
      title: address.title,
      recipientName: address.recipientName,
      mobile: address.mobile,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode || "",
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = editingId
        ? await updateAccountAddress(editingId, input)
        : await createAccountAddress(input);
      setAddresses((current) => {
        const next = editingId
          ? current.map((address) => (address.id === editingId ? saved : address))
          : [saved, ...current];
        return next
          .map((address) =>
            saved.isDefault && address.id !== saved.id
              ? { ...address, isDefault: false }
              : address,
          )
          .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
      });
      toast.success(editingId ? "آدرس به‌روزرسانی شد" : "آدرس ذخیره شد");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره آدرس ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (address: BackendAddress) => {
    if (!window.confirm(`آدرس «${address.title}» حذف شود؟`)) return;
    setDeletingId(address.id);
    try {
      await deleteAccountAddress(address.id);
      setAddresses((current) => current.filter((item) => item.id !== address.id));
      toast.success("آدرس حذف شد");
      if (editingId === address.id) reset();
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حذف آدرس ناموفق بود.");
    } finally {
      setDeletingId(undefined);
    }
  };

  const field = (
    key: keyof BackendAddressInput,
    label: string,
    options: { required?: boolean; dir?: "ltr" | "rtl"; textarea?: boolean } = {},
  ) => (
    <label className={options.textarea ? "md:col-span-2" : ""}>
      <span className="mb-1.5 block text-sm font-bold text-foreground">{label}</span>
      {options.textarea ? (
        <textarea
          value={String(input[key] ?? "")}
          onChange={(event) => setInput((current) => ({ ...current, [key]: event.target.value }))}
          required={options.required}
          rows={3}
          className="input-field w-full resize-y bg-background"
        />
      ) : (
        <input
          value={String(input[key] ?? "")}
          onChange={(event) => setInput((current) => ({ ...current, [key]: event.target.value }))}
          required={options.required}
          dir={options.dir}
          className="input-field w-full bg-background"
        />
      )}
    </label>
  );

  return (
    <section className="mb-10 rounded-3xl border border-border bg-card p-5 shadow-soft md:p-7" aria-labelledby="addresses-title">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 id="addresses-title" className="text-2xl font-black text-foreground">آدرس‌های من</h2>
          <p className="mt-1 text-sm text-muted-foreground">آدرس انتخاب‌شده در Checkout توسط سرور و مالکیت حساب بررسی می‌شود.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (showForm) reset();
            else {
              setInput(emptyInput(fullName, mobile));
              setShowForm(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
        >
          {showForm ? <X size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
          {showForm ? "بستن فرم" : "افزودن آدرس"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-2xl bg-secondary/35 p-4 md:grid-cols-2" noValidate>
          {field("title", "عنوان آدرس", { required: true })}
          {field("recipientName", "نام گیرنده", { required: true })}
          {field("mobile", "موبایل گیرنده", { required: true, dir: "ltr" })}
          {field("postalCode", "کد پستی", { dir: "ltr" })}
          {field("province", "استان", { required: true })}
          {field("city", "شهر", { required: true })}
          {field("address", "نشانی کامل", { required: true, textarea: true })}
          <label className="md:col-span-2 flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={Boolean(input.isDefault)}
              onChange={(event) => setInput((current) => ({ ...current, isDefault: event.target.checked }))}
            />
            این آدرس پیش‌فرض باشد
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-50">
              {saving ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <Save size={17} aria-hidden="true" />}
              {saving ? "در حال ذخیره…" : editingId ? "ذخیره ویرایش" : "ذخیره آدرس"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="rounded-xl border border-border px-5 py-3 font-bold">انصراف</button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-8 text-center" role="status">
          <Loader2 className="mx-auto mb-3 animate-spin text-primary" size={32} aria-hidden="true" />
          <p className="text-sm text-muted-foreground">در حال دریافت آدرس‌ها…</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          <MapPin className="mx-auto mb-3" size={36} aria-hidden="true" />
          هنوز آدرسی ذخیره نشده است.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black">{address.title}</h3>
                    {address.isDefault && <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">پیش‌فرض</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{address.recipientName} · <span dir="ltr">{address.mobile}</span></p>
                </div>
                <MapPin size={20} className="shrink-0 text-primary" aria-hidden="true" />
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{address.province}، {address.city}، {address.address}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => startEdit(address)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-bold hover:border-primary hover:text-primary">
                  <Edit3 size={14} aria-hidden="true" /> ویرایش
                </button>
                <button type="button" onClick={() => void remove(address)} disabled={deletingId === address.id} className="inline-flex items-center gap-1 rounded-lg border border-destructive/25 px-3 py-2 text-xs font-bold text-destructive disabled:opacity-50">
                  {deletingId === address.id ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Trash2 size={14} aria-hidden="true" />} حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
