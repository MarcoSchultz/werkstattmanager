"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

export default function KundeBearbeiten() {
  const { id } = useParams();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [kunde, setKunde] = useState<any>(null);
  const [anreden, setAnreden] = useState<any[]>([]);
  const [info, setInfo] = useState("");

  useEffect(() => {
    async function loadData() {
      // Anreden laden
      const { data: anredeData } = await supabase
        .from("anrede")
        .select("id, bezeichnung")
        .order("bezeichnung");

      if (anredeData) setAnreden(anredeData);

      // Kundendaten laden
      const { data: kundeData } = await supabase
        .from("kunden")
        .select("*")
        .eq("id", id)
        .single();

      if (kundeData) setKunde(kundeData);
    }

    loadData();
  }, [id]);

  async function speichern() {
    const { error } = await supabase
      .from("kunden")
      .update({
        anrede_id: kunde.anrede_id,
        vorname: kunde.vorname,
        nachname: kunde.nachname,
        strasse: kunde.strasse,
        plz: kunde.plz,
        ort: kunde.ort,
        telefon: kunde.telefon,
        email: kunde.email,
      })
      .eq("id", id);

    if (error) {
      setInfo("Fehler: " + error.message);
    } else {
      setInfo("Änderungen gespeichert.");
    }
  }

  if (!kunde) return <p>Lade Daten…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Kunde bearbeiten</h1>

      <label>Anrede:</label>
      <select
        value={kunde.anrede_id || ""}
        onChange={(e) =>
          setKunde({ ...kunde, anrede_id: e.target.value })
        }
      >
        <option value="">Bitte wählen</option>
        {anreden.map((a) => (
          <option key={a.id} value={a.id}>
            {a.bezeichnung}
          </option>
        ))}
      </select>

      <br /><br />

      <label>Vorname:</label>
      <input
        value={kunde.vorname}
        onChange={(e) =>
          setKunde({ ...kunde, vorname: e.target.value })
        }
      />

      <br /><br />

      <label>Nachname:</label>
      <input
        value={kunde.nachname}
        onChange={(e) =>
          setKunde({ ...kunde, nachname: e.target.value })
        }
      />

      <br /><br />

      <label>Straße:</label>
      <input
        value={kunde.strasse}
        onChange={(e) =>
          setKunde({ ...kunde, strasse: e.target.value })
        }
      />

      <br /><br />

      <label>PLZ:</label>
      <input
        value={kunde.plz}
        onChange={(e) =>
          setKunde({ ...kunde, plz: e.target.value })
        }
      />

      <br /><br />

      <label>Ort:</label>
      <input
        value={kunde.ort}
        onChange={(e) =>
          setKunde({ ...kunde, ort: e.target.value })
        }
      />

      <br /><br />

      <label>Telefon:</label>
      <input
        value={kunde.telefon}
        onChange={(e) =>
          setKunde({ ...kunde, telefon: e.target.value })
        }
      />

      <br /><br />

      <label>E-Mail:</label>
      <input
        value={kunde.email}
        onChange={(e) =>
          setKunde({ ...kunde, email: e.target.value })
        }
      />

      <br /><br />

      <button onClick={speichern}>Speichern</button>

      <p>{info}</p>
    </div>
  );
}