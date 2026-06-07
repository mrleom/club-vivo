import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { CoachPageHeader } from "../../../../components/coach/CoachPageHeader";
import { ActivityOutput } from "../../../../components/coach/ActivityOutput";
import { DiagramPlaceholder } from "../../../../components/coach/DiagramPlaceholder";
import {
  QUICK_SESSION_TITLE_HINTS_COOKIE,
  normalizeQuickSessionTitle,
  parseQuickSessionTitleHints,
  withQuickSessionTitleHint
} from "../../../../lib/quick-session-title-hints";
import {
  buildQuickSessionFocusSummary,
  buildQuickSessionTitle
} from "../../../../lib/quick-session-intent";
import { getCurrentUser } from "../../../../lib/get-current-user";
import {
  SESSION_BUILDER_CONTEXT_HINTS_COOKIE,
  formatEnvironmentLabel,
  parseSessionBuilderContextHints
} from "../../../../lib/session-builder-context-hints";
import { buildBuilderSessionLabel } from "../../../../lib/builder-session-label";
import { getCurrentUserIdentity } from "../../../../lib/get-current-user-identity";
import {
  SESSION_ORIGIN_HINTS_COOKIE,
  getSessionOriginLabel,
  parseSessionOriginHints
} from "../../../../lib/session-origin-hints";
import {
  getSession,
  getSessionPdf,
  SessionBuilderApiError,
  submitSessionFeedback,
  type SessionDetail,
  type SessionFeedbackFlowMode,
  type SessionFeedbackImageAnalysisAccuracy
} from "../../../../lib/session-builder-api";
import { getWorkspaceCookieName } from "../../../../lib/workspace-local-cookies";
import {
  SessionFeedbackPanel,
  type FeedbackPanelState
} from "./session-feedback-panel";
import { SessionExportButton } from "./session-export-button";
import { QuickSessionTitleEditor } from "./quick-session-title-editor";

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatMinuteLabel(value: number) {
  return `${value} min`;
}

function formatActivityCount(value: number) {
  return `${value} ${value === 1 ? "activity" : "activities"}`;
}

function formatEquipmentCount(value: number) {
  return `${value} ${value === 1 ? "item" : "items"}`;
}

function formatEquipmentUsed(equipment: string[]) {
  return equipment.length > 0 ? equipment.join(", ") : "Use the simplest field setup that fits the activity.";
}

