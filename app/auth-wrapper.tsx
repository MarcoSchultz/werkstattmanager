"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./sidebar";

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Login-Seite soll keine Sidebar haben
  if (pathname === "/login") {
    return <main className="w-full">{children}</main>;
  }

  // Während Auth lädt
  if (loading) {
    return <div className="p-10">Lade…</div>;
  }

  // Wenn nicht eingeloggt → weiterleiten
  if (!session) {
    router.push("/login");
    return null;
  }

  // Eingeloggt → Sidebar + Inhalt
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </>
  );
}
