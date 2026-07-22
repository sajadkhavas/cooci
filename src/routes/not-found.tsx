import NotFoundPage from "@/pages/NotFoundPage";

export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export function ErrorBoundary() {
  return <NotFoundPage />;
}

export default NotFoundPage;