function formatAgeBandDisplay(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.startsWith("u")) {
    return normalized.toUpperCase();
  }

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSessionFlowSummary(activities: SessionDetail["activities"]) {
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
    .map((activity) => activity.name.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return steps.length > 0 ? steps.join(" -> ") : "No saved session flow available.";
}

function buildFieldPlanTitle({
  modeLabel,
  focusLabel,
  ageBand
}: {
  modeLabel: string;
  focusLabel: string;
  ageBand: string;
}) {
  const ageBandLabel = formatAgeBandDisplay(ageBand);
  const normalizedFocus = focusLabel.replace(/\s+/g, " ").trim();

  if (normalizedFocus) {
    return `${modeLabel}: ${[normalizedFocus, ageBandLabel].filter(Boolean).join(" ")}`;
  }

  return [modeLabel, ageBandLabel].filter(Boolean).join(" ");
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
  return <span className="h-3.5 w-3.5 rounded-full bg-yellow-400 ring-1 ring-yellow-600" />;
}

function LineLegendSymbol({ dash, curved = false }: { dash?: string; curved?: boolean }) {
  const path = curved ? "M4 12 C11 3, 24 3, 32 10" : "M3 9 H33";

  return (
    <svg viewBox="0 0 36 18" aria-hidden="true" className="h-5 w-10 shrink-0">
      <path
        d={path}
        fill="none"
        stroke="#334155"
        strokeDasharray={dash}
        strokeLinecap="round"
        strokeWidth="1.9"
      />
      <path
        d="M29 6 L34 9 L29 12"
        fill="none"
        stroke="#334155"
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

function DiagramLegendCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Diagram legend
      </h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
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
  );
}

function buildActivityTimings(activities: SessionDetail["activities"]) {
  let elapsedMinutes = 0;

  return activities.map((activity) => {
    const startMinute = elapsedMinutes;
    const endMinute = startMinute + activity.minutes;
    elapsedMinutes = endMinute;

    return {
      durationLabel: formatMinuteLabel(activity.minutes),
      rangeLabel: `${startMinute}-${endMinute} min`
    };
  });
}

const IMAGE_ANALYSIS_ACCURACY_VALUES = new Set<SessionFeedbackImageAnalysisAccuracy>([
  "not_used",
  "low",
  "medium",
  "high"
]);

const FLOW_MODE_VALUES = new Set<SessionFeedbackFlowMode>([
  "session_builder",
  "environment_profile",
  "setup_to_drill"
]);

const INITIAL_FEEDBACK_PANEL_STATE: FeedbackPanelState = {
  status: "idle",
  values: {
    sessionQuality: "",
    drillUsefulness: "",
    imageAnalysisAccuracy: "not_used",
    favoriteActivity: "",
    missingFeatures: "",
    flowMode: ""
  }
};

function buildInitialFeedbackPanelState(
  flowMode: SessionFeedbackFlowMode | ""
): FeedbackPanelState {
  return {
    ...INITIAL_FEEDBACK_PANEL_STATE,
    values: {
      ...INITIAL_FEEDBACK_PANEL_STATE.values,
      flowMode
    }
  };
}

function buildFeedbackActivityOptions(activities: SessionDetail["activities"]) {
  return activities
    .map((activity, index) => {
      const name = activity.name.replace(/\s+/g, " ").trim();
      const value = `Activity ${index + 1}: ${name}`;

      return value.length > 280 ? value.slice(0, 280).trim() : value;
    })
    .filter(Boolean);
}

function getTrimmedValue(formData: FormData, field: string) {
  return String(formData.get(field) || "").trim();
}

function parseImageAnalysisAccuracy(
  value: string
): SessionFeedbackImageAnalysisAccuracy | undefined {
  return IMAGE_ANALYSIS_ACCURACY_VALUES.has(value as SessionFeedbackImageAnalysisAccuracy)
    ? (value as SessionFeedbackImageAnalysisAccuracy)
    : undefined;
}

function parseFlowMode(value: string): SessionFeedbackFlowMode | undefined {
  return FLOW_MODE_VALUES.has(value as SessionFeedbackFlowMode)
    ? (value as SessionFeedbackFlowMode)
    : undefined;
}

export default async function SessionDetailPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  let session: SessionDetail;

  try {
    session = await getSession(sessionId);
  } catch (error) {
    if (error instanceof SessionBuilderApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const currentUser = await getCurrentUser();
  const cookieStore = await cookies();
  const sessionOriginHintsCookieName = getWorkspaceCookieName(
    SESSION_ORIGIN_HINTS_COOKIE,
    currentUser
  );
  const quickSessionTitleHintsCookieName = getWorkspaceCookieName(
    QUICK_SESSION_TITLE_HINTS_COOKIE,
    currentUser
  );
  const sessionBuilderContextHintsCookieName = getWorkspaceCookieName(
    SESSION_BUILDER_CONTEXT_HINTS_COOKIE,
    currentUser
  );
  const sessionOrigins = parseSessionOriginHints(
    cookieStore.get(sessionOriginHintsCookieName)?.value
  );
  const origin = sessionOrigins[sessionId];
  const isQuickSession = origin === "quick_session";
  const isBuilderSession = origin === "full_session" || origin === "quick_drill";
  const quickSessionTitles = parseQuickSessionTitleHints(
    cookieStore.get(quickSessionTitleHintsCookieName)?.value
  );
  const builderContexts = parseSessionBuilderContextHints(
    cookieStore.get(sessionBuilderContextHintsCookieName)?.value
  );
  const quickSessionTitle = quickSessionTitles[sessionId];
  const derivedQuickSessionTitle = isQuickSession
    ? buildQuickSessionTitle({
        session
      })
    : null;
  const displayQuickSessionTitle = quickSessionTitle || derivedQuickSessionTitle || "Quick Soccer Game";
  const quickSessionFocusSummary = isQuickSession
    ? buildQuickSessionFocusSummary(session)
    : null;
  const builderContext = builderContexts[sessionId];
  const coachIdentity = await getCurrentUserIdentity();
  const createdByLabel =
    isQuickSession || isBuilderSession
      ? coachIdentity || "Signed-in coach"
      : session.createdBy ?? "Unavailable";
  const builderModeLabel = origin ? getSessionOriginLabel(origin) : "Session";
  const builderSessionLabel = isBuilderSession
    ? buildBuilderSessionLabel({
        objective: builderContext?.objective,
        objectiveTags: session.objectiveTags,
        activities: session.activities
      })
    : null;
  const builderSessionFlowSummary = isBuilderSession
    ? buildSessionFlowSummary(session.activities)
    : null;
  const pageTitle = isQuickSession
    ? displayQuickSessionTitle
    : isBuilderSession
      ? builderModeLabel
      : `${session.sport} / ${session.ageBand}`;
  const sourceLabel = isQuickSession
    ? "Quick Soccer Game"
    : isBuilderSession
      ? `Session Builder - ${builderModeLabel}`
      : "Saved Session";
  const activityTimings = buildActivityTimings(session.activities);
  const feedbackFlowMode: SessionFeedbackFlowMode | "" =
    isQuickSession || isBuilderSession ? "session_builder" : "";
  const initialFeedbackPanelState = buildInitialFeedbackPanelState(feedbackFlowMode);
  const feedbackActivityOptions = buildFeedbackActivityOptions(session.activities);
  const activityCountLabel = formatActivityCount(session.activities.length);
  const headerDescription = isQuickSession
    ? `Coach-ready saved output from Quick Soccer Game with ${activityCountLabel} planned across ${formatMinuteLabel(session.durationMin)}.`
    : isBuilderSession
      ? undefined
      : `Saved session output with ${activityCountLabel} planned across ${formatMinuteLabel(session.durationMin)}.`;
  const environmentLabel = isBuilderSession
    ? formatEnvironmentLabel(builderContext?.environment)
    : "";
  const focusLabel = isQuickSession
    ? quickSessionFocusSummary || displayQuickSessionTitle
    : isBuilderSession
      ? builderSessionLabel || builderContext?.objective || ""
      : session.objectiveTags.join(", ");
  const contextLabel = [isBuilderSession ? builderContext?.teamName : undefined]
    .filter((value): value is string => Boolean(value))
    .join(" / ");
  const equipmentCountLabel = formatEquipmentCount(session.equipment.length);
  const equipmentUsedLabel = formatEquipmentUsed(session.equipment);
  const fieldPlanTitle = isBuilderSession
    ? buildFieldPlanTitle({
        modeLabel: builderModeLabel,
        focusLabel: builderSessionLabel || builderContext?.objective || "",
        ageBand: session.ageBand
      })
    : pageTitle;

  async function exportSessionPdfAction(
    _previousState: {
      error?: string;
    },
    formData: FormData
  ) {
    "use server";

    const requestedSessionId = String(formData.get("sessionId") || "").trim();

    if (!requestedSessionId || requestedSessionId !== sessionId) {
      return {
        error: "Export could not start for this session. Refresh and try again."
      };
    }

    try {
      const exportResult = await getSessionPdf(sessionId);
      redirect(exportResult.url);
    } catch (error) {
      if (error instanceof SessionBuilderApiError) {
        if (error.status === 404) {
          return {
            error: "PDF export is not available for this saved session right now."
          };
        }

        return {
          error: `PDF export failed with status ${error.status}. Try again shortly.`
        };
      }

      return {
        error: "PDF export is unavailable right now. Try again shortly."
      };
    }
  }

  async function saveQuickSessionTitleAction(
    _previousState: {
      error?: string;
      message?: string;
      savedTitle?: string;
    },
    formData: FormData
  ) {
    "use server";

    const nextTitle = normalizeQuickSessionTitle(String(formData.get("title") || ""));

    if (!nextTitle) {
      return {
        error: "Add a short Quick Soccer Game title before saving.",
        savedTitle: displayQuickSessionTitle
      };
    }

    const currentUser = await getCurrentUser();
    const responseCookieStore = await cookies();
    const quickSessionTitleHintsCookieName = getWorkspaceCookieName(
      QUICK_SESSION_TITLE_HINTS_COOKIE,
      currentUser
    );
    responseCookieStore.set(
      quickSessionTitleHintsCookieName,
      withQuickSessionTitleHint(
        responseCookieStore.get(quickSessionTitleHintsCookieName)?.value,
        sessionId,
        nextTitle
      ),
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax"
      }
    );

    return {
      message: "Saved",
      savedTitle: nextTitle
    };
  }

  async function submitFeedbackAction(
    _previousState: FeedbackPanelState,
    formData: FormData
  ): Promise<FeedbackPanelState> {
    "use server";

    const sessionQualityValue = getTrimmedValue(formData, "sessionQuality");
    const drillUsefulnessValue = getTrimmedValue(formData, "drillUsefulness");
    const imageAnalysisAccuracyValue = getTrimmedValue(formData, "imageAnalysisAccuracy");
    const favoriteActivityValue = getTrimmedValue(formData, "favoriteActivity");
    const missingFeaturesValue = getTrimmedValue(formData, "missingFeatures");
    const flowModeValue = getTrimmedValue(formData, "flowMode");
    const imageAnalysisAccuracy = parseImageAnalysisAccuracy(imageAnalysisAccuracyValue);
    const flowMode = parseFlowMode(flowModeValue);

    const values: FeedbackPanelState["values"] = {
      sessionQuality: sessionQualityValue,
      drillUsefulness: drillUsefulnessValue,
      imageAnalysisAccuracy:
        imageAnalysisAccuracy || INITIAL_FEEDBACK_PANEL_STATE.values.imageAnalysisAccuracy,
      favoriteActivity: favoriteActivityValue,
      missingFeatures: missingFeaturesValue,
      flowMode: flowMode || ""
    };

    const sessionQuality = Number.parseInt(sessionQualityValue, 10);
    const drillUsefulness = Number.parseInt(drillUsefulnessValue, 10);

    if (
      !Number.isInteger(sessionQuality) ||
      sessionQuality < 1 ||
      sessionQuality > 5 ||
      !Number.isInteger(drillUsefulness) ||
      drillUsefulness < 1 ||
      drillUsefulness > 5 ||
      !imageAnalysisAccuracy ||
      favoriteActivityValue.length > 280 ||
      !missingFeaturesValue ||
      missingFeaturesValue.length > 280 ||
      (flowModeValue !== "" && !flowMode)
    ) {
      return {
        status: "error",
        message: "Review the feedback fields and try again.",
        values
      };
    }

    try {
      await submitSessionFeedback(sessionId, {
        sessionQuality,
        drillUsefulness,
        imageAnalysisAccuracy,
        ...(favoriteActivityValue ? { favoriteActivity: favoriteActivityValue } : {}),
        missingFeatures: missingFeaturesValue,
        ...(flowMode ? { flowMode } : {})
      });

      return {
        status: "success",
        message: "Feedback recorded for this session.",
        values
      };
    } catch (error) {
      if (error instanceof SessionBuilderApiError) {
        if (error.status === 409) {
          return {
            status: "already-submitted",
            message: "Feedback already recorded for this session.",
            values
          };
        }

        if (error.status === 400) {
          return {
            status: "error",
            message: "Review the feedback fields and try again.",
            values
          };
        }

        return {
          status: "error",
          message: `Request failed with status ${error.status}.`,
          values
        };
      }

      return {
        status: "error",
        message: "Feedback could not be submitted right now. Try again shortly.",
        values
      };
    }
  }

  return (
    <div className="grid gap-6">
      <CoachPageHeader
        title={pageTitle}
        description={headerDescription}
        actions={
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <SessionExportButton sessionId={sessionId} exportAction={exportSessionPdfAction} />
            <Link
              href="/sessions"
              className="inline-flex rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Back to sessions
            </Link>
          </div>
        }
      />

      <section className="club-vivo-shell rounded-[2rem] border p-8 backdrop-blur">
        <section className="mb-8 rounded-[1.75rem] border border-slate-200 bg-white/80 p-5">
          <div className="grid gap-5">
            <div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Coach-ready field plan
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  {fieldPlanTitle}
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  Saved {formatCreatedAt(session.createdAt)}
                </p>
              </div>
            </div>

            <div className={isBuilderSession ? "grid gap-4 xl:grid-cols-[minmax(0,1fr)_28rem]" : "grid gap-4"}>
              <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  At a glance
              </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Source
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{sourceLabel}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Duration
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {formatMinuteLabel(session.durationMin)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Activities
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{activityCountLabel}</p>
                </div>

                {!isQuickSession && focusLabel ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Focus
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{focusLabel}</p>
                  </div>
                ) : null}

                {contextLabel ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Work group
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{contextLabel}</p>
                  </div>
                ) : null}

                  {isBuilderSession && environmentLabel ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Environment
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{environmentLabel}</p>
                    </div>
                  ) : null}

                  {isBuilderSession && builderSessionFlowSummary ? (
                    <div className="sm:col-span-2 xl:col-span-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Session story
                      </p>
                      <p className="mt-1 text-sm font-medium leading-6 text-slate-900">
                        {builderSessionFlowSummary}
                      </p>
                    </div>
                  ) : null}

                  {session.equipment.length > 0 ? (
                    <div className="sm:col-span-2 xl:col-span-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Equipment used
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{equipmentCountLabel}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {session.equipment.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
              </div>
              </section>

              {isBuilderSession ? <DiagramLegendCard /> : null}
            </div>
          </div>
        </section>

        <article className="rounded-3xl border border-slate-200 bg-white/75 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Coach-ready practice plan
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Run order</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Use this sequence on the field, moving from one activity to the next by time block.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {session.activities.map((activity, index) => (
              <ActivityOutput
                key={`${activity.name}-${index}`}
                activity={activity}
                activityIndex={index}
                objective={focusLabel}
                objectiveTags={session.objectiveTags}
                timing={activityTimings[index]}
                aside={
                  isBuilderSession ? (
                    <DiagramPlaceholder
                      activity={activity}
                      activityIndex={index}
                      totalActivities={session.activities.length}
                    />
                  ) : undefined
                }
                compact={isQuickSession}
              />
            ))}
          </div>
        </article>

        {!isBuilderSession ? (
          <>
            <div className={`grid gap-4 ${isQuickSession ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {isQuickSession ? "Quick Soccer Game title" : "Created by"}
                </h2>

                {isQuickSession ? (
                  <QuickSessionTitleEditor
                    initialTitle={displayQuickSessionTitle}
                    saveTitleAction={saveQuickSessionTitleAction}
                  />
                ) : (
                  <p className="mt-2 break-all text-sm text-slate-800">{createdByLabel}</p>
                )}
              </article>

              {isQuickSession ? (
                <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</h2>
                  <p className="mt-2 text-sm text-slate-800">{formatMinuteLabel(session.durationMin)}</p>
                </article>
              ) : null}

              {isQuickSession ? (
                <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Equipment used</h2>
                  <p className="mt-2 text-sm text-slate-800">{equipmentUsedLabel}</p>
                </article>
              ) : null}

              {!isQuickSession ? (
                <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created At</h2>
                  <p className="mt-2 text-sm text-slate-800">{formatCreatedAt(session.createdAt)}</p>
                </article>
              ) : null}
            </div>

            {!isQuickSession ? (
              <>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sport</h2>
                    <p className="mt-2 text-sm text-slate-800">{session.sport}</p>
                  </article>

                  <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Age Band</h2>
                    <p className="mt-2 text-sm text-slate-800">{session.ageBand}</p>
                  </article>

                  <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</h2>
                    <p className="mt-2 text-sm text-slate-800">{formatMinuteLabel(session.durationMin)}</p>
                  </article>

                  <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Schema Version</h2>
                    <p className="mt-2 text-sm text-slate-800">{session.schemaVersion}</p>
                  </article>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  <article className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                    <h2 className="text-lg font-semibold text-slate-900">Objective Tags</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {session.objectiveTags.length > 0 ? (
                        session.objectiveTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No objective tags</span>
                      )}
                    </div>
                  </article>

                  <article className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                    <h2 className="text-lg font-semibold text-slate-900">Equipment used</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {session.equipment.length > 0 ? (
                        session.equipment.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          Use the simplest field setup that fits the activity.
                        </span>
                      )}
                    </div>
                  </article>
                </div>
              </>
            ) : (
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                  <h2 className="text-lg font-semibold text-slate-900">Objective Tags</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {session.objectiveTags.length > 0 ? (
                      session.objectiveTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No objective tags</span>
                    )}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                  <h2 className="text-lg font-semibold text-slate-900">Equipment used</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {session.equipment.length > 0 ? (
                      session.equipment.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        Use the simplest field setup that fits the activity.
                      </span>
                    )}
                  </div>
                </article>
              </div>
            )}
          </>
        ) : null}

        <SessionFeedbackPanel
          initialState={initialFeedbackPanelState}
          submitAction={submitFeedbackAction}
          activityOptions={feedbackActivityOptions}
        />
      </section>
    </div>
  );
}
