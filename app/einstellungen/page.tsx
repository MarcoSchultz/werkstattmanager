"use client";

import { useRouter } from "next/navigation";

export default function Einstellungen() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold underline mb-6">Einstellungen</h1>

      <p className="text-gray-600 mb-6">
        Hier kannst du Stammdaten und Systemkonfigurationen verwalten.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anreden */}
        <button
          onClick={() => router.push("/einstellungen/anreden")}
          className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 text-left"
        >
          <h2 className="font-bold text-lg">Anreden</h2>
          <p className="text-sm text-gray-600">
            Herr, Frau, Firma, Divers … verwalten
          </p>
        </button>

        {/* Fahrzeugmarken */}
        <button
          onClick={() => router.push("/einstellungen/marken")}
          className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 text-left"
        >
          <h2 className="font-bold text-lg">Fahrzeugmarken</h2>
          <p className="text-sm text-gray-600">
            Marken wie VW, BMW, Mercedes … verwalten
          </p>
        </button>

        {/* Fahrzeugmodelle */}
        <button
          onClick={() => router.push("/einstellungen/modelle")}
          className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 text-left"
        >
          <h2 className="font-bold text-lg">Fahrzeugmodelle</h2>
          <p className="text-sm text-gray-600">
            Modelle pro Marke verwalten (z. B. Golf, Passat, A4)
          </p>
        </button>

        {/* Platzhalter für zukünftige Bereiche */}
        <div className="p-4 border rounded shadow-sm bg-gray-100 text-gray-400">
          <h2 className="font-bold text-lg">Weitere Einstellungen</h2>
          <p className="text-sm">Bald verfügbar …</p>
        </div>
      </div>
    </div>
  );
}
