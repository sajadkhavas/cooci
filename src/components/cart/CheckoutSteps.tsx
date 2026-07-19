import { Check, CreditCard, MapPin, ShoppingCart } from "lucide-react";

export type CheckoutStep = "cart" | "delivery" | "payment";

interface CheckoutStepsProps {
  current: CheckoutStep;
}

const steps = [
  { id: "cart" as const, label: "سبد خرید", icon: ShoppingCart },
  { id: "delivery" as const, label: "اطلاعات ارسال", icon: MapPin },
  { id: "payment" as const, label: "پرداخت", icon: CreditCard },
];

export const CheckoutSteps = ({ current }: CheckoutStepsProps) => {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol className="mx-auto mb-10 grid max-w-3xl grid-cols-3" aria-label="مراحل ثبت سفارش">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step.id} className="relative flex flex-col items-center text-center">
            {index > 0 && (
              <span
                className={`absolute left-1/2 right-[-50%] top-5 h-0.5 ${
                  index <= currentIndex ? "bg-primary" : "bg-border"
                }`}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                isCompleted || isCurrent
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isCompleted ? <Check size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
            </span>
            <span
              className={`mt-2 text-xs font-bold sm:text-sm ${
                isCurrent ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};
