"use client";

import { useMemo, useState } from "react";

import type {
  TrainingBriefDraftPreview,
  TrainingBriefDraftPreviewInput,
  TrainingBriefSessionBuilderHandoff
} from "../../lib/session-builder-api";

type TrainingBriefDraftApplyInput = {
  objective: string;
  constraints: string;
  durationMin: string;
  equipment: string;
  ageBand: string;
  sessionMode: "full_session";
};

type TrainingBriefDraftReviewProps = {
  sport: string;
  ageBand: string;
  durationMin: string;
  equipment: string;
  equipmentOptions: string[];
  selectedTeamName?: string;
  selectedTeamAgeBand?: string;
  selectedTeamPlayerCount?: number;
  previewAction: (input: TrainingBriefDraftPreviewInput) => Promise<{
    trainingBriefDraft?: TrainingBriefDraftPreview;
    error?: string;
  }>;
  onApply: (input: TrainingBriefDraftApplyInput) => void;
};

type ReviewDraft = {
  recommendedFocus: string;
  rationale: string;
  activityDirection: string;
  sessionBuilderHandoff: TrainingBriefSessionBuilderHandoff;
};

const AGE_BAND_OPTIONS = [
  { value: "u8", label: "U8" },
  { value: "u10", label: "U10" },
  { value: "u12", label: "U12" },
  { value: "u14", label: "U14" },
  { value: "u16", label: "U16" },
  { value: "u18", label: "U18" },
  { value: "adult", label: "Adult" }
];
const AGE_BAND_VALUES = new Set(AGE_BAND_OPTIONS.map((option) => option.value));

const FULL_SESSION_MIN_DURATION = 45;
const FULL_SESSION_MAX_DURATION = 120;

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number) {
  const compacted = compactText(value);
  return compacted.length > maxLength ? compacted.slice(0, maxLength).trim() : compacted;
}

