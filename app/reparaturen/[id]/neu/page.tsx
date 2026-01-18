"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

export default function NeueReparatur() {
  const { id: fahrzeugId } = useParams();
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [form, setForm] = useState({
    datum: "",
    titel: "",
    beschreibung: "",
    kilometerstand: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const speichern = async () => {
    if (!form.datum || !form.titel) {
      alert("Bitte Datum und Titel eingeben.");
      return;
    }

    const { data, error } = await supabase
      .from("reparaturen")
      .insert([
        {
          fahrzeug_id: fahrzeugId,
          datum: form.datum,
          titel: form.titel,
          beschreibung: form.beschreibung,
          kilometerstand: form.kilometerstand,
        },
      ])
      .select("id")
      .single();

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    // Weiterleitung zur Positionen-Seite
    router.push(`/reparaturen/${data.id}/positionen`);
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Neue Reparatur anlegen
      </h1>

      <div className="mb-4">
        <label className="block font-bold mb-1">Datum</label>
        <input
          type="date"
          name="datum"
          value={form.datum}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Titel</label>
        <input
          type="text"
          name="titel"
          value={form.titel}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          placeholder="z. B. Inspektion, Ölwechsel, Bremsen vorne"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Beschreibung</label>
        <textarea
          name="beschreibung"
          value={form.beschreibung}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          rows={4}
          placeholder="Details zur Reparatur…"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-1">Kilometerstand</label>
        <input
          type="number"
          name="kilometerstand"
          value={form.kilometerstand}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          placeholder="z. B. 152000"
        />
      </div>

      <button
        onClick={speichern}
        className="px-6 py-3 bg-green-600 text-white rounded"
      >
        Reparatur speichern
      </button>
    </div>
  );
}
