import type { GenerateSessionPackInput, SessionPack } from "../session-builder-api";
import type { GoldenTemplate } from "./types";
import { reactionChaseEscapeGatesTemplate } from "./reaction-chase-escape-gates";
import { wideOverloadDecisionGameTemplate } from "./wide-overload-decision-game";

const GOLDEN_TEMPLATES: GoldenTemplate[] = [
  reactionChaseEscapeGatesTemplate,
  wideOverloadDecisionGameTemplate
];

export function tryBuildGoldenTemplatePack(
  input: GenerateSessionPackInput
): SessionPack | undefined {
  const template = GOLDEN_TEMPLATES.find((candidate) => candidate.matches(input));
  return template?.build(input);
}
