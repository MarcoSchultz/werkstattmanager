import { createClient } from "@supabase/supabase-js";
import KundenForm from "./KundenForm";

export default async function NeuerKunde() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: anreden, error } = await supabase
    .from("anrede")
    .select("id, bezeichnung")
    .order("bezeichnung", { ascending: true });

  if (error) {
    return <div>Fehler beim Laden der Anreden: {error.message}</div>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold underline mb-6">Neuen Kunden anlegen</h1>
      <KundenForm anreden={anreden || []} />
    </div>
  );
}
