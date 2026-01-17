"use client";

import { useState } from "react";

interface Kunde {
  id: number;
  kundennummer: string;
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  fahrzeuge_count: number;
}

export default function KundenListe({ kunden }: { kunden: Kunde[] }) {
  const [search, setSearch] = useState("");

  const filtered = kunden.filter((k) => {
    const name = `${k.vorname} ${k.nachname}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="w-full">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Suche nach Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 p-2 border rounded shadow-sm"
        />
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Kunden-Nr.</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Telefon</th>
            <th className="p-2 border">E-Mail</th>
            <th className="p-2 border">Fahrzeuge</th>
            <th className="p-2 border w-20">Aktionen</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((k) => (
            <tr key={k.id} className="hover:bg-gray-50">
              <td className="p-2 border">{k.kundennummer}</td>
              <td className="p-2 border">
                {k.nachname}, {k.vorname}
              </td>
              <td className="p-2 border">{k.telefon}</td>
              <td className="p-2 border">{k.email}</td>
              <td className="p-2 border text-center">{k.fahrzeuge_count}</td>
              <td className="p-2 border text-center">
                <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                  Details
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Keine passenden Kunden gefunden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}