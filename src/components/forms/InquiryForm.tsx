import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { BackendInquiryType } from "@/lib/backend-contract";
import { submitInquiry } from "@/lib/content";

interface InquiryFormProps {
  type: BackendInquiryType;
  title: string;
  description: string;
  subjectLabel?: string;
  messageLabel?: string;
  defaultSubject?: string;
  metadata?: Record<string, unknown>;
}

export const InquiryForm = ({
  type,
  title,
  description,
  subjectLabel = "موضوع",
  messageLabel = "توضیحات درخواست",
  defaultSubject = "",
  metadata,
}: InquiryFormProps) => {
  const { user } = useAuth();
  const initialName = useMemo(() => user?.fullName || "", [user?.fullName]);
  const initialMobile = useMemo(() => user?.mobile || "", [user?.mobile]);
  const [fullName, setFullName] = useState(initialName);
  const [mobile, setMobile] = useState(initialMobile);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setReference(undefined);

    if (fullName.trim().length < 2) {
      setError("نام و نام خانوادگی را وارد کنید.");
      return;
    }
    if (!mobile.trim() && !email.trim()) {
      setError("شماره موبایل یا ایمیل را وارد کنید.");
      return;
    }
    if (message.trim().length < 10) {
      setError("توضیحات درخواست باید حداقل ۱۰ کاراکتر باشد.");
      return;
    }

    setSubmitting(true);
    try {
      const inquiry = await submitInquiry({
        type,
        fullName: fullName.trim(),
        mobile: mobile.trim() || undefined,
        email: email.trim() || undefined,
        subject: subject.trim() || undefined,
        message: message.trim(),
        metadata,
        website,
      });
      setReference(inquiry.id);
      setMessage("");
      setWebsite("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "ثبت درخواست ناموفق بود.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "input-field min-h-12 w-full bg-background";

  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"
      aria-labelledby={`${type}-inquiry-title`}
    >
      <h2 id={`${type}-inquiry-title`} className="text-2xl font-black text-foreground">
        {title}
      </h2>
      <p className="mt-2 leading-8 text-muted-foreground">{description}</p>

      {reference ? (
        <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-950" role="status">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0" size={22} aria-hidden="true" />
            <div>
              <p className="font-black">درخواست با موفقیت ثبت شد</p>
              <p className="mt-1 text-sm leading-7">
                شناسه پیگیری: <strong dir="ltr">{reference}</strong>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2" noValidate>
          <label>
            <span className="mb-1.5 block text-sm font-bold">نام و نام خانوادگی</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
              autoComplete="name"
              maxLength={120}
              required
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-bold">شماره موبایل</span>
            <input
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              className={`${inputClass} text-left`}
              autoComplete="tel"
              inputMode="tel"
              dir="ltr"
              maxLength={32}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-bold">ایمیل</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`${inputClass} text-left`}
              type="email"
              autoComplete="email"
              dir="ltr"
              maxLength={190}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-bold">{subjectLabel}</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className={inputClass}
              maxLength={220}
            />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-sm font-bold">{messageLabel}</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="input-field min-h-36 w-full resize-y bg-background"
              maxLength={5000}
              required
            />
          </label>
          <label className="hidden" aria-hidden="true">
            وب‌سایت
            <input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
          {error && (
            <div className="md:col-span-2 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm leading-7 text-destructive" role="alert">
              {error}
            </div>
          )}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-7 py-3 font-bold disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={18} aria-hidden="true" />
              )}
              {submitting ? "در حال ثبت…" : "ثبت درخواست"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
