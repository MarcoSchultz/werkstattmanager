"use client";

import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkStyle = (path: string) => ({
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    background: pathname === path ? "#374151" : "transparent",
    display: "block",
  });

  return (
    <aside
      style={{
        width: "240px",
        background: "#1f2937",
        color: "white",
        padding: "24px",
        borderRight: "1px solid #111827",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
        Werkstattmanager
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <a href="/kunden" style={linkStyle("/kunden")}>
          Kundenliste
        </a>

        <a href="/kunden/neu" style={linkStyle("/kunden/neu")}>
          Neuer Kunde
        </a>

        <hr style={{ borderColor: "#4b5563" }} />

        <span style={{ opacity: 0.6 }}>Aufträge (bald)</span>
        <span style={{ opacity: 0.6 }}>Fahrzeuge (bald)</span>
        <span style={{ opacity: 0.6 }}>Einstellungen</span>
      </nav>
    </aside>
  );
}