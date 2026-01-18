"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function Dashboard() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [stats, setStats] = useState({
    kunden: 0,
    fahrzeuge: 0,
    reparaturen: 0,
  });

  const [huListe, setHuListe] = useState([]);

  useEffect(() => {
    async function load() {
      // Kunden zählen
      const { count: kundenCount } = await supabase
        .from("kunden")
        .select("*", { count: "exact", head: true });

      // Fahrzeuge zählen
      const { count: fahrzeugeCount } = await supabase
        .from("fahrzeuge")
        .select("*", { count: "exact", head: true });

      // Reparaturen zählen
      const { count: repCount } = await supabase
        .from("reparaturen")
        .select("*", { count: "exact", head: true });

      // HU-Termine laden
      const { data: hu } = await supabase
        .from("fahrzeuge")
        .select(`
          id,
          kennzeichen,
          naechste_hu,
          kunden:kunde_id (vorname, nachname)
        `)
        .not("naechste_hu", "is", null)
        .order("naechste_hu", { ascending: true })
        .limit(5);

      setStats({
        kunden: kundenCount || 0,
        fahrzeuge: fahrzeugeCount || 0,
        reparaturen: repCount || 0,
      });

      setHuListe(hu || []);
    }

    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold underline mb-6">Dashboard</h1>

      {/* Statistiken */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-4 border rounded bg-gray-50 text-center">
          <h2 className="text-xl font-bold">{stats.kunden}</h2>
          <p className="text-gray-600">Kunden</p>
        </div>

        <div className="p-4 border rounded bg-gray-50 text-center">
          <h2 className="text-xl font-bold">{stats.fahrzeuge}</h2>
          <p className="text-gray-600">Fahrzeuge</p>
        </div>

        <div className="p-4 border rounded bg-gray-50 text-center">
          <h2 className="text-xl font-bold">{stats.reparaturen}</h2>
          <p className="text-gray-600">Reparaturen</p>
        </div>
      </div>

      {/* HU-Termine */}
      <h2 className="text-xl font-bold mb-3">Nächste HU‑Termine</h2>

      {huListe.length === 0 && (
        <p className="text-gray-600">Keine HU‑Termine vorhanden.</p>
      )}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Datum</th>
            <th className="border p-2">Kennzeichen</th>
            <th className="border p-2">Kunde</th>
            <th className="border p-2">Fahrzeug</th>
          </tr>
        </thead>

        <tbody>
          {huListe.map((f) => (
            <tr key={f.id}>
              <td className="border p-2">{f.naechste_hu}</td>
              <td className="border p-2">{f.kennzeichen}</td>
              <td className="border p-2">
                {f.kunden?.vorname} {f.kunden?.nachname}
              </td>
              <td className="border p-2">
                <Link
                  href={`/fahrzeuge/${f.id}`}
                  className="text-blue-600 underline"
                >
                  Öffnen
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
