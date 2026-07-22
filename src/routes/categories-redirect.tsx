import { redirect } from "react-router";

export const loader = () => redirect("/products", 301);

export default function CategoriesRedirectRoute() {
  return null;
}
