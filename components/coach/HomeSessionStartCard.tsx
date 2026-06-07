"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { QuickSessionActionState } from "../../app/(protected)/sessions/quick-session-actions";

type HomeSessionStartCardProps = {
  createQuickSessionAction: (
    state: QuickSessionActionState,
    formData: FormData
  ) => Promise<QuickSessionActionState>;
  initialPrompt?: string;
  showPromptHelper?: boolean;
};

function CreateActivityButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex rounded-full bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Creating..." : "Create game"}
    </button>
  );
}

export function HomeSessionStartCard({
  createQuickSessionAction,
  initialPrompt = "",
  showPromptHelper = true
}: HomeSessionStartCardProps) {
  const [notes, setNotes] = useState(initialPrompt);
  const [state, formAction] = useActionState<QuickSessionActionState, FormData>(
    createQuickSessionAction,
    {}
  );

  return (
    <section className="club-vivo-shell rounded-[2rem] border p-6 backdrop-blur sm:p-8">
      <form action={formAction} className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quick Soccer Game</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Add one practical coaching note or game idea for a focused 20-minute soccer activity
            by default. Use Session Builder when you want the full Custom Build setup for a
            longer plan.
          </p>
        </div>

        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium">Coaching note / game idea (required)</span>
          <textarea
            name="prompt"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={6}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
            placeholder="Example: 10 players, only cones and balls, make a game-like activity for defending 1v1."
            required
          />
          {showPromptHelper ? (
            <span className="text-xs leading-5 text-slate-500">
              Describe the Quick Soccer Game you want, or add practical context like players, field
              limits, equipment, player needs, constraints, or a creative game idea.
            </span>
          ) : null}
        </label>

        {state.error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        <div className="flex justify-start">
          <CreateActivityButton />
        </div>
      </form>
    </section>
  );
}
