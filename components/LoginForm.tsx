"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.replace("/admin/dashboard"); router.refresh();
    } catch(err) { setError(err instanceof Error ? err.message : "Login failed."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}>
    {error && <div className="error">{error}</div>}
    <div className="field" style={{marginBottom:14}}><label>Username</label><input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required /></div>
    <div className="field"><label>Password</label><input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
    <div className="admin-actions"><button className="button" disabled={busy}>{busy?"Signing in…":"Sign in"}</button><a className="button secondary" href="/">View site</a></div>
  </form>;
}
