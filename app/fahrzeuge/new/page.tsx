"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function FahrzeugForm() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [marken, setMarken] = useState([]);
  const [modelle, setModelle] = useState([]);

  const [selectedMarke, setSelectedMarke] = useState("");
  const [selectedModell, setSelectedModell] = useState("");

  // Marken laden
  useEffect(() => {
    async function loadMarken() {
      const { data } = await supabase
        .from("fahrzeugmarken")
        .select("*")
        .order("bezeichnung", { ascending: true });

      setMarken(data || []);
    }

    loadMarken();
  }, []);

  // Modelle laden, wenn Marke gewählt wurde
  useEffect(() => {
    if (!selectedMarke) {
      setModelle([]);
      return;
    }

    async function loadModelle() {
      const { data } = await supabase
        .from("fahrzeugmodelle")
        .select("*")
        .eq("marke_id", selectedMarke)
        .order("bezeichnung", { ascending: true });

      setModelle(data || []);
    }

    loadModelle();
  }, [selectedMarke]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Fahrzeug anlegen</h1>

      {/* Marke */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Marke</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedMarke}
          onChange={(e) => {
            setSelectedMarke(e.target.value);
            setSelectedModell(""); // Modell zurücksetzen
          }}
        >
          <option value="">Bitte wählen…</option>
          {marken.map((m) => (
            <option key={m.id} value={m.id}>
              {m.bezeichnung}
            </option>
          ))}
        </select>
      </div>

      {/* Modell */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Modell</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedModell}
          onChange={(e) => setSelectedModell(e.target.value)}
          disabled={!selectedMarke}
        >
          <option value="">Bitte wählen…</option>
          {modelle.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.bezeichnung}
            </option>
          ))}
        </select>
      </div>

      {/* Beispiel: Speichern */}
      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        Speichern
      </button>
    </div>
  );
}
