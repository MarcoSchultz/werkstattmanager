"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function NeuesFahrzeug() {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Stammdaten
  const [marken, setMarken] = useState([]);
  const [modelle, setModelle] = useState([]);
  const [kraftstoffe, setKraftstoffe] = useState([]);
  const [kunden, setKunden] = useState([]);

  // Formular
  const [form, setForm] = useState({
    kunde_id: "",
    marke_id: "",
    modell_id: "",
    kennzeichen: "",
    schl_nr_zu_2: "",
    schl_nr_zu_3: "",
    vin: "",
    erstzulassung: "",
    kw: "",
    kraftstoff_id: "",
    reifengroesse: "",
    naechste_hu: "",
    notizen: "",
  });

  // ---------------------------------------------------------
  // Stammdaten laden
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadData() {
      const { data: kunden } = await supabase
        .from("kunden")
        .select("id, nachname, vorname")
        .order("nachname");

      const { data: marken } = await supabase
        .from("fahrzeugmarken")
        .select("id, bezeichnung")
        .order("bezeichnung");

      const { data: kraftstoffe } = await supabase
        .from("kraftstoffarten")
        .select("id, bezeichnung")
        .order("bezeichnung");

      setKunden(kunden || []);
      setMarken(marken || []);
      setKraftstoffe(kraftstoffe || []);
    }

    loadData();
  }, []);

  // ---------------------------------------------------------
  // Modelle laden, wenn Marke geändert wird
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadModelle() {
      if (!form.marke_id) {
        setModelle([]);
        return;
      }

      const { data } = await supabase
        .from("fahrzeugmodelle")
        .select("id, bezeichnung")
        .eq("marke_id", form.marke_id)
        .order("bezeichnung");

      setModelle(data || []);
    }

    loadModelle();
  }, [form.marke_id]);

  // ---------------------------------------------------------
  // Formular ändern
  // ---------------------------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------------
  // Speichern
  // ---------------------------------------------------------
  const speichern = async () => {
    const { error } = await supabase.from("fahrzeuge").insert([form]);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    router.push("/fahrzeuge");
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Neues Fahrzeug anlegen
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Kunde */}
        <div>
          <label className="font-bold underline block mb-1">Kunde</label>
          <select
            name="kunde_id"
            value={form.kunde_id}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
          >
            <option value="">Bitte wählen…</option>
            {kunden.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nachname}, {k.vorname}
              </option>
            ))}
          </select>
        </div>

        {/* Marke */}
        <div>
          <label className="font-bold underline block mb-1">Marke</label>
          <select
            name="marke_id"
            value={form.marke_id}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
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
        <div>
          <label className="font-bold underline block mb-1">Modell</label>
          <select
            name="modell_id"
            value={form.modell_id}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
            disabled={!form.marke_id}
          >
            <option value="">Bitte zuerst Marke wählen…</option>
            {modelle.map((m) => (
              <option key={m.id} value={m.id}>
                {m.bezeichnung}
              </option>
            ))}
          </select>
        </div>

        {/* Kennzeichen */}
        <div>
          <label className="font-bold underline block mb-1">Kennzeichen</label>
          <input
            type="text"
            name="kennzeichen"
            value={form.kennzeichen}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Schlüsselnummern */}
        <div>
          <label className="font-bold underline block mb-1">Schl.-Nr. zu 2</label>
          <input
            type="text"
            name="schl_nr_zu_2"
            value={form.schl_nr_zu_2}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="font-bold underline block mb-1">Schl.-Nr. zu 3</label>
          <input
            type="text"
            name="schl_nr_zu_3"
            value={form.schl_nr_zu_3}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* VIN */}
        <div>
          <label className="font-bold underline block mb-1">VIN</label>
          <input
            type="text"
            name="vin"
            value={form.vin}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Erstzulassung – MIT KALENDER */}
        <div>
          <label className="font-bold underline block mb-1">
            Tag der Erstzulassung
          </label>
          <input
            type="date"
            name="erstzulassung"
            value={form.erstzulassung}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
          />
        </div>

        {/* KW */}
        <div>
          <label className="font-bold underline block mb-1">KW</label>
          <input
            type="number"
            name="kw"
            value={form.kw}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Kraftstoff */}
        <div>
          <label className="font-bold underline block mb-1">Kraftstoff</label>
          <select
            name="kraftstoff_id"
            value={form.kraftstoff_id}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
          >
            <option value="">Bitte wählen…</option>
            {kraftstoffe.map((k) => (
              <option key={k.id} value={k.id}>
                {k.bezeichnung}
              </option>
            ))}
          </select>
        </div>

        {/* Reifengröße */}
        <div>
          <label className="font-bold underline block mb-1">Reifengröße</label>
          <input
            type="text"
            name="reifengroesse"
            value={form.reifengroesse}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Nächste HU */}
        <div>
          <label className="font-bold underline block mb-1">Nächste HU</label>
          <input
            type="date"
            name="naechste_hu"
            value={form.naechste_hu}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
          />
        </div>

        {/* Notizen */}
        <div className="md:col-span-2">
          <label className="font-bold underline block mb-1">Notizen</label>
          <textarea
            name="notizen"
            value={form.notizen}
            onChange={handleChange}
            className="w-full p-3 border rounded h-24"
          />
        </div>
      </div>

      {/* Speichern */}
      <button
        onClick={speichern}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded"
      >
        Speichern
      </button>
    </div>
  );
}