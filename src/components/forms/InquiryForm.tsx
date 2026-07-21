import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { BackendInquiryType } from "@/lib/backend-contract";
import { submitInquiry } from "@/lib/content";
import {
  normalizeInquiryEmail,
  normalizeInquiryMobile,
  sanitizeInquiryMetadata,
} from "@/lib/inquiry-form";

interface InquiryFormProps {
  type: BackendInquiryType;
  title: string;
  description: string;
  subjectLabel?: string;
  messageLabel?: string;
  defaultSubject?: string;
  metadata?: Record<string, unknown>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();

  useEffect(() => {
    if (user?.fullName) {
      setFullName((current) => current || user.fullName);
    }
    if (user?.mobile) {
      setMobile((current) => current || user.mobile);
    }
  }, [user?.fullName, user?.mobile]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setError(undefined);
    setReference(undefined);

    const normalizedName = fullName.trim().slice(0, 120);
    const normalizedMobile = normalizeInquiryMobile(mobile).slice(0, 32);
    const normalizedEmail = normalizeInquiryEmail(email);
    const normalizedSubject = subject.trim().slice(0, 220);
    const normalizedMessage = message.trim().slice(0, 5000);

    if (normalizedName.length < 2) {
      setError("نام و نام خانوادگی را وارد کنید.");
      return;
    }
    if (!normalizedMobile && !normalizedEmail) {
      setError("شماره موبایل یا ایمیل را وارد کنید.");
      return;
    }
    if (normalizedMobile && !/^09\d{9}$/.test(normalizedMobile)) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }
    if (normalizedEmail && !EMAIL_PATTERN.test(normalizedEmail)) {
      setError("ایمیل معتبر نیست.");
      return;
    }
    if (normalizedMessage.length < 10) {
      setError("توضیحات درخواست باید حداقل ۱۰ کاراکتر باشد.");
      return;
    }

    setSubmitting(true);
    try {
      const inquiry = await submitInquiry({
        type,
        fullName: normalizedName,
        mobile: normalizedMobile || undefined,
        email: normalizedEmail || undefined,
        subject: normalizedSubject || undefined,
        message: normalizedMessage,
        metadata: sanitizeInquiryMetadata(metadata),
        website: website.slice(0, 1),
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
