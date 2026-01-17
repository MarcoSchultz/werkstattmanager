"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function KundenForm() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [anreden, setAnreden] = useState<any[]>([]);
  const [anredeId, setAnredeId] = useState("");

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");

  const [strasse, setStrasse] = useState("");
  const [plz, setPlz] = useState("");
  const [ort, setOrt] = useState("");

  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");

  const [info, setInfo] = useState("");

  // Anreden laden
  useEffect(() => {
    async function loadAnreden() {
      const { data } = await supabase
        .from("anrede")
        .select("id, bezeichnung")
        .order("bezeichnung");

      if (data) setAnreden(data);
    }
    loadAnreden();
  }, []);

  async function speichern() {
    const { error } = await supabase.from("kunden").insert({
      anrede_id: anredeId || null,
      vorname,
      nachname,
      strasse,
      plz,
      ort,
      telefon,
      email,
    });

    if (error) {
      setInfo("Fehler: " + error.message);
      return;
    }

    setInfo("Kunde erfolgreich gespeichert.");

    // Felder zurücksetzen
    setAnredeId("");
    setVorname("");
    setNachname("");
    setStrasse("");
    setPlz("");
    setOrt("");
    setTelefon("");
    setEmail("");
  }

  return (
    <div style={{ marginTop: 20 }}>

      {/* PERSONENDATEN */}
      <h3>Personendaten</h3>

      <label>Anrede:</label>
      <select value={anredeId} onChange={(e) => setAnredeId(e.target.value)}>
        <option value="">Bitte wählen</option>
        {anreden.map((a) => (
          <option key={a.id} value={a.id}>
            {a.bezeichnung}
          </option>
        ))}
      </select>

      <br /><br />

      <label>Vorname:</label>
      <input value={vorname} onChange={(e) => setVorname(e.target.value)} />

      <br /><br />

      <label>Nachname:</label>
      <input value={nachname} onChange={(e) => setNachname(e.target.value)} />

      <br /><br /><hr /><br />

      {/* ADRESSE */}
      <h3>Adresse</h3>

      <label>Straße:</label>
      <input value={strasse} onChange={(e) => setStrasse(e.target.value)} />

      <br /><br />

      <label>PLZ:</label>
      <input value={plz} onChange={(e) => setPlz(e.target.value)} />

      <br /><br />

      <label>Ort:</label>
      <input value={ort} onChange={(e) => setOrt(e.target.value)} />

      <br /><br /><hr /><br />

      {/* KONTAKT */}
      <h3>Kontakt</h3>

      <label>Telefon:</label>
      <input value={telefon} onChange={(e) => setTelefon(e.target.value)} />

      <br /><br />

      <label>E-Mail:</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <br /><br />

      <button onClick={speichern}>Speichern</button>

      <p>{info}</p>
    </div>
  );
}