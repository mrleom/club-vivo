"use client";

import Link from "next/link";

import { ActivityOutput } from "../../../../components/coach/ActivityOutput";
import type { GeneratedSession, SessionPack } from "../../../../lib/session-builder-api";
import {
  buildQuickSessionPromptSummary,
  buildQuickSessionTitle
} from "../../../../lib/quick-session-intent";

function QuickReviewCandidateCard({
  candidate,
  prompt,
  editHref
}: {
  candidate: GeneratedSession;
  prompt: string;
  editHref: string;
}) {
  const quickSessionTitle = buildQuickSessionTitle({
    prompt,
    session: candidate
  });
  const promptSummary = buildQuickSessionPromptSummary(prompt);
  const objectiveTags = Array.isArray(candidate.objectiveTags) ? candidate.objectiveTags : [];

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-5">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Quick Soccer Game
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">{quickSessionTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {promptSummary || "No Quick Soccer Game prompt summary saved."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {candidate.ageBand.toUpperCase()}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {candidate.durationMin} minutes
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {candidate.activities.length} {candidate.activities.length === 1 ? "activity" : "activities"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:shrink-0 sm:items-end">
          <Link
            href={editHref}
            className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
          >
            Revise prompt
          </Link>
          <p className="max-w-56 text-right text-xs leading-5 text-slate-500">
            Use this activity today, or revise the prompt to generate another version.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {candidate.activities.map((activity, activityIndex) => (
          <ActivityOutput
            key={`${activity.name}-${activityIndex}`}
            activity={activity}
            activityIndex={activityIndex}
            objective={promptSummary}
            objectiveTags={objectiveTags}
            compact
          />
        ))}
      </div>
    </article>
  );
}

export function QuickSessionReview({
  pack,
  prompt,
  editHref
}: {
  pack: SessionPack;
  prompt: string;
  editHref: string;
}) {
  const quickCandidate = pack.sessions[0];

  if (!quickCandidate) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
        <h2 className="text-base font-semibold text-slate-900">No Quick Soccer Game available</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Create another Quick Soccer Game or move into Session Builder for the detailed setup flow.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6">
      <section className="grid gap-5">
        <QuickReviewCandidateCard
          key={`${pack.packId}-0`}
          candidate={quickCandidate}
          prompt={prompt}
          editHref={editHref}
        />
      </section>
    </div>
  );
}
