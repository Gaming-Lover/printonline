"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ adminId: formData.get("adminId"), password: formData.get("password") })
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Unable to login");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <Label>Admin ID</Label>
        <Input name="adminId" defaultValue="admin" autoComplete="username" required />
      </div>
      <div>
        <Label>Password</Label>
        <Input name="password" type="password" defaultValue="admin123" autoComplete="current-password" required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" disabled={busy}>Open admin panel</Button>
    </form>
  );
}
