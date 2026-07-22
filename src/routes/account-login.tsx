import { LoginRoute } from "@/components/auth/LoginRoute";
import LoginPage from "@/pages/LoginPage";

export const headers = () => ({
  "Cache-Control": "private, no-store, max-age=0",
});

export const meta = () => [
  { name: "robots", content: "noindex,nofollow" },
];

export default function AccountLoginRoute() {
  return (
    <LoginRoute>
      <LoginPage />
    </LoginRoute>
  );
}
