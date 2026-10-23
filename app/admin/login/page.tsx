import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/dashboard");
  return <main className="admin-wrap"><div className="admin-panel" style={{maxWidth:460,margin:"50px auto"}}>
    <h1>Admin Login</h1><p className="muted">Sign in to manage your movie catalogue.</p><LoginForm />
  </div></main>;
}
