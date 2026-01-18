"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: passwort,
    });

    if (error) {
      alert("Login fehlgeschlagen: " + error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white border rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <div className="mb-4">
          <label className="block font-bold mb-1">E-Mail</label>
          <input
            type="email"
            className="p-2 border rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-1">Passwort</label>
          <input
            type="password"
            className="p-2 border rounded w-full"
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={login}
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
