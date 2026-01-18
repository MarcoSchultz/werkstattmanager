import { createClient } from "@supabase/supabase-js";
import KundenForm from "./KundenForm";

export default async function NeuerKunde() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: anreden } = await supabase
    .from("anrede")
    .select("id, bezeichnung")
    .order("bezeichnung");

  async function speichern(formData: FormData) {
    "use server";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const form = {
      anrede_id: formData.get("anrede_id"),
      vorname: formData.get("vorname"),
      nachname: formData.get("nachname"),
      strasse: formData.get("strasse"),
      plz: formData.get("plz"),
      ort: formData.get("ort"),
      telefon: formData.get("telefon"),
      email: formData.get("email"),
    };

    const { data, error } = await supabase
      .from("kunden")
      .insert([form])
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return data.id;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold underline mb-6">Neuen Kunden anlegen</h1>
      <KundenForm anreden={anreden || []} speichern={speichern} />
    </div>
  );
}
