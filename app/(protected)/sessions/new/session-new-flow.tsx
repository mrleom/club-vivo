"use client";

import { type ReactNode, useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  SessionBuilderTopBlock,
  type SessionEnvironmentOption
} from "../../../../components/coach/SessionBuilderTopBlock";
import { ActivityOutput } from "../../../../components/coach/ActivityOutput";
import { DiagramPlaceholder } from "../../../../components/coach/DiagramPlaceholder";
import { type SessionBuilderMode } from "../../../../components/coach/ModeSelector";
import { type WorkspaceTeamOption } from "../../../../components/coach/TeamSelector";
import type {
  GeneratedSession,
  ImageAnalysisMode,
  ImageAnalysisResult,
  SessionPack
} from "../../../../lib/session-builder-api";
import { buildBuilderSessionLabelFromSession } from "../../../../lib/builder-session-label";

export type AnalyzeFormState = {
  values: {
    mode: ImageAnalysisMode;
  };
  analysis?: ImageAnalysisResult;
  error?: string;
};

export type GenerateFormState = {
  values: {
    sport: string;
    ageBand: string;
    workGroupMode: WorkGroupMode;
    durationMin: string;
    environment: string;
    theme: string;
    constraints: string;
    equipment: string;
  };
  pack?: SessionPack;
  error?: string;
};

export type SaveFormState = {
  error?: string;
};

type GenerateAction = (
  state: GenerateFormState,
  formData: FormData
) => Promise<GenerateFormState>;

type SaveAction = (state: SaveFormState, formData: FormData) => Promise<SaveFormState>;
type SaveFormDispatch = (formData: FormData) => void;
type WorkGroupMode = "team" | "age_band";

const FULL_SESSION_DEFAULT_DURATION = "60";
const FULL_SESSION_MIN_DURATION = 45;
const FULL_SESSION_MAX_DURATION = 120;
const QUICK_DRILL_DEFAULT_DURATION = "20";
const QUICK_DRILL_MIN_DURATION = 15;
const QUICK_DRILL_MAX_DURATION = 25;
const DEFAULT_ENVIRONMENT_OPTIONS: SessionEnvironmentOption[] = [
  { value: "grass_field", label: "Full grass field" },
  { value: "turf_field", label: "Full turf field" },
  { value: "half_grass_field", label: "Half grass field" },
  { value: "half_turf_field", label: "Half turf field" },
  { value: "small_sided_field", label: "7v7 / 9v9 field" },
  { value: "small_grass_grid", label: "Small grass grid" },
  { value: "small_turf_grid", label: "Small turf grid" },
  { value: "indoor_wood_court", label: "Indoor wood court" },
  { value: "indoor_gym_floor", label: "Indoor gym floor" },
  { value: "hardcourt_grid", label: "Cement / hardcourt grid" }
];

function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex rounded-full border border-transparent bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Generating..." : "Generate session"}
    </button>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex rounded-full border border-transparent bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save session"}
    </button>
  );
}

function buildSessionContextTitle({
  teamName,
  ageBand,
  durationMin
}: {
  teamName: string;
  ageBand: string;
  durationMin: number;
}) {
  const durationLabel = Number.isFinite(durationMin) ? `${durationMin} min` : "";
  const parts = [teamName.trim(), ageBand.trim().toUpperCase(), durationLabel].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : "Generated session";
}

function PlayerLegendSymbol({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
      <circle cx="8" cy="8" r="5.4" fill={fill} stroke="white" strokeWidth="1.4" />
      <circle cx="8" cy="6.45" r="1.25" fill="white" opacity="0.9" />
      <path
        d="M5.25 9.75 C6.6 11, 9.4 11, 10.75 9.75"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="0.9"
        opacity="0.9"
      />
    </svg>
  );
}

function BallLegendSymbol() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-900 bg-white">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
    </span>
  );
}

function ConeLegendSymbol() {
  return (
    <span className="h-3.5 w-3.5 rounded-full bg-yellow-400 ring-1 ring-yellow-600" />
  );
}

