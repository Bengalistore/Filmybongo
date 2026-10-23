import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
export default async function AdminPage() {
  if (await isAdmin()) redirect("/admin/dashboard");
  redirect("/admin/login");
}
