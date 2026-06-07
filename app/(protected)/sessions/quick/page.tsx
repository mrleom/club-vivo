import { redirect } from "next/navigation";

function parseSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuickSessionPage({
  searchParams
}: {
  searchParams?: Promise<{ prompt?: string | string[] }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialPrompt = parseSearchParam(resolvedSearchParams?.prompt)?.trim() || "";
  const params = new URLSearchParams();

  if (initialPrompt) {
    params.set("notes", initialPrompt);
    params.set("durationMin", "20");
  }

  redirect(`/sessions/new${params.size > 0 ? `?${params.toString()}` : ""}`);
}
