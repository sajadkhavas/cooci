import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AccountPage from "@/pages/AccountPage";

export const headers = () => ({
  "Cache-Control": "private, no-store, max-age=0",
});

export const meta = () => [
  { name: "robots", content: "noindex,nofollow" },
];

export default function AccountRoute() {
  return (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  );
}
