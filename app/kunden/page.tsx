"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function KundenListe() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [kunden, setKunden] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 LÖSCHFUNKTION HIER
  async function kundeLoeschen(id: string) {
    const bestaetigt = confirm("Diesen Kunden wirklich löschen?");

    if (!bestaetigt) return;

    const { error } = await supabase
      .from("kunden")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    // Liste aktualisieren
    setKunden(kunden.filter((k) => k.id !== id));
  }

  useEffect(() => {
    async function loadKunden() {
      const { data, error } = await supabase
        .from("kunden")
        .select(`
          id,
          vorname,
          nachname,
          strasse,
          plz,
          ort,
          telefon,
          email,
          anrede:anrede_id ( bezeichnung )
        `)
        .order("nachname", { ascending: true });

      if (!error && data) {
        setKunden(data);
      }

      setLoading(false);
    }

    loadKunden();
  }, []);

  if (loading) {
    return <p>Lade Kunden…</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Kundenliste</h1>

      <table border={1} cellPadding={6} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Anrede</th>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Straße</th>
            <th>PLZ</th>
            <th>Ort</th>
            <th>Telefon</th>
            <th>E-Mail</th>
            <th>Aktion</th>
          </tr>
        </thead>

        <tbody>
          {kunden.map((k) => (
            <tr key={k.id}>
              <td>{k.anrede?.bezeichnung ?? ""}</td>
              <td>{k.vorname}</td>
              <td>{k.nachname}</td>
              <td>{k.strasse}</td>
              <td>{k.plz}</td>
              <td>{k.ort}</td>
              <td>{k.telefon}</td>
              <td>{k.email}</td>
              <td>
                <a href={`/kunden/${k.id}/bearbeiten`}>Bearbeiten</a>
                {" | "}
                <button
                  onClick={() => kundeLoeschen(k.id)}
                  style={{ marginLeft: 10 }}
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}