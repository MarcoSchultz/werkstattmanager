"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

export default function ReparaturPositionen() {
  const { id: reparaturId } = useParams();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [artikel, setArtikel] = useState([]);
  const [positionen, setPositionen] = useState([]);

  const [neu, setNeu] = useState({
    artikel_id: "",
    menge: 1,
    einzelpreis: 0,
    bemerkung: "",
  });

  // Artikel laden
  useEffect(() => {
    async function loadArtikel() {
      const { data } = await supabase
        .from("artikel")
        .select("id, bezeichnung, vk_preis")
        .order("bezeichnung");

      setArtikel(data || []);
    }

    loadArtikel();
  }, []);

  // Positionen laden
  useEffect(() => {
    async function loadPositionen() {
      const { data } = await supabase
        .from("reparatur_positionen")
        .select(`
          id,
          menge,
          einzelpreis,
          bemerkung,
          zwischensumme,
          artikel ( bezeichnung )
        `)
        .eq("reparatur_id", reparaturId)
        .order("id");

      setPositionen(data || []);
    }

    loadPositionen();
  }, [reparaturId]);

  // Artikelwechsel → Preis automatisch setzen
  const handleArtikelChange = (e) => {
    const artikelId = e.target.value;
    const art = artikel.find((a) => a.id === artikelId);

    setNeu({
      ...neu,
      artikel_id: artikelId,
      einzelpreis: art ? art.vk_preis : 0,
    });
  };

  // Position speichern
  const speichern = async () => {
    if (!neu.artikel_id) {
      alert("Bitte einen Artikel auswählen.");
      return;
    }

    const { error } = await supabase.from("reparatur_positionen").insert([
      {
        reparatur_id: reparaturId,
        artikel_id: neu.artikel_id,
        menge: neu.menge,
        einzelpreis: neu.einzelpreis,
        bemerkung: neu.bemerkung,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    // Formular zurücksetzen
    setNeu({
      artikel_id: "",
      menge: 1,
      einzelpreis: 0,
      bemerkung: "",
    });

    // Positionen neu laden
    const { data } = await supabase
      .from("reparatur_positionen")
      .select(`
        id,
        menge,
        einzelpreis,
        bemerkung,
        zwischensumme,
        artikel ( bezeichnung )
      `)
      .eq("reparatur_id", reparaturId)
      .order("id");

    setPositionen(data || []);
  };

  // Gesamtsumme berechnen
  const gesamtsumme = positionen.reduce(
    (sum, p) => sum + Number(p.zwischensumme || 0),
    0
  );

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Reparatur – Positionen
      </h1>

      {/* Neue Position */}
      <div className="p-4 border rounded mb-6 bg-gray-50">
        <h2 className="font-bold mb-3">Neue Position</h2>

        <div className="mb-3">
          <label className="block font-bold mb-1">Artikel</label>
          <select
            value={neu.artikel_id}
            onChange={handleArtikelChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Bitte wählen…</option>
            {artikel.map((a) => (
              <option key={a.id} value={a.id}>
                {a.bezeichnung}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block font-bold mb-1">Menge</label>
          <input
            type="number"
            value={neu.menge}
            onChange={(e) =>
              setNeu({ ...neu, menge: Number(e.target.value) })
            }
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block font-bold mb-1">Einzelpreis (€)</label>
          <input
            type="number"
            value={neu.einzelpreis}
            onChange={(e) =>
              setNeu({ ...neu, einzelpreis: Number(e.target.value) })
            }
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block font-bold mb-1">Bemerkung</label>
          <input
            type="text"
            value={neu.bemerkung}
            onChange={(e) =>
              setNeu({ ...neu, bemerkung: e.target.value })
            }
            className="p-2 border rounded w-full"
          />
        </div>

        <button
          onClick={speichern}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Position speichern
        </button>
      </div>

      {/* Positionenliste */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Artikel</th>
            <th className="border p-2">Menge</th>
            <th className="border p-2">Einzelpreis</th>
            <th className="border p-2">Zwischensumme</th>
            <th className="border p-2">Bemerkung</th>
          </tr>
        </thead>

        <tbody>
          {positionen.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.artikel?.bezeichnung}</td>
              <td className="border p-2">{p.menge}</td>
              <td className="border p-2">{p.einzelpreis} €</td>
              <td className="border p-2 font-bold">
                {Number(p.zwischensumme).toFixed(2)} €
              </td>
              <td className="border p-2">{p.bemerkung}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-4 text-xl font-bold">
        Gesamtsumme: {gesamtsumme.toFixed(2)} €
      </div>
    </div>
  );
}
