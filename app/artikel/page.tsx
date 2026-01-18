"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function ArtikelVerwaltung() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [artikel, setArtikel] = useState([]);

  const [neu, setNeu] = useState({
    bezeichnung: "",
    vk_preis: "",
  });

  // Artikel laden
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("artikel")
        .select("id, bezeichnung, vk_preis")
        .order("bezeichnung");

      if (error) {
        console.error(error);
        return;
      }

      setArtikel(data || []);
    }

    load();
  }, []);

  // Artikel speichern
  const speichern = async () => {
    if (!neu.bezeichnung || !neu.vk_preis) {
      alert("Bitte Bezeichnung und Preis eingeben.");
      return;
    }

    const { error } = await supabase.from("artikel").insert([
      {
        bezeichnung: neu.bezeichnung,
        vk_preis: Number(neu.vk_preis),
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNeu({ bezeichnung: "", vk_preis: "" });

    // Liste neu laden
    const { data } = await supabase
      .from("artikel")
      .select("id, bezeichnung, vk_preis")
      .order("bezeichnung");

    setArtikel(data || []);
  };

  // Artikel löschen
  const loeschen = async (id) => {
    if (!confirm("Diesen Artikel wirklich löschen?")) return;

    const { error } = await supabase
      .from("artikel")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setArtikel(artikel.filter((a) => a.id !== id));
  };

  // Preis bearbeiten
  const preisAendern = async (id, neuerPreis) => {
    const { error } = await supabase
      .from("artikel")
      .update({ vk_preis: Number(neuerPreis) })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setArtikel(
      artikel.map((a) =>
        a.id === id ? { ...a, vk_preis: Number(neuerPreis) } : a
      )
    );
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">Artikelverwaltung</h1>

      {/* Neuer Artikel */}
      <div className="p-4 border rounded mb-6 bg-gray-50">
        <h2 className="font-bold mb-3">Neuen Artikel anlegen</h2>

        <div className="mb-3">
          <label className="block font-bold mb-1">Bezeichnung</label>
          <input
            type="text"
            value={neu.bezeichnung}
            onChange={(e) =>
              setNeu({ ...neu, bezeichnung: e.target.value })
            }
            className="p-2 border rounded w-full"
            placeholder="z. B. Ölfilter, Bremsbeläge"
          />
        </div>

        <div className="mb-3">
          <label className="block font-bold mb-1">Verkaufspreis (€)</label>
          <input
            type="number"
            value={neu.vk_preis}
            onChange={(e) =>
              setNeu({ ...neu, vk_preis: e.target.value })
            }
            className="p-2 border rounded w-full"
            placeholder="z. B. 19.99"
          />
        </div>

        <button
          onClick={speichern}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Artikel speichern
        </button>
      </div>

      {/* Artikelliste */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Bezeichnung</th>
            <th className="border p-2">Preis (€)</th>
            <th className="border p-2">Aktionen</th>
          </tr>
        </thead>

        <tbody>
          {artikel.map((a) => (
            <tr key={a.id}>
              <td className="border p-2">{a.bezeichnung}</td>

              <td className="border p-2">
                <input
                  type="number"
                  defaultValue={a.vk_preis}
                  onBlur={(e) => preisAendern(a.id, e.target.value)}
                  className="p-1 border rounded w-24"
                />
              </td>

              <td className="border p-2 text-center">
                <button
                  onClick={() => loeschen(a.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
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
