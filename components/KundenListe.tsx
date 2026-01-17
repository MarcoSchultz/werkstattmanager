"use client";

import { useState, useMemo, useRef, useEffect } from "react";

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
  const searchRef = useRef<HTMLInputElement>(null);

  // Beim ersten Laden automatisch fokussieren
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    return kunden
      .filter((k) =>
        `${k.nachname} ${k.vorname}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => a.nachname.localeCompare(b.nachname));
  }, [kunden, search]);

  const clearSearch = () => {
    setSearch("");
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  return (
    <div className="w-full">
      {/* Suchfeld mit Clear-Button */}
      <div className="mb-3 relative w-64">
        <input
          ref={searchRef}
          type="text"
          placeholder="Suche nach Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pr-8 border rounded shadow-sm"
          autoFocus
        />

        {search.length > 0 && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabelle */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Anrede</th>
            <th className="p-2 border">Nachname</th>
            <th className="p-2 border">Vorname</th>
            <th className="p-2 border">Telefon</th>
            <th className="p-2 border w-24 text-center">Details</th>
            <th className="p-2 border w-40 text-center">Aktionen</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((k) => (
            <tr key={k.id} className="hover:bg-gray-50">
              <td className="p-2 border">{k.anrede?.bezeichnung ?? "—"}</td>
              <td className="p-2 border">{k.nachname}</td>
              <td className="p-2 border">{k.vorname}</td>
              <td className="p-2 border">{k.telefon}</td>

              {/* Details */}
              <td className="p-2 border text-center">
                <button
                  className="px-2 py-1 text-xs bg-gray-700 text-white rounded"
                  onClick={() => console.log("Details:", k.id)}
                >
                  Details
                </button>
              </td>

              {/* Aktionen */}
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
              <td
                colSpan={6}
                className="p-4 text-center text-gray-500"
              >
                Keine passenden Kunden gefunden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}