import type { GenerateSessionPackInput, SessionPack } from "../session-builder-api";
import type { GoldenTemplate } from "./types";
import {
  ageBandIsOneOf,
  buildActivityDescription,
  buildGoldenSessionPack,
  getTemplateSearchText,
  hasAnyPhrase,
  hasNoSportPack,
  resolveTemplateEquipment
} from "./shared";

const TEMPLATE_ID = "reaction-chase-escape-gates";
const SUPPORTED_AGE_BANDS = ["u8", "u10", "u12", "u14"] as const;
const TRIGGER_PHRASES = ["duck duck goose", "reaction chase", "escape gates"];
const REJECT_PATTERN = /\b(?:finishing|finish|shooting|shoot|goals?|cutbacks?)\b/;

function matchesReactionChaseEscapeGates(input: GenerateSessionPackInput) {
  const text = getTemplateSearchText(input);

  return (
    input.sport === "soccer" &&
    hasNoSportPack(input) &&
    input.sessionMode === "quick_activity" &&
    input.durationMin >= 15 &&
    input.durationMin <= 25 &&
    ageBandIsOneOf(input, SUPPORTED_AGE_BANDS) &&
    hasAnyPhrase(text, TRIGGER_PHRASES) &&
    !REJECT_PATTERN.test(text)
  );
}

function buildReactionChaseEscapeGates(input: GenerateSessionPackInput): SessionPack {
  const equipment = resolveTemplateEquipment(input, ["Balls", "Cones", "Pinnies"]);

  return buildGoldenSessionPack({
    templateId: TEMPLATE_ID,
    input,
    equipment,
    objectiveTags: ["reaction", "first touch", "1v1", "escape"],
    activities: [
      {
        name: "Reaction Chase Escape Gates",
        minutes: input.durationMin,
        description: buildActivityDescription([
          [
            "Setup",
            "Set a 16 x 15 meter grid (18 x 16 yards) with four cone gates around the outside. Put players in pairs with one ball per pair when possible."
          ],
          [
            "How to start",
            "One player starts as the attacker and one as the chaser. The coach calls a trigger word or serves the ball to start the race."
          ],
          [
            "How to run it",
            "The attacker takes a positive first touch away from pressure and tries to dribble through any open gate before the chaser can tag or win the ball."
          ],
          [
            "Rules / scoring",
            "Attackers score one point for escaping through a gate under control. Chasers score one point for tagging the attacker or winning the ball before the gate."
          ],
          [
            "Coaching cues",
            "React quickly, scan before the first touch, touch away from pressure, protect the ball, and accelerate through the gate."
          ],
          [
            "What to watch for",
            "Look for players standing still after the trigger, first touches back into pressure, and chasers running past the attacker without slowing down."
          ],
          [
            "Progression",
            "Add a support player outside the grid so the attacker can escape by passing through a gate or dribbling through one."
          ],
          [
            "Regression",
            "Start with no chaser for one round, widen the gates, or let the attacker choose the gate before the trigger."
          ],
          [
            "Safety / space adjustment",
            "Keep pairs spread out, reset quickly after each round, and make the grid bigger if players are colliding or waiting too long."
          ]
        ])
      }
    ]
  });
}

export const reactionChaseEscapeGatesTemplate: GoldenTemplate = {
  id: TEMPLATE_ID,
  lane: "quick_soccer_game",
  version: 1,
  matches: matchesReactionChaseEscapeGates,
  build: buildReactionChaseEscapeGates
};
