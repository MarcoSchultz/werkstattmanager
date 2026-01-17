"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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
  const [list, setList] = useState<Kunde[]>(kunden);
  const searchRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Suchfeld automatisch fokussieren
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Gefilterte + sortierte Liste
  const filtered = useMemo(() => {
    return list
      .filter((k) =>
        `${k.nachname} ${k.vorname}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => a.nachname.localeCompare(b.nachname));
  }, [list, search]);

  const clearSearch = () => {
    setSearch("");
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  // ---------------------------------------------------------
  // 🔥 Kunde löschen
  // ---------------------------------------------------------
  const deleteKunde = async (id: string) => {
    const sicher = confirm("Soll dieser Kunde wirklich gelöscht werden?");
    if (!sicher) return;

    const { error } = await supabase.from("kunden").delete().eq("id", id);

    if (error) {
      alert("Fehler beim Löschen: " + error.message);
      return;
    }

    // Sofort aus der Liste entfernen
    setList((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="w-full">
      {/* Suchfeld */}
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
                {/* 🔵 Bearbeiten */}
                <button
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                  onClick={() => router.push(`/kunden/${k.id}`)}
                >
                  Bearbeiten
                </button>

                {/* 🔴 Löschen */}
                <button
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                  onClick={() => deleteKunde(k.id)}
                >
                  Löschen
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