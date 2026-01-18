"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function Sidebar() {
  const pathname = usePathname();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Navigation mit Unterpunkt für Kunden
  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },

    // Kunden + Unterpunkt
    { href: "/kunden", label: "Kunden", icon: "👤" },
    { href: "/kunden/new", label: "➕ Neuer Kunde", icon: "➕", sub: true },

    { href: "/fahrzeuge", label: "Fahrzeuge", icon: "🚗" },
    { href: "/artikel", label: "Artikel", icon: "📦" },
    { href: "/einstellungen", label: "Einstellungen", icon: "⚙️" },
  ];

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen border-r bg-gray-50 p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">Werkstattmanager</h1>

      <nav className="flex flex-col gap-2">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                active
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-gray-200"
              } ${item.sub ? "ml-8 text-sm" : ""}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>

      <div className="mt-auto text-xs text-gray-500">
        © {new Date().getFullYear()} Werkstattmanager
      </div>
    </div>
  );
}
