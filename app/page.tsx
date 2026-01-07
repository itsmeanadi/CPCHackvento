import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Redirect to login - the middleware will handle role-based redirects after login
  redirect("/login");

  return null; // This line will never be reached due to redirect
}