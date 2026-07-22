import PaymentMockPage from "@/pages/PaymentMockPage";

export const headers = () => ({
  "Cache-Control": "private, no-store, max-age=0",
});

export const meta = () => [
  { name: "robots", content: "noindex,nofollow" },
];

export function loader() {
  if (process.env.NODE_ENV === "production") {
    throw new Response("Not Found", { status: 404 });
  }
  return null;
}

export default PaymentMockPage;
