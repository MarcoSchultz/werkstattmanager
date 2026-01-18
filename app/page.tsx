"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Dashboard() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Dashboard-Daten
  const [kundenCount, setKundenCount] = useState(0);
  const [fahrzeugeCount, setFahrzeugeCount] = useState(0);
  const [reparaturenCount, setReparaturenCount] = useState(0);

  const [letzteKunden, setLetzteKunden] = useState([]);
  const [letzteFahrzeuge, setLetzteFahrzeuge] = useState([]);

  // ---------------------------------------------------------
  // Dashboard-Daten laden
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadDashboard() {
      // Kunden zählen
      const { count: kCount } = await supabase
        .from("kunden")
        .select("*", { count: "exact", head: true });
      setKundenCount(kCount || 0);

      // Fahrzeuge zählen
      const { count: fCount } = await supabase
        .from("fahrzeuge")
        .select("*", { count: "exact", head: true });
      setFahrzeugeCount(fCount || 0);

      // Reparaturen zählen (falls Tabelle existiert)
      const { count: rCount, error: rErr } = await supabase
        .from("reparaturen")
        .select("*", { count: "exact", head: true });

      setReparaturenCount(rErr ? 0 : rCount || 0);

      // Letzte Kunden
      const { data: kData } = await supabase
        .from("kunden")
        .select("id, vorname, nachname, erstellt_am")
        .order("erstellt_am", { ascending: false })
        .limit(5);

      setLetzteKunden(kData || []);

      // Letzte Fahrzeuge
      const { data: fData } = await supabase
        .from("fahrzeuge")
        .select(
          `
          id,
          kennzeichen,
          erstellt_am,
          fahrzeugmarken ( bezeichnung ),
          fahrzeugmodelle ( bezeichnung )
        `
        )
        .order("erstellt_am", { ascending: false })
        .limit(5);

      setLetzteFahrzeuge(fData || []);
    }

    loadDashboard();
  }, []);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold underline mb-6">Dashboard</h1>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-bold">Kunden</h2>
          <p className="text-3xl mt-2">{kundenCount}</p>
        </div>

        <div className="p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-bold">Fahrzeuge</h2>
          <p className="text-3xl mt-2">{fahrzeugeCount}</p>
        </div>

        <div className="p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-bold">Reparaturen</h2>
          <p className="text-3xl mt-2">{reparaturenCount}</p>
        </div>
      </div>

      {/* Letzte Einträge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Letzte Kunden */}
        <div className="p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-bold mb-3">Letzte Kunden</h2>
          <ul className="space-y-2">
            {letzteKunden.map((k) => (
              <li key={k.id} className="border-b pb-2">
                {k.nachname}, {k.vorname}
                <div className="text-xs text-gray-500">
                  {new Date(k.erstellt_am).toLocaleDateString()}
                </div>
              </li>
            ))}
            {letzteKunden.length === 0 && (
              <p className="text-gray-500 text-sm">Keine Kunden vorhanden.</p>
            )}
          </ul>
        </div>

        {/* Letzte Fahrzeuge */}
        <div className="p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-bold mb-3">Letzte Fahrzeuge</h2>
          <ul className="space-y-2">
            {letzteFahrzeuge.map((f) => (
              <li key={f.id} className="border-b pb-2">
                <strong>{f.kennzeichen}</strong>
                <div className="text-sm">
                  {f.fahrzeugmarken?.bezeichnung}{" "}
                  {f.fahrzeugmodelle?.bezeichnung}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(f.erstellt_am).toLocaleDateString()}
                </div>
              </li>
            ))}
            {letzteFahrzeuge.length === 0 && (
              <p className="text-gray-500 text-sm">Keine Fahrzeuge vorhanden.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}