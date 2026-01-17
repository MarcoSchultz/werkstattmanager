import KundenListe from "@/components/KundenListe";
import { createClient } from "@supabase/supabase-js";

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: kunden, error } = await supabase
    .from("kunden")
    .select(`
      id,
      vorname,
      nachname,
      telefon,
      anrede:anrede_id (
        bezeichnung
      )
    `);

  if (error) {
    return <div>Fehler beim Laden der Kunden: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kundenliste</h1>
      <KundenListe kunden={kunden || []} />
    </div>
  );
}