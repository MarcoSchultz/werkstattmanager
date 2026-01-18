"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItem = (label: string, path: string) => {
    const active = pathname.startsWith(path);

    return (
      <button
        onClick={() => router.push(path)}
        className={`w-full text-left px-4 py-2 rounded mb-1 ${
          active
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-black"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Werkstattmanager</h2>

      {/* Hauptnavigation */}
      {navItem("Dashboard", "/")}
      {navItem("Kunden", "/kunden")}
      {navItem("Neuer Kunde", "/kunden/neu")}
      {navItem("Fahrzeuge", "/fahrzeuge")}

      {/* Verwaltung */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Verwaltung
        </h3>

        {navItem("Einstellungen", "/einstellungen")}
      </div>
    </div>
  );
}