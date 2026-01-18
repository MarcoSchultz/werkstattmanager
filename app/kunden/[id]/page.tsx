"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function KundenDetail() {
  const { id } = useParams();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [kunde, setKunde] = useState(null);
  const [fahrzeuge, setFahrzeuge] = useState([]);

  const [form, setForm] = useState({
    vorname: "",
    nachname: "",
    telefon: "",
    email: "",
  });

  // Kundendaten laden
  useEffect(() => {
    async function loadKunde() {
      const { data, error } = await supabase
        .from("kunden")
        .select("id, vorname, nachname, telefon, email")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setKunde(data);
      setForm(data);
    }

    loadKunde();
  }, [id]);

  // Fahrzeuge des Kunden laden
  useEffect(() => {
    async function loadFahrzeuge() {
      const { data } = await supabase
        .from("fahrzeuge")
        .select("id, kennzeichen, marke:marke_id(bezeichnung), modell:modell_id(bezeichnung)")
        .eq("kunde_id", id)
        .order("kennzeichen");

      setFahrzeuge(data || []);
    }

    loadFahrzeuge();
  }, [id]);

  // Änderungen speichern
  const speichern = async () => {
    const { error } = await supabase
      .from("kunden")
      .update({
        vorname: form.vorname,
        nachname: form.nachname,
        telefon: form.telefon,
        email: form.email,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Kundendaten gespeichert.");
  };

  if (!kunde) {
    return <div className="p-6">Lade Kundendaten…</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Kunde: {kunde.vorname} {kunde.nachname}
      </h1>

      {/* Kundendaten */}
      <div className="p-4 border rounded mb-6 bg-gray-50">
        <h2 className="font-bold mb-3">Kundendaten bearbeiten</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Vorname</label>
            <input
              type="text"
              value={form.vorname}
              onChange={(e) => setForm({ ...form, vorname: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Nachname</label>
            <input
              type="text"
              value={form.nachname}
              onChange={(e) => setForm({ ...form, nachname: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Telefon</label>
            <input
              type="text"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">E-Mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        <button
          onClick={speichern}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Speichern
        </button>
      </div>

      {/* Fahrzeuge */}
      <h2 className="text-xl font-bold mb-3">Fahrzeuge des Kunden</h2>

      {fahrzeuge.length === 0 && (
        <p className="text-gray-600">Keine Fahrzeuge vorhanden.</p>
      )}

      <ul className="list-disc ml-6">
        {fahrzeuge.map((f) => (
          <li key={f.id} className="mb-2">
            <Link
              href={`/fahrzeuge/${f.id}`}
              className="text-blue-600 underline"
            >
              {f.kennzeichen} – {f.marke?.bezeichnung} {f.modell?.bezeichnung}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
