import type {
  GenerateSessionPackInput,
  GeneratedSession,
  SessionActivity,
  SessionPack
} from "../session-builder-api";

type PackConfig = {
  templateId: string;
  input: GenerateSessionPackInput;
  equipment: string[];
  objectiveTags: string[];
  activities: SessionActivity[];
};

export function normalizeTemplateText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getTemplateSearchText(input: GenerateSessionPackInput) {
  return normalizeTemplateText(`${input.theme || ""} ${input.coachNotes || ""}`);
}

export function hasAnyPhrase(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(normalizeTemplateText(phrase)));
}

export function ageBandIsOneOf(input: GenerateSessionPackInput, ageBands: readonly string[]) {
  const normalizedAgeBand = normalizeTemplateText(input.ageBand);
  return ageBands.includes(normalizedAgeBand);
}

export function hasNoSportPack(input: GenerateSessionPackInput) {
  return !input.sportPackId;
}

export function resolveTemplateEquipment(
  input: GenerateSessionPackInput,
  fallbackEquipment: string[]
) {
  const equipment = (input.equipment || [])
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return equipment.length > 0 ? [...new Set(equipment)] : fallbackEquipment;
}

export function buildActivityDescription(sections: Array<[string, string]>) {
  return sections
    .map(([label, text]) => `${label}: ${text.replace(/\s+/g, " ").trim()}`)
    .join(" ");
}

export function buildGoldenSessionPack({
  templateId,
  input,
  equipment,
  objectiveTags,
  activities
}: PackConfig): SessionPack {
  const session: GeneratedSession = {
    sport: input.sport,
    ageBand: input.ageBand,
    durationMin: input.durationMin,
    objectiveTags,
    equipment,
    activities
  };

  return {
    packId: `golden_${templateId}_${Date.now()}`,
    createdAt: new Date().toISOString(),
    sport: input.sport,
    ageBand: input.ageBand,
    durationMin: input.durationMin,
    theme: input.theme,
    sessionsCount: 1,
    equipment,
    sessions: [session]
  };
}
