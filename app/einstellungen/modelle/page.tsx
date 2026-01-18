"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function ModelleVerwaltung() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [marken, setMarken] = useState<
    { id: string; bezeichnung: string | null }[]
  >([]);

  const [modelle, setModelle] = useState<
    { id: string; bezeichnung: string | null; marke_id: string }[]
  >([]);

  const [ausgewaehlteMarke, setAusgewaehlteMarke] = useState<string>("");

  const [neu, setNeu] = useState("");
  const [bearbeitenId, setBearbeitenId] = useState<string | null>(null);
  const [bearbeitenText, setBearbeitenText] = useState("");

  // ---------------------------------------------------------
  // 🔥 Marken laden
  // ---------------------------------------------------------
  const loadMarken = async () => {
    const { data } = await supabase
      .from("fahrzeugmarken")
      .select("id, bezeichnung")
      .order("bezeichnung");

    if (data) setMarken(data);
  };

  // ---------------------------------------------------------
  // 🔥 Modelle laden (nur für ausgewählte Marke)
  // ---------------------------------------------------------
  const loadModelle = async () => {
    if (!ausgewaehlteMarke) {
      setModelle([]);
      return;
    }

    const { data } = await supabase
      .from("fahrzeugmodelle")
      .select("id, bezeichnung, marke_id")
      .eq("marke_id", ausgewaehlteMarke)
      .order("bezeichnung");

    if (data) setModelle(data);
  };

  useEffect(() => {
    loadMarken();
  }, []);

  useEffect(() => {
    loadModelle();
  }, [ausgewaehlteMarke]);

  // ---------------------------------------------------------
  // 🔥 Neu anlegen
  // ---------------------------------------------------------
  const speichernNeu = async () => {
    if (!neu.trim() || !ausgewaehlteMarke) return;

    const { error } = await supabase.from("fahrzeugmodelle").insert([
      {
        bezeichnung: neu,
        marke_id: ausgewaehlteMarke,
      },
    ]);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    setNeu("");
    loadModelle();
  };

  // ---------------------------------------------------------
  // 🔥 Bearbeiten
  // ---------------------------------------------------------
  const speichernBearbeiten = async () => {
    if (!bearbeitenId) return;

    const { error } = await supabase
      .from("fahrzeugmodelle")
      .update({ bezeichnung: bearbeitenText })
      .eq("id", bearbeitenId);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    setBearbeitenId(null);
    setBearbeitenText("");
    loadModelle();
  };

  // ---------------------------------------------------------
  // 🔥 Löschen
  // ---------------------------------------------------------
  const loeschen = async (id: string) => {
    const sicher = confirm("Dieses Modell wirklich löschen?");
    if (!sicher) return;

    const { error } = await supabase
      .from("fahrzeugmodelle")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    loadModelle();
  };

  // ---------------------------------------------------------
  // 🔥 UI
  // ---------------------------------------------------------
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Fahrzeugmodelle verwalten
      </h1>

      {/* Marke auswählen */}
      <div className="mb-6">
        <label className="font-bold underline block mb-1">
          Fahrzeugmarke auswählen
        </label>
        <select
          value={ausgewaehlteMarke}
          onChange={(e) => setAusgewaehlteMarke(e.target.value)}
          className="p-3 border rounded w-full bg-white"
        >
          <option value="">Bitte Marke wählen…</option>
          {marken.map((m) => (
            <option key={m.id} value={m.id}>
              {m.bezeichnung}
            </option>
          ))}
        </select>
      </div>

      {/* Neu anlegen */}
      {ausgewaehlteMarke && (
        <div className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Neues Modell…"
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
      )}

      {/* Tabelle */}
      {ausgewaehlteMarke ? (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Modell</th>
              <th className="p-2 border w-40 text-center">Aktionen</th>
            </tr>
          </thead>

          <tbody>
            {modelle.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {bearbeitenId === m.id ? (
                    <input
                      value={bearbeitenText}
                      onChange={(e) => setBearbeitenText(e.target.value)}
                      className="p-2 border rounded w-full"
                    />
                  ) : (
                    m.bezeichnung
                  )}
                </td>

                <td className="p-2 border text-center space-x-2">
                  {bearbeitenId === m.id ? (
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
                          setBearbeitenId(m.id);
                          setBearbeitenText(m.bezeichnung ?? "");
                        }}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                      >
                        Bearbeiten
                      </button>

                      <button
                        onClick={() => loeschen(m.id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                      >
                        Löschen
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {modelle.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  Keine Modelle für diese Marke vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">Bitte zuerst eine Marke auswählen.</p>
      )}
    </div>
  );
}