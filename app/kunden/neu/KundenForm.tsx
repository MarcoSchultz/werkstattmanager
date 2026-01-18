"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function KundenForm({ anreden }) {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

  const [savedId, setSavedId] = useState<string | null>(null);

  const handleChange = (e) => {
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

    setForm({
      anrede_id: "",
      vorname: "",
      nachname: "",
      strasse: "",
      plz: "",
      ort: "",
      telefon: "",
      email: "",
    });

    setSavedId(data.id);
  };

  return (
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

      {/* Rest des Formulars bleibt unverändert */}
      ...
    </div>
  );
}
