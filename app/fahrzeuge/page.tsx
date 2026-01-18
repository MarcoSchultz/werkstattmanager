"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function FahrzeugListe() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [fahrzeuge, setFahrzeuge] = useState([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("fahrzeuge")
        .select(`
          id,
          kennzeichen,
          erstzulassung,
          kunden:kunde_id (vorname, nachname),
          marke:marke_id (bezeichnung),
          modell:modell_id (bezeichnung)
        `)
        .order("kennzeichen");

      if (error) {
        console.error(error);
        return;
      }

      setFahrzeuge(data || []);
    }

    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold underline">Fahrzeuge</h1>

        <Link
          href="/fahrzeuge/neu"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Neues Fahrzeug
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Kennzeichen</th>
            <th className="border p-2">Kunde</th>
            <th className="border p-2">Marke</th>
            <th className="border p-2">Modell</th>
            <th className="border p-2">Erstzulassung</th>
            <th className="border p-2">Details</th>
          </tr>
        </thead>

        <tbody>
          {fahrzeuge.map((fzg) => (
            <tr key={fzg.id}>
              <td className="border p-2">{fzg.kennzeichen}</td>
              <td className="border p-2">
                {fzg.kunden?.vorname} {fzg.kunden?.nachname}
              </td>
              <td className="border p-2">{fzg.marke?.bezeichnung}</td>
              <td className="border p-2">{fzg.modell?.bezeichnung}</td>
              <td className="border p-2">{fzg.erstzulassung}</td>
              <td className="border p-2 text-center">
                <Link
                  href={`/fahrzeuge/${fzg.id}`}
                  className="text-blue-600 underline"
                >
                  Öffnen
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}