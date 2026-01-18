"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function FahrzeugDetail() {
  const { id } = useParams();
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [fahrzeug, setFahrzeug] = useState(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("fahrzeuge")
        .select(`
          id,
          kennzeichen,
          erstzulassung,
          schl_nr_zu_2,
          schl_nr_zu_3,
          vin,
          kw,
          reifengroesse,
          naechste_hu,
          notizen,
          kunden:kunde_id (vorname, nachname),
          marke:marke_id (bezeichnung),
          modell:modell_id (bezeichnung)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setFahrzeug(data);
    }

    load();
  }, [id]);

  if (!fahrzeug) {
    return <div className="p-6">Lade Fahrzeugdaten…</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">
        Fahrzeugdetails – {fahrzeug.kennzeichen}
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Kunde:</strong> {fahrzeug.kunden?.vorname} {fahrzeug.kunden?.nachname}</p>
          <p><strong>Marke:</strong> {fahrzeug.marke?.bezeichnung}</p>
          <p><strong>Modell:</strong> {fahrzeug.modell?.bezeichnung}</p>
          <p><strong>Erstzulassung:</strong> {fahrzeug.erstzulassung}</p>
        </div>

        <div>
          <p><strong>Schlüsselnummer 2.1:</strong> {fahrzeug.schl_nr_zu_2}</p>
          <p><strong>Schlüsselnummer 2.2:</strong> {fahrzeug.schl_nr_zu_3}</p>
          <p><strong>VIN:</strong> {fahrzeug.vin}</p>
          <p><strong>kW:</strong> {fahrzeug.kw}</p>
        </div>
      </div>

      <div className="mb-6">
        <p><strong>Reifengröße:</strong> {fahrzeug.reifengroesse}</p>
        <p><strong>Nächste HU:</strong> {fahrzeug.naechste_hu}</p>
      </div>

      <div className="mb-6">
        <p><strong>Notizen:</strong></p>
        <div className="p-3 border rounded bg-gray-50 whitespace-pre-line">
          {fahrzeug.notizen || "Keine Notizen vorhanden."}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          href={`/reparaturen/${fahrzeug.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Reparaturen anzeigen
        </Link>

        <Link
          href={`/reparaturen/${fahrzeug.id}/neu`}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Neue Reparatur
        </Link>
      </div>
    </div>
  );
}
