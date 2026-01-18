import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Kunden zählen
  const { count: kundenCount } = await supabase
    .from("kunden")
    .select("*", { count: "exact" });

  // Fahrzeuge zählen
  const { count: fahrzeugeCount } = await supabase
    .from("fahrzeuge")
    .select("*", { count: "exact" });

  // Reparaturen zählen
  const { count: repCount } = await supabase
    .from("reparaturen")
    .select("*", { count: "exact" });

  // HU-Termine laden
  const { data: huListe } = await supabase
    .from("fahrzeuge")
    .select(`
      id,
      kennzeichen,
      naechste_hu,
      kunden:kunde_id (vorname, nachname)
    `)
    .not("naechste_hu", "is", null)
    .order("naechste_hu", { ascending: true })
    .limit(5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold underline mb-6">Dashboard</h1>

      {/* Statistiken */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-4 border rounded bg-gray-50 text-center">
          <h2 className="text-xl font-bold">{kundenCount}</h2>
          <p className="text-gray-600">Kunden</p>
        </div>

        <div className="p-4 border rounded bg-gray-50 text-center">
          <h2 className="text-xl font-bold">{fahrzeugeCount}</h2>
          <p className="text-gray-600">Fahrzeuge</p>
        </div>

        <div className="p-4 border rounded bg-gray-50 text-center">
          <h2 className="text-xl font-bold">{repCount}</h2>
          <p className="text-gray-600">Reparaturen</p>
        </div>
      </div>

      {/* HU-Termine */}
      <h2 className="text-xl font-bold mb-3">Nächste HU‑Termine</h2>

      {(!huListe || huListe.length === 0) && (
        <p className="text-gray-600">Keine HU‑Termine vorhanden.</p>
      )}

      {huListe && huListe.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Datum</th>
              <th className="border p-2">Kennzeichen</th>
              <th className="border p-2">Kunde</th>
              <th className="border p-2">Fahrzeug</th>
            </tr>
          </thead>

          <tbody>
            {huListe.map((f) => (
              <tr key={f.id}>
                <td className="border p-2">{f.naechste_hu}</td>
                <td className="border p-2">{f.kennzeichen}</td>
                <td className="border p-2">
                  {f.kunden?.vorname} {f.kunden?.nachname}
                </td>
                <td className="border p-2">
                  <Link
                    href={`/fahrzeuge/${f.id}`}
                    className="text-blue-600 underline"
                  >
                    Öffnen
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
