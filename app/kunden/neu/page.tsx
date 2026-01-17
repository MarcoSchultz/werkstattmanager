"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function NeuerKunde() {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [anreden, setAnreden] = useState<
    { id: string; bezeichnung: string | null }[]
  >([]);

  const [form, setForm] = useState({
    anrede_id: "",
    vorname: "",
    nachname: "",
    strasse: "",
    plz: "",
    ort: "",
    telefon: "",
    email: "",
  });

  // Anreden automatisch laden
  useEffect(() => {
    const loadAnreden = async () => {
      const { data, error } = await supabase
        .from("anrede")
        .select("id, bezeichnung")
        .order("bezeichnung", { ascending: true });

      if (!error && data) {
        setAnreden(data);
      }
    };

    loadAnreden();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const speichern = async () => {
    const { data, error } = await supabase
      .from("kunden")
      .insert([form])
      .select("id")
      .single();

    if (error) {
      alert("Fehler beim Speichern: " + error.message);
      return;
    }

    const kundeId = data.id;

    // Dialog anzeigen
    const antwort = confirm(
      "Kunde erfolgreich angelegt.\n\nMöchten Sie jetzt ein Fahrzeug erfassen?"
    );

    if (antwort) {
      router.push(`/fahrzeuge/neu?kunde=${kundeId}`);
    } else {
      router.push("/kunden");
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Neuen Kunden anlegen
      </h1>

      <div className="space-y-4">

        {/* Anrede */}
        <div>
          <label className="font-bold underline block mb-1">Anrede</label>
          <select
            name="anrede_id"
            value={form.anrede_id}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
          >
            <option value="">Bitte wählen…</option>

            {anreden.map((a) => (
              <option key={a.id} value={a.id}>
                {a.bezeichnung}
              </option>
            ))}
          </select>
        </div>

        {/* Vorname */}
        <div>
          <label className="font-bold underline block mb-1">Vorname</label>
          <input
            name="vorname"
            value={form.vorname}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Nachname */}
        <div>
          <label className="font-bold underline block mb-1">Nachname</label>
          <input
            name="nachname"
            value={form.nachname}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Straße */}
        <div>
          <label className="font-bold underline block mb-1">Straße</label>
          <input
            name="strasse"
            value={form.strasse}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* PLZ */}
        <div>
          <label className="font-bold underline block mb-1">PLZ</label>
          <input
            name="plz"
            value={form.plz}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Ort */}
        <div>
          <label className="font-bold underline block mb-1">Ort</label>
          <input
            name="ort"
            value={form.ort}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Telefon */}
        <div>
          <label className="font-bold underline block mb-1">Telefon</label>
          <input
            name="telefon"
            value={form.telefon}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* E-Mail */}
        <div>
          <label className="font-bold underline block mb-1">E-Mail</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Speichern */}
        <button
          onClick={speichern}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}