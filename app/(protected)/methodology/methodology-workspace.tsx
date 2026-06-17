"use client";

import { useEffect, useState, useTransition } from "react";

import type { MethodologyRecord, MethodologyScope } from "../../../lib/methodology-api";

type LoadMethodologyResult = {
  methodology: MethodologyRecord | null;
  error?: string;
};

type SaveMethodologyResult = {
  methodology?: MethodologyRecord;
  error?: string;
  message?: string;
};

type PublishMethodologyResult = {
  methodology?: MethodologyRecord;
  error?: string;
  message?: string;
};

type MethodologyWorkspaceProps = {
  initialScope: MethodologyScope;
  initialMethodology: MethodologyRecord | null;
  isAdmin: boolean;
  loadMethodologyAction: (scope: MethodologyScope) => Promise<LoadMethodologyResult>;
  saveMethodologyAction: (
    scope: MethodologyScope,
    input: { title: string; content: string }
  ) => Promise<SaveMethodologyResult>;
  publishMethodologyAction: (scope: MethodologyScope) => Promise<PublishMethodologyResult>;
};

const SCOPE_OPTIONS: Array<{ value: MethodologyScope; label: string }> = [
  { value: "shared", label: "Shared" },
  { value: "travel", label: "Travel" },
  { value: "ost", label: "OST" }
];

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function MethodologyWorkspace({
  initialScope,
  initialMethodology,
  isAdmin,
  loadMethodologyAction,
  saveMethodologyAction,
  publishMethodologyAction
}: MethodologyWorkspaceProps) {
  const [selectedScope, setSelectedScope] = useState<MethodologyScope>(initialScope);
  const [methodology, setMethodology] = useState<MethodologyRecord | null>(initialMethodology);
  const [title, setTitle] = useState(initialMethodology?.title || "");
  const [content, setContent] = useState(initialMethodology?.content || "");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => setMessage(undefined), 2600);
    return () => window.clearTimeout(timeout);
  }, [message]);

  function syncDraft(nextMethodology: MethodologyRecord | null) {
    setMethodology(nextMethodology);
    setTitle(nextMethodology?.title || "");
    setContent(nextMethodology?.content || "");
  }

  function handleSelectScope(scope: MethodologyScope) {
    if (scope === selectedScope || isPending) {
      return;
    }

    setSelectedScope(scope);
    setMessage(undefined);
    setError(undefined);

    startTransition(async () => {
      const result = await loadMethodologyAction(scope);

      if (result.error) {
        syncDraft(null);
        setError(result.error);
        return;
      }

      syncDraft(result.methodology);
    });
  }

  function handleSave() {
    setMessage(undefined);
    setError(undefined);

    startTransition(async () => {
      const result = await saveMethodologyAction(selectedScope, { title, content });

      if (result.error || !result.methodology) {
        setError(result.error || "We couldn't save this methodology draft.");
        return;
      }

      syncDraft(result.methodology);
      setMessage(result.message || "Draft saved.");
    });
  }

  function handlePublish() {
    if (!methodology) {
      return;
    }

    setMessage(undefined);
    setError(undefined);

    startTransition(async () => {
      const result = await publishMethodologyAction(selectedScope);

      if (result.error || !result.methodology) {
        setError(result.error || "We couldn't publish this methodology.");
        return;
      }

      syncDraft(result.methodology);
      setMessage(result.message || "Methodology published.");
    });
  }

  const isEmpty = methodology === null;
  const statusLabel = methodology ? methodology.status : "draft";

  return (
    <div className="grid gap-6">
      <section className="club-vivo-shell rounded-[2rem] border p-6 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Program view</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Choose the coaching context you want to review: shared club guidance, travel teams,
              or OST programs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Methodology scope">
            {SCOPE_OPTIONS.map((scope) => {
              const active = selectedScope === scope.value;

              return (
                <button
                  key={scope.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectScope(scope.value)}
                  className={joinClassNames(
                    "inline-flex rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-teal-700 text-white"
                      : "border border-slate-300 bg-white/70 text-slate-700 hover:bg-white"
                  )}
                >
                  {scope.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {!isAdmin ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Read-only: club admins can update these notes. Coaches can use them as planning guidance.
        </p>
      ) : null}

      {message ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="club-vivo-shell rounded-[2rem] border p-6 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">
                {SCOPE_OPTIONS.find((scope) => scope.value === selectedScope)?.label} methodology
              </h2>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                {statusLabel}
              </span>
            </div>

            {methodology ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Last updated {formatTimestamp(methodology.updatedAt)}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isAdmin
                  ? "No notes have been added yet. Add the first draft below."
                  : "No notes have been added yet. Once a club admin adds them, coaches can read them here."}
              </p>
            )}
          </div>

          {isAdmin ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex rounded-full bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save draft"}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPending || !methodology}
                className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Working..." : "Publish"}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              readOnly={!isAdmin}
              disabled={isPending}
              placeholder={isAdmin ? "Shared Possession Model" : "No title saved yet"}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700 disabled:cursor-not-allowed disabled:opacity-80 read-only:bg-slate-50"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Content</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              readOnly={!isAdmin}
              disabled={isPending}
              rows={18}
              placeholder={
                isAdmin
                  ? "Capture the coaching principles, language, and priorities that should guide this program."
                  : "No methodology content saved yet."
              }
              className="min-h-[24rem] rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 outline-none transition focus:border-teal-700 disabled:cursor-not-allowed disabled:opacity-80 read-only:bg-slate-50"
            />
          </label>

          {isEmpty ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm leading-6 text-slate-600">
              {isAdmin
                ? "This program view is ready for its first text-only draft. Saving will create the first set of notes."
                : "This program view does not have notes yet."}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