function LineLegendSymbol({
  color = "#334155",
  dash,
  curved = false
}: {
  color?: string;
  dash?: string;
  curved?: boolean;
}) {
  const path = curved ? "M4 12 C11 3, 24 3, 32 10" : "M3 9 H33";

  return (
    <svg viewBox="0 0 36 18" aria-hidden="true" className="h-5 w-10 shrink-0">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeDasharray={dash}
        strokeLinecap="round"
        strokeWidth="1.9"
      />
      <path
        d="M29 6 L34 9 L29 12"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

function DiagramLegendItem({
  symbol,
  label
}: {
  symbol: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
      {symbol}
      <span className="text-xs leading-5 text-slate-700">{label}</span>
    </div>
  );
}

function buildSessionStory(activities: GeneratedSession["activities"]) {
  const activityText = activities
    .map((activity) => `${activity.name} ${activity.description || ""}`)
    .join(" ")
    .toLowerCase();

  if (
    activities.length === 4 &&
    activityText.includes("reaction chase") &&
    activityText.includes("escape gates mini tournament")
  ) {
    return [
      "Introduce gates and first-touch scoring.",
      "Add chase pressure.",
      "Add support and a second decision.",
      "Finish with an escape-gates mini tournament."
    ].join(" ");
  }

  if (
    activities.length === 4 &&
    activityText.includes("compact recovery transition game") &&
    activityText.includes("compact recovery final game")
  ) {
    return [
      "Start with a simple passing-to-turnover reaction.",
      "Add a live counter threat.",
      "Progress into protecting the central lane, then finish with a directional transition game where teams must react immediately after losing the ball."
    ].join(" ");
  }

  const steps = activities
    .map((activity, index) => {
      const name = activity.name.replace(/\s+/g, " ").trim();
      return name ? `${index + 1}. ${name}.` : "";
    })
    .filter(Boolean);

  return steps.length > 0 ? steps.join(" ") : "";
}

function CandidateCard({
  candidate,
  origin,
  saveFormAction,
  sessionTitleContext,
  coachNote
}: {
  candidate: GeneratedSession;
  origin: "full_session" | "quick_drill";
  saveFormAction: SaveFormDispatch;
  sessionTitleContext: {
    objective: string;
    teamName: string;
    environment: string;
  };
  coachNote?: string;
}) {
  const objectiveTags = Array.isArray(candidate.objectiveTags) ? candidate.objectiveTags : [];
  const sessionLabel = buildBuilderSessionLabelFromSession({
    objective: sessionTitleContext.objective,
    session: candidate
  });
  const contextTitle = buildSessionContextTitle({
    teamName: sessionTitleContext.teamName,
    ageBand: candidate.ageBand,
    durationMin: candidate.durationMin
  });
  const coachObjective = sessionTitleContext.objective.trim();
  const objectiveDisplay = coachObjective || objectiveTags.join(", ");
  const sessionStory = buildSessionStory(candidate.activities);

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Generated session
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {sessionLabel}
          </h3>
        </div>

        <form action={saveFormAction} className="sm:shrink-0">
          <input type="hidden" name="candidate" value={JSON.stringify(candidate)} />
          <input type="hidden" name="origin" value={origin} />
          <input type="hidden" name="objective" value={sessionTitleContext.objective} />
          <input type="hidden" name="teamName" value={sessionTitleContext.teamName} />
          <input type="hidden" name="environment" value={sessionTitleContext.environment} />
          <SaveButton />
        </form>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
        <section className="rounded-3xl border border-slate-200 bg-white/70 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h4 className="text-base font-semibold text-slate-900">{contextTitle}</h4>
            <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              At a glance
            </span>
          </div>

          <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Objective
            </h5>
            {objectiveDisplay ? (
              <p className="mt-2 text-sm leading-6 text-slate-800">{objectiveDisplay}</p>
            ) : null}
          </section>

          {coachNote ? (
            <section className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Coach note / activity idea
              </h5>
              <p className="mt-2 text-sm leading-6 text-slate-800">{coachNote}</p>
            </section>
          ) : null}

          {sessionStory ? (
            <section className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Session story
              </h5>
              <p className="mt-2 text-sm leading-6 text-slate-800">{sessionStory}</p>
            </section>
          ) : null}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-slate-900">Diagram legend</h4>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <DiagramLegendItem
              symbol={<PlayerLegendSymbol fill="#2563eb" />}
              label="Blue player = coached team"
            />
            <DiagramLegendItem
              symbol={<PlayerLegendSymbol fill="#ef4444" />}
              label="Red player = opponent / defender"
            />
            <DiagramLegendItem
              symbol={<PlayerLegendSymbol fill="#94a3b8" />}
              label="Gray player = neutral / free player"
            />
            <DiagramLegendItem symbol={<BallLegendSymbol />} label="Ball = ball" />
            <DiagramLegendItem symbol={<ConeLegendSymbol />} label="Yellow circle = cone / equipment" />
            <DiagramLegendItem
              symbol={<LineLegendSymbol />}
              label="Solid line = pass / shot / ball action"
            />
            <DiagramLegendItem
              symbol={<LineLegendSymbol dash="0.1 3.5" />}
              label="Dotted line = dribble / carry"
            />
            <DiagramLegendItem
              symbol={<LineLegendSymbol dash="6 4" />}
              label="Dashed line = movement / support / recovery / pressure"
            />
            <DiagramLegendItem
              symbol={<LineLegendSymbol curved />}
              label="Curved line = curved run / rotation / reset"
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Line color follows the acting player.
          </p>
        </section>
      </div>

      <section className="mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h4 className="text-lg font-semibold text-slate-900">Activities</h4>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {candidate.activities.length} activities
          </span>
        </div>

        <div className="mt-4 grid gap-4">
          {candidate.activities.map((activity, activityIndex) => (
            <ActivityOutput
              key={`${activity.name}-${activityIndex}`}
              activity={activity}
              activityIndex={activityIndex}
              objective={coachObjective}
              objectiveTags={objectiveTags}
              aside={
                <DiagramPlaceholder
                  activity={activity}
                  activityIndex={activityIndex}
                  totalActivities={candidate.activities.length}
                />
              }
            />
          ))}
        </div>
      </section>
    </article>
  );
}

export function NewSessionFlow({
  initialGenerateState,
  initialSaveState,
  teamOptions,
  initialEquipmentOptions,
  initialConstraints,
  generateAction,
  saveAction
}: {
  initialGenerateState: GenerateFormState;
  initialSaveState: SaveFormState;
  teamOptions: WorkspaceTeamOption[];
  initialEquipmentOptions: string[];
  initialConstraints?: string;
  generateAction: GenerateAction;
  saveAction: SaveAction;
}) {
  const [generateState, generateFormAction] = useActionState(generateAction, initialGenerateState);
  const [saveState, saveFormAction] = useActionState(saveAction, initialSaveState);
  const [selectedTeamId, setSelectedTeamId] = useState(teamOptions[0]?.id ?? "");
  const [workGroupMode, setWorkGroupMode] = useState<WorkGroupMode>(
    initialGenerateState.values.workGroupMode || (teamOptions.length > 0 ? "team" : "age_band")
  );
  const [workspaceMode, setWorkspaceMode] = useState<SessionBuilderMode>("full_session");
  const [sport, setSport] = useState(initialGenerateState.values.sport);
  const [ageBand, setAgeBand] = useState(initialGenerateState.values.ageBand);
  const [durationMin, setDurationMin] = useState(initialGenerateState.values.durationMin);
  const [environment, setEnvironment] = useState(initialGenerateState.values.environment);
  const [environmentOptions] = useState<SessionEnvironmentOption[]>(DEFAULT_ENVIRONMENT_OPTIONS);
  const [objective, setObjective] = useState(initialGenerateState.values.theme);
  const [constraints, setConstraints] = useState(initialConstraints ?? initialGenerateState.values.constraints);
  const [equipment, setEquipment] = useState(initialGenerateState.values.equipment);
  const equipmentOptions = initialEquipmentOptions;
  const reviewSectionRef = useRef<HTMLElement | null>(null);
  const lastScrolledPackIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setSport(generateState.values.sport);
    setAgeBand(generateState.values.ageBand);
    setWorkGroupMode(generateState.values.workGroupMode || (teamOptions.length > 0 ? "team" : "age_band"));
    setDurationMin(generateState.values.durationMin);
    setEnvironment(generateState.values.environment);
    setObjective(generateState.values.theme);
    setConstraints(generateState.values.constraints);
    setEquipment(generateState.values.equipment);
  }, [
    generateState.values.ageBand,
    generateState.values.constraints,
    generateState.values.durationMin,
    generateState.values.equipment,
    generateState.values.environment,
    generateState.values.sport,
    generateState.values.workGroupMode,
    generateState.values.theme
  ]);

  useEffect(() => {
    const packId = generateState.pack?.packId;

    if (!packId || lastScrolledPackIdRef.current === packId) {
      return;
    }

    lastScrolledPackIdRef.current = packId;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reviewSectionRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }, [generateState.pack?.packId]);

  const minimumDuration = workspaceMode === "quick_drill" ? QUICK_DRILL_MIN_DURATION : FULL_SESSION_MIN_DURATION;
  const maximumDuration = workspaceMode === "quick_drill" ? QUICK_DRILL_MAX_DURATION : FULL_SESSION_MAX_DURATION;
  const selectedTeam = teamOptions.find((team) => team.id === selectedTeamId);
  const activeTeam = workGroupMode === "team" ? selectedTeam : undefined;
  const ageBandGroupName = `${ageBand.toUpperCase()} age-band group`;

  function handleModeChange(mode: SessionBuilderMode) {
    setWorkspaceMode(mode);
    setDurationMin(mode === "quick_drill" ? QUICK_DRILL_DEFAULT_DURATION : FULL_SESSION_DEFAULT_DURATION);
  }

  function handleTeamChange(teamId: string) {
    setSelectedTeamId(teamId);

    const selectedTeam = teamOptions.find((team) => team.id === teamId);
    if (!selectedTeam) {
      return;
    }

    setSport(selectedTeam.sport);

    if (selectedTeam.ageBand) {
      setAgeBand(selectedTeam.ageBand);
    }
  }

  function handleWorkGroupModeChange(nextMode: WorkGroupMode) {
    setWorkGroupMode(nextMode);

    if (nextMode !== "team") {
      return;
    }

    const nextTeam = teamOptions.find((team) => team.id === selectedTeamId) || teamOptions[0];

    if (!nextTeam) {
      setWorkGroupMode("age_band");
      return;
    }

    if (nextTeam.id !== selectedTeamId) {
      setSelectedTeamId(nextTeam.id);
    }

    setSport(nextTeam.sport);

    if (nextTeam.ageBand) {
      setAgeBand(nextTeam.ageBand);
    }
  }

  return (
    <div className="mt-8 grid gap-8">
      <SessionBuilderTopBlock
        formAction={generateFormAction}
        confirmedProfileJson=""
        error={generateState.error}
        teams={teamOptions}
        selectedTeamId={selectedTeamId}
        onTeamChange={handleTeamChange}
        workGroupMode={workGroupMode}
        onWorkGroupModeChange={handleWorkGroupModeChange}
        mode={workspaceMode}
        onModeChange={handleModeChange}
        sport={sport}
        ageBand={ageBand}
        onAgeBandChange={setAgeBand}
        durationMin={durationMin}
        onDurationMinChange={setDurationMin}
        minimumDuration={minimumDuration}
        maximumDuration={maximumDuration}
        environment={environment}
        environmentOptions={environmentOptions}
        onEnvironmentChange={setEnvironment}
        objective={objective}
        onObjectiveChange={setObjective}
        constraints={constraints}
        onConstraintsChange={setConstraints}
        equipment={equipment}
        onEquipmentChange={setEquipment}
        equipmentOptions={equipmentOptions}
        selectedTeamName={activeTeam?.label || ""}
        selectedTeamAgeBand={activeTeam?.ageBand}
        selectedTeamProgramType={activeTeam?.programType}
        selectedTeamPlayerCount={activeTeam?.playerCount}
        actions={<GenerateButton />}
      />

      <section ref={reviewSectionRef} className="rounded-3xl border border-slate-200 bg-white/70 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Review before saving</h2>

          {workspaceMode === "quick_drill" ? (
            <p className="max-w-sm rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              Drill / Activity uses the shared generation path. It is a focused planning frame,
              not a separate backend mode.
            </p>
          ) : null}
        </div>

        {saveState.error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveState.error}
          </p>
        ) : null}

        {generateState.pack ? (
          <div className="mt-6 grid gap-5">
            {generateState.pack.sessions.slice(0, 1).map((candidate, index) => (
              <CandidateCard
                key={`${generateState.pack?.packId}-${index}`}
                candidate={candidate}
                origin={workspaceMode === "quick_drill" ? "quick_drill" : "full_session"}
                saveFormAction={saveFormAction}
                sessionTitleContext={{
                  objective,
                  teamName: activeTeam?.label || ageBandGroupName,
                  environment
                }}
                coachNote={generateState.values.constraints}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
            <h3 className="text-base font-semibold text-slate-900">No session options yet</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Generate a session above to see a coach-ready plan here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
