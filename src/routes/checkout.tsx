import { CheckoutGuard } from "@/components/cart/CheckoutGuard";
import CheckoutPage from "@/pages/CheckoutPage";

export const headers = () => ({
  "Cache-Control": "private, no-store, max-age=0",
});

export const meta = () => [
  { name: "robots", content: "noindex,nofollow" },
];

export default function CheckoutRoute() {
  return (
    <CheckoutGuard>
      <CheckoutPage />
    </CheckoutGuard>
  );
}