function parseEquipment(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSupportedAgeBand(value: string, fallback: string) {
  if (AGE_BAND_VALUES.has(value)) {
    return value;
  }

  return AGE_BAND_VALUES.has(fallback) ? fallback : "u14";
}

function buildSessionBuilderNotes({
  evidenceSummary,
  nextGameObjective,
  coachNotes,
  durationMin,
  ageBand
}: {
  evidenceSummary: string;
  nextGameObjective: string;
  coachNotes: string;
  durationMin: string;
  ageBand: string;
}) {
  return [
    `Evidence: ${compactText(evidenceSummary)}`,
    nextGameObjective ? `Objective: ${compactText(nextGameObjective)}` : "",
    coachNotes ? `Coach notes: ${compactText(coachNotes)}` : "",
    `Planning group: ${ageBand.toUpperCase()}`,
    `Session length: ${durationMin} minutes`
  ]
    .filter(Boolean)
    .join("\n");
}

export function TrainingBriefDraftReview({
  sport,
  ageBand,
  durationMin,
  equipment,
  equipmentOptions,
  selectedTeamName,
  selectedTeamAgeBand,
  selectedTeamPlayerCount,
  previewAction,
  onApply
}: TrainingBriefDraftReviewProps) {
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [nextGameObjective, setNextGameObjective] = useState("");
  const [coachNotes, setCoachNotes] = useState("");
  const [draftDurationMin, setDraftDurationMin] = useState(durationMin || "60");
  const [draftAgeBand, setDraftAgeBand] = useState(
    getSupportedAgeBand(selectedTeamAgeBand || "", ageBand)
  );
  const [draftEquipment, setDraftEquipment] = useState(equipment);
  const [backendDraft, setBackendDraft] = useState<TrainingBriefDraftPreview>();
  const [previewError, setPreviewError] = useState<string>();
  const [isPreviewPending, setIsPreviewPending] = useState(false);

  const localDraft = useMemo<ReviewDraft>(() => {
    const recommendedFocus = truncate(nextGameObjective || evidenceSummary, 120);
    const rationale = evidenceSummary
      ? truncate(
          nextGameObjective
            ? `Based on the coach notes, the session should prepare the group for: ${nextGameObjective}.`
            : "Based on the coach notes, the session should focus on the highest-priority issue.",
          260
        )
      : "";
    const sessionBuilderNotes = evidenceSummary
      ? buildSessionBuilderNotes({
          evidenceSummary,
          nextGameObjective,
          coachNotes,
          durationMin: draftDurationMin,
          ageBand: draftAgeBand
        })
      : "";
    const activityDirection = recommendedFocus
      ? `Build the main activity around ${recommendedFocus.toLowerCase()}.`
      : "";

    return {
      recommendedFocus,
      rationale,
      activityDirection,
      sessionBuilderHandoff: {
        sport: sport === "fut-soccer" ? "soccer" : sport,
        ageBand: draftAgeBand,
        durationMin: Number.parseInt(draftDurationMin, 10) || 60,
        theme: recommendedFocus,
        sessionMode: "full_session",
        coachNotes: sessionBuilderNotes,
        equipment: parseEquipment(draftEquipment)
      }
    };
  }, [
    coachNotes,
    draftAgeBand,
    draftDurationMin,
    draftEquipment,
    evidenceSummary,
    nextGameObjective,
    sport
  ]);

  const parsedDuration = Number.parseInt(draftDurationMin, 10);
  const durationIsValid =
    Number.isInteger(parsedDuration) &&
    parsedDuration >= FULL_SESSION_MIN_DURATION &&
    parsedDuration <= FULL_SESSION_MAX_DURATION;
  const displayDraft = backendDraft || localDraft;
  const canPreview = Boolean(localDraft.recommendedFocus && evidenceSummary && durationIsValid);
  const canApply = Boolean(displayDraft.recommendedFocus && evidenceSummary && durationIsValid);
  const selectedEquipment = parseEquipment(draftEquipment);
  const visibleEquipmentOptions = [
    "balls",
    "cones",
    "bibs",
    ...equipmentOptions.filter((option) => {
      const normalized = option.toLowerCase();
      return normalized !== "balls" && normalized !== "cones" && normalized !== "bibs";
    })
  ];

  function resetBackendPreview() {
    setBackendDraft(undefined);
    setPreviewError(undefined);
  }

  function toggleEquipment(value: string) {
    const selectedSet = new Set(selectedEquipment);
    const nextItems = selectedSet.has(value)
      ? selectedEquipment.filter((item) => item !== value)
      : [...selectedEquipment, value];

    resetBackendPreview();
    setDraftEquipment(nextItems.join(", "));
  }

  async function handlePreview() {
    if (!canPreview) {
      setPreviewError("Add evidence, choose a supported duration, then preview the draft.");
      return;
    }

    setIsPreviewPending(true);
    setPreviewError(undefined);

    try {
      const result = await previewAction({
        sport: sport === "fut-soccer" ? "soccer" : sport,
        ageBand: draftAgeBand,
        durationMinutes: parsedDuration,
        ...(selectedTeamPlayerCount ? { playerCount: selectedTeamPlayerCount } : {}),
        evidenceSummary: compactText(evidenceSummary),
        ...(coachNotes.trim() ? { coachNotes: compactText(coachNotes) } : {}),
        ...(nextGameObjective.trim()
          ? { nextGameObjective: compactText(nextGameObjective) }
          : {}),
        availableEquipment: selectedEquipment
      });

      if (result.trainingBriefDraft) {
        setBackendDraft(result.trainingBriefDraft);
        return;
      }

      setPreviewError(result.error || "The Training Brief preview could not be built.");
    } catch {
      setPreviewError("The Training Brief preview could not be built. Review the notes and try again.");
    } finally {
      setIsPreviewPending(false);
    }
  }

  function handleApply() {
    if (!canApply) {
      return;
    }

    const handoff = displayDraft.sessionBuilderHandoff;

    onApply({
      objective: handoff.theme || displayDraft.recommendedFocus,
      constraints: handoff.coachNotes,
      durationMin: String(handoff.durationMin),
      equipment: handoff.equipment.join(", "),
      ageBand: handoff.ageBand,
      sessionMode: handoff.sessionMode
    });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Training Brief Draft</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Turn match notes into a reviewed starting point for the normal Session Builder.
          </p>
        </div>
        <span className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-teal-800">
          Review first
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Evidence summary</span>
            <textarea
              value={evidenceSummary}
              onChange={(event) => {
                resetBackendPreview();
                setEvidenceSummary(event.target.value);
              }}
              className="min-h-28 rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              placeholder="Example: We lost compactness after turnovers and gave up central counterattacks."
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Next-game objective</span>
            <input
              value={nextGameObjective}
              onChange={(event) => {
                resetBackendPreview();
                setNextGameObjective(event.target.value);
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              placeholder="Example: Recover compact shape after losing the ball"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Coach notes</span>
            <textarea
              value={coachNotes}
              onChange={(event) => {
                resetBackendPreview();
                setCoachNotes(event.target.value);
              }}
              className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              placeholder="Example: Half field, simple setup, keep it competitive."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-700">
              <span className="font-medium">Age band</span>
              <select
                value={draftAgeBand}
                onChange={(event) => {
                  resetBackendPreview();
                  setDraftAgeBand(event.target.value);
                }}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              >
                {AGE_BAND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              <span className="font-medium">Duration</span>
              <input
                type="number"
                min={String(FULL_SESSION_MIN_DURATION)}
                max={String(FULL_SESSION_MAX_DURATION)}
                step="1"
                value={draftDurationMin}
                onChange={(event) => {
                  resetBackendPreview();
                  setDraftDurationMin(event.target.value);
                }}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              />
              {!durationIsValid ? (
                <span className="text-xs leading-5 text-red-600">
                  Use 45 to 120 minutes for this first full-session draft.
                </span>
              ) : null}
            </label>
          </div>

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Available equipment</span>
            <input
              value={draftEquipment}
              onChange={(event) => {
                resetBackendPreview();
                setDraftEquipment(event.target.value);
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              placeholder="balls, cones, bibs"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {visibleEquipmentOptions.slice(0, 8).map((option) => {
              const selected = selectedEquipment.includes(option);
              const buttonClassName = [
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                selected
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
              ].join(" ");

              return selected ? (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleEquipment(option)}
                  className={buttonClassName}
                  aria-pressed="true"
                >
                  {option}
                </button>
              ) : (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleEquipment(option)}
                  className={buttonClassName}
                  aria-pressed="false"
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Review draft</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {backendDraft ? "Backend preview confirmed." : "Local draft preview."}
            </p>
            {selectedTeamName ? (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Using team context from {selectedTeamName}.
              </p>
            ) : null}
          </div>

          {displayDraft.recommendedFocus ? (
            <div className="mt-4 grid gap-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Suggested focus
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-800">
                  {displayDraft.recommendedFocus}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Why this
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-800">{displayDraft.rationale}</p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Activity direction
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-800">
                  {displayDraft.activityDirection}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Session Builder handoff
                </h4>
                <div className="mt-2 grid gap-2 text-sm leading-6 text-slate-800">
                  <div>
                    <p className="font-medium text-slate-600">Focus</p>
                    <p>{displayDraft.sessionBuilderHandoff.theme}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium text-slate-600">Sport</p>
                      <p>{displayDraft.sessionBuilderHandoff.sport}</p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-600">Mode</p>
                      <p>{displayDraft.sessionBuilderHandoff.sessionMode.replace("_", " ")}</p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-600">Age band</p>
                      <p>{displayDraft.sessionBuilderHandoff.ageBand.toUpperCase()}</p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-600">Duration</p>
                      <p>{displayDraft.sessionBuilderHandoff.durationMin} minutes</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-slate-600">Equipment</p>
                    <p>
                      {displayDraft.sessionBuilderHandoff.equipment.length
                        ? displayDraft.sessionBuilderHandoff.equipment.join(", ")
                        : "Builder choice"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-slate-600">Coach notes</p>
                    <p className="whitespace-pre-line">
                      {displayDraft.sessionBuilderHandoff.coachNotes || "None"}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-600">
              Add evidence and an objective to preview the draft before applying it.
            </div>
          )}

          {previewError ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {previewError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handlePreview}
            disabled={!canPreview || isPreviewPending}
            className="mt-5 inline-flex w-full justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPreviewPending ? "Previewing..." : "Preview draft"}
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!canApply || isPreviewPending}
            className="mt-3 inline-flex w-full justify-center rounded-full border border-transparent bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Apply to Session Builder
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            You can edit the normal builder fields after applying.
          </p>
        </aside>
      </div>
    </section>
  );
}

export type { TrainingBriefDraftApplyInput };
