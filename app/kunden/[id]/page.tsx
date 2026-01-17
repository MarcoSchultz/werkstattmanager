"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

export default function KundenFormular() {
  const { id } = useParams();
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const istNeu = id === "neu";

  const [anreden, setAnreden] = useState<
    { id: string; bezeichnung: string | null }[]
  >([]);

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

  useEffect(() => {
    async function load() {
      const { data: anredeData } = await supabase
        .from("anrede")
        .select("id, bezeichnung")
        .order("bezeichnung");

      if (anredeData) setAnreden(anredeData);

      if (!istNeu) {
        const { data: kundeData } = await supabase
          .from("kunden")
          .select("*")
          .eq("id", id)
          .single();

        if (kundeData) {
          setForm({
            anrede_id: kundeData.anrede_id ?? "",
            vorname: kundeData.vorname ?? "",
            nachname: kundeData.nachname ?? "",
            strasse: kundeData.strasse ?? "",
            plz: kundeData.plz ?? "",
            ort: kundeData.ort ?? "",
            telefon: kundeData.telefon ?? "",
            email: kundeData.email ?? "",
          });
        }
      }
    }

    load();
  }, [id, istNeu]);

  const speichern = async () => {
    if (istNeu) {
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
    } else {
      const { error } = await supabase
        .from("kunden")
        .update(form)
        .eq("id", id);

      if (error) {
        alert("Fehler beim Speichern: " + error.message);
        return;
      }

      setSavedId(id as string);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold underline mb-6">
        {istNeu ? "Neuer Kunde" : "Kunde bearbeiten"}
      </h1>

      <div className="space-y-4">
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

        <div>
          <label className="font-bold underline block mb-1">Vorname</label>
          <input
            name="vorname"
            value={form.vorname}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="font-bold underline block mb-1">Nachname</label>
          <input
            name="nachname"
            value={form.nachname}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="font-bold underline block mb-1">Straße</label>
          <input
            name="strasse"
            value={form.strasse}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="font-bold underline block mb-1">PLZ</label>
          <input
            name="plz"
            value={form.plz}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="font-bold underline block mb-1">Ort</label>
          <input
            name="ort"
            value={form.ort}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="font-bold underline block mb-1">Telefon</label>
          <input
            name="telefon"
            value={form.telefon}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="font-bold underline block mb-1">E-Mail</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={speichern}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Speichern
          </button>

          {savedId && (
            <div className="p-3 border rounded bg-gray-100 shadow-sm flex items-center gap-3">
              <span className="font-semibold">
                {istNeu
                  ? "Fahrzeug erfassen?"
                  : "Zur Kundenliste zurückkehren?"}
              </span>

              {istNeu && (
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  onClick={() =>
                    router.push(`/fahrzeuge/neu?kunde=${savedId}`)
                  }
                >
                  Ja
                </button>
              )}

              <button
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                onClick={() => router.push("/kunden")}
              >
                Zurück
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
