"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ReparaturListe() {
  const { id: fahrzeugId } = useParams();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [reparaturen, setReparaturen] = useState([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("reparaturen")
        .select(`
          id,
          datum,
          titel,
          beschreibung,
          reparatur_gesamt ( gesamtsumme )
        `)
        .eq("fahrzeug_id", fahrzeugId)
        .order("datum", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setReparaturen(data || []);
    }

    load();
  }, [fahrzeugId]);

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Reparaturen zum Fahrzeug
      </h1>

      <div className="mb-6">
        <Link
          href={`/reparaturen/${fahrzeugId}/neu`}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Neue Reparatur anlegen
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Datum</th>
            <th className="border p-2">Titel</th>
            <th className="border p-2">Kosten</th>
            <th className="border p-2">Positionen</th>
          </tr>
        </thead>

        <tbody>
          {reparaturen.map((rep) => (
            <tr key={rep.id}>
              <td className="border p-2">{rep.datum}</td>
              <td className="border p-2">{rep.titel}</td>
              <td className="border p-2 font-bold">
                {(rep.reparatur_gesamt?.gesamtsumme || 0).toFixed(2)} €
              </td>
              <td className="border p-2 text-center">
                <Link
                  href={`/reparaturen/${rep.id}/positionen`}
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
