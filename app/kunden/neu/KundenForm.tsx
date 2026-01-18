"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KundenForm({ anreden, speichern }) {
  const router = useRouter();
  const [savedId, setSavedId] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        const id = await speichern(formData);
        setSavedId(id);
      }}
      className="space-y-4"
    >
      {/* Anrede */}
      <div>
        <label className="font-bold underline block mb-1">Anrede</label>
        <select
          name="anrede_id"
          className="w-full p-3 border rounded bg-white"
          required
        >
          <option value="">Bitte wählen…</option>
          {anreden.map((a) => (
            <option key={a.id} value={a.id}>
              {a.bezeichnung}
            </option>
          ))}
        </select>
      </div>

      {/* Vorname */}
      <div>
        <label className="font-bold underline block mb-1">Vorname</label>
        <input name="vorname" className="w-full p-3 border rounded" required />
      </div>

      {/* Nachname */}
      <div>
        <label className="font-bold underline block mb-1">Nachname</label>
        <input name="nachname" className="w-full p-3 border rounded" required />
      </div>

      {/* Straße */}
      <div>
        <label className="font-bold underline block mb-1">Straße</label>
        <input name="strasse" className="w-full p-3 border rounded" />
      </div>

      {/* PLZ */}
      <div>
        <label className="font-bold underline block mb-1">PLZ</label>
        <input name="plz" className="w-full p-3 border rounded" />
      </div>

      {/* Ort */}
      <div>
        <label className="font-bold underline block mb-1">Ort</label>
        <input name="ort" className="w-full p-3 border rounded" />
      </div>

      {/* Telefon */}
      <div>
        <label className="font-bold underline block mb-1">Telefon</label>
        <input name="telefon" className="w-full p-3 border rounded" />
      </div>

      {/* E-Mail */}
      <div>
        <label className="font-bold underline block mb-1">E-Mail</label>
        <input name="email" className="w-full p-3 border rounded" />
      </div>

      {/* Speichern */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Speichern
      </button>

      {savedId && (
        <div className="p-3 border rounded bg-gray-100 shadow-sm flex items-center gap-3 mt-4">
          <span className="font-semibold">Fahrzeug erfassen?</span>

          <button
            type="button"
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            onClick={() => router.push(`/fahrzeuge/neu?kunde=${savedId}`)}
          >
            Ja
          </button>

          <button
            type="button"
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
            onClick={() => router.push("/kunden")}
          >
            Nein
          </button>
        </div>
      )}
    </form>
  );
}
