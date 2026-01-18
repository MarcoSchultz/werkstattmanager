"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AnredenVerwaltung() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [anreden, setAnreden] = useState<
    { id: string; bezeichnung: string | null }[]
  >([]);

  const [neu, setNeu] = useState("");
  const [bearbeitenId, setBearbeitenId] = useState<string | null>(null);
  const [bearbeitenText, setBearbeitenText] = useState("");

  // ---------------------------------------------------------
  // 🔥 Laden
  // ---------------------------------------------------------
  const load = async () => {
    const { data } = await supabase
      .from("anrede")
      .select("id, bezeichnung")
      .order("bezeichnung");

    if (data) setAnreden(data);
  };

  useEffect(() => {
    load();
  }, []);

  // ---------------------------------------------------------
  // 🔥 Neu anlegen
  // ---------------------------------------------------------
  const speichernNeu = async () => {
    if (!neu.trim()) return;

    const { error } = await supabase
      .from("anrede")
      .insert([{ bezeichnung: neu }]);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    setNeu("");
    load();
  };

  // ---------------------------------------------------------
  // 🔥 Bearbeiten
  // ---------------------------------------------------------
  const speichernBearbeiten = async () => {
    if (!bearbeitenId) return;

    const { error } = await supabase
      .from("anrede")
      .update({ bezeichnung: bearbeitenText })
      .eq("id", bearbeitenId);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    setBearbeitenId(null);
    setBearbeitenText("");
    load();
  };

  // ---------------------------------------------------------
  // 🔥 Löschen
  // ---------------------------------------------------------
  const loeschen = async (id: string) => {
    const sicher = confirm("Diese Anrede wirklich löschen?");
    if (!sicher) return;

    const { error } = await supabase.from("anrede").delete().eq("id", id);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    load();
  };

  // ---------------------------------------------------------
  // 🔥 UI
  // ---------------------------------------------------------
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold underline mb-6">Anreden verwalten</h1>

      {/* Neu anlegen */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Neue Anrede…"
          value={neu}
          onChange={(e) => setNeu(e.target.value)}
          className="p-3 border rounded w-full"
        />
        <button
          onClick={speichernNeu}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Hinzufügen
        </button>
      </div>

      {/* Tabelle */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Bezeichnung</th>
            <th className="p-2 border w-40 text-center">Aktionen</th>
          </tr>
        </thead>

        <tbody>
          {anreden.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {bearbeitenId === a.id ? (
                  <input
                    value={bearbeitenText}
                    onChange={(e) => setBearbeitenText(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                ) : (
                  a.bezeichnung
                )}
              </td>

              <td className="p-2 border text-center space-x-2">
                {bearbeitenId === a.id ? (
                  <>
                    <button
                      onClick={speichernBearbeiten}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => {
                        setBearbeitenId(null);
                        setBearbeitenText("");
                      }}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded"
                    >
                      Abbrechen
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setBearbeitenId(a.id);
                        setBearbeitenText(a.bezeichnung ?? "");
                      }}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                    >
                      Bearbeiten
                    </button>

                    <button
                      onClick={() => loeschen(a.id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Löschen
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {anreden.length === 0 && (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                Keine Anreden vorhanden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}