import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import OrderDetailPage from "@/pages/OrderDetailPage";

export const headers = () => ({
  "Cache-Control": "private, no-store, max-age=0",
});

export const meta = () => [
  { name: "robots", content: "noindex,nofollow" },
];

export default function AccountOrderRoute() {
  return (
    <ProtectedRoute>
      <OrderDetailPage />
    </ProtectedRoute>
  );
}
