"use client";

import { useState, useMemo } from "react";

interface Kunde {
  id: string;
  vorname: string;
  nachname: string;
  telefon: string;
  anrede: {
    bezeichnung: string | null;
  } | null;
}

export default function KundenListe({ kunden }: { kunden: Kunde[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return kunden
      .filter((k) =>
        `${k.nachname} ${k.vorname}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => a.nachname.localeCompare(b.nachname));
  }, [kunden, search]);

  return (
    <div className="w-full">
      {/* Suchfeld */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Suche nach Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 p-2 border rounded shadow-sm"
        />
      </div>

      {/* Tabelle */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Anrede</th>
            <th className="p-2 border">Nachname</th>
            <th className="p-2 border">Vorname</th>
            <th className="p-2 border">Telefon</th>
            <th className="p-2 border w-40 text-center">Aktionen</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((k) => (
            <tr key={k.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {k.anrede?.bezeichnung ?? "—"}
              </td>
              <td className="p-2 border">{k.nachname}</td>
              <td className="p-2 border">{k.vorname}</td>
              <td className="p-2 border">{k.telefon}</td>

              <td className="p-2 border text-center space-x-2">
                <button
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                  onClick={() => console.log("Bearbeiten:", k.id)}
                >
                  Bearbeiten
                </button>

                <button
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                  onClick={() => console.log("Löschen:", k.id)}
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                Keine passenden Kunden gefunden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}