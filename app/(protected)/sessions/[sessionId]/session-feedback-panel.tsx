"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type {
  SessionFeedbackFlowMode,
  SessionFeedbackImageAnalysisAccuracy,
} from "../../../../lib/session-builder-api";

type FeedbackPanelStatus = "idle" | "error" | "success" | "already-submitted";

type FeedbackPanelValues = {
  sessionQuality: string;
  drillUsefulness: string;
  imageAnalysisAccuracy: SessionFeedbackImageAnalysisAccuracy;
  favoriteActivity: string;
  missingFeatures: string;
  flowMode: SessionFeedbackFlowMode | "";
};

export type FeedbackPanelState = {
  status: FeedbackPanelStatus;
  message?: string;
  values: FeedbackPanelValues;
};

type FeedbackPanelAction = (
  state: FeedbackPanelState,
  formData: FormData
) => Promise<FeedbackPanelState>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex rounded-full border border-transparent bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Submitting..." : "Submit feedback"}
    </button>
  );
}

export function SessionFeedbackPanel({
  initialState,
  submitAction,
  activityOptions
}: {
  initialState: FeedbackPanelState;
  submitAction: FeedbackPanelAction;
  activityOptions: string[];
}) {
  const [state, formAction] = useActionState(submitAction, initialState);
  const isLocked = state.status === "success" || state.status === "already-submitted";

  return (
    <article className="mt-8 rounded-3xl border border-slate-200 bg-white/70 p-5">
      <h2 className="text-lg font-semibold text-slate-900">Coach feedback after field test</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Run the session with your team first, then record one field-test note for what worked,
        what needs adjustment, and what should shape future session generation.
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        One feedback submission is saved per session.
      </p>

      {isLocked ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.message || "Feedback recorded for this session."}
        </div>
      ) : (
        <form action={formAction} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-700">
              <span className="font-medium">Session quality</span>
              <select
                name="sessionQuality"
                defaultValue={state.values.sessionQuality}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
                required
              >
                <option value="">Select rating</option>
                <option value="1">1 - Not usable</option>
                <option value="2">2 - Needed major changes</option>
                <option value="3">3 - Usable with edits</option>
                <option value="4">4 - Strong session</option>
                <option value="5">5 - Ready to repeat</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              <span className="font-medium">Activity usefulness</span>
              <select
                name="drillUsefulness"
                defaultValue={state.values.drillUsefulness}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
                required
              >
                <option value="">Select rating</option>
                <option value="1">1 - Activities missed</option>
                <option value="2">2 - Limited value</option>
                <option value="3">3 - Some useful moments</option>
                <option value="4">4 - Mostly useful</option>
                <option value="5">5 - Very useful</option>
              </select>
            </label>
          </div>

          <input type="hidden" name="imageAnalysisAccuracy" value="not_used" />
          <input type="hidden" name="flowMode" value={state.values.flowMode} />

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Most useful activity</span>
            <select
              name="favoriteActivity"
              defaultValue={state.values.favoriteActivity}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
            >
              <option value="">Choose activity</option>
              {activityOptions.map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
            <span className="text-xs leading-5 text-slate-500">
              Pick the activity that produced the clearest learning or competition.
            </span>
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">What should improve in the next generated plan?</span>
            <textarea
              name="missingFeatures"
              defaultValue={state.values.missingFeatures}
              maxLength={280}
              rows={4}
              placeholder="Example: Activity 2 worked, but the next plan needs clearer setup spacing and an easier regression."
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              required
            />
            <span className="text-xs leading-5 text-slate-500">
              Mention missing setup detail, confusing wording, activity fit, progressions, regressions, or what should be repeated.
            </span>
          </label>

          {state.status === "error" && state.message ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}

          <div>
            <SubmitButton />
          </div>
        </form>
      )}
    </article>
  );
}
