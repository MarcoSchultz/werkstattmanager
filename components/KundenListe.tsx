"use client";

import Link from "next/link";
import { useState } from "react";

export default function KundenListe({ kunden }) {
  const [search, setSearch] = useState("");

  const filtered = kunden.filter((k) => {
    const full = `${k.vorname} ${k.nachname}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <div>
      {/* Kopfbereich: Suchfeld + Neuer Kunde Button */}
      <div className="flex items-center gap-4 mb-4">
        
        {/* Suchfeld mit Clear-Button */}
        <div className="relative" style={{ width: "250px" }}>
          <input
            type="text"
            placeholder="Suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full pr-8"
          />

          {/* Clear-Button (X) */}
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
          )}
        </div>

        {/* Neuer Kunde Button direkt rechts daneben */}
        <Link
          href="/kunden/neu"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 whitespace-nowrap"
        >
          ➕ Neuer Kunde
        </Link>
      </div>

      {/* Tabelle */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Anrede</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Telefon</th>
            <th className="border p-2">Aktion</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((k) => (
            <tr key={k.id}>
              <td className="border p-2">{k.anrede?.bezeichnung}</td>

              <td className="border p-2">
                {k.vorname} {k.nachname}
              </td>

              <td className="border p-2">{k.telefon}</td>

              <td className="border p-2">
                <div className="flex gap-3">
                  <Link
                    href={`/kunden/${k.id}`}
                    className="text-blue-600 underline"
                  >
                    Öffnen
                  </Link>

                  <Link
                    href={`/kunden/${k.id}/edit`}
                    className="text-green-600 underline"
                  >
                    Bearbeiten
                  </Link>

                  <button
                    type="button"
                    className="text-red-600 underline"
                    onClick={() => {
                      if (
                        confirm(
                          `Kunde ${k.vorname} ${k.nachname} wirklich löschen?`
                        )
                      ) {
                        // TODO: echte Löschlogik einbauen
                      }
                    }}
                  >
                    Löschen
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Keine Kunden gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
