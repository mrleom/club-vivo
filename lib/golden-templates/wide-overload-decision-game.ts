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

const TEMPLATE_ID = "wide-overload-decision-game";
const SUPPORTED_AGE_BANDS = ["u12", "u14", "u16", "u18", "adult"] as const;
const PRIMARY_TRIGGERS = ["overload", "free player", "numbers up"];
const CONTEXT_TRIGGERS = ["wide", "width", "channel", "attacking", "create chances"];

function matchesWideOverloadDecisionGame(input: GenerateSessionPackInput) {
  const text = getTemplateSearchText(input);

  return (
    input.sport === "soccer" &&
    hasNoSportPack(input) &&
    input.sessionMode === "full_session" &&
    input.durationMin === 60 &&
    ageBandIsOneOf(input, SUPPORTED_AGE_BANDS) &&
    hasAnyPhrase(text, PRIMARY_TRIGGERS) &&
    hasAnyPhrase(text, CONTEXT_TRIGGERS)
  );
}

function buildWideOverloadDecisionGame(input: GenerateSessionPackInput): SessionPack {
  const equipment = resolveTemplateEquipment(input, ["Balls", "Cones", "Pinnies", "Pugg goals"]);

  return buildGoldenSessionPack({
    templateId: TEMPLATE_ID,
    input,
    equipment,
    objectiveTags: ["attacking", "overload", "wide play", "create chances"],
    activities: [
      {
        name: "Overload Gates Activation",
        minutes: 12,
        description: buildActivityDescription([
          [
            "Setup",
            "Set a 16 x 15 meter grid (18 x 16 yards) with four cone gates. Start with two attackers, one defender, and a ball beside the coach."
          ],
          [
            "How to run it",
            "Attackers create a quick 2v1, commit the defender, and score by dribbling or passing through any open gate."
          ],
          [
            "Rules / scoring",
            "Attackers get one point for using the free player before scoring. The defender scores by winning the ball or forcing play out."
          ],
          [
            "Coaching cues",
            "Drive at the defender, see the free player early, make the pass before the space closes, and move after passing."
          ],
          [
            "What to watch for",
            "Watch for attackers standing square, passing too early, or dribbling into pressure when the free player is open."
          ],
          [
            "Progression",
            "Move to 3v2 or require the final action to go through a wide gate."
          ],
          [
            "Regression",
            "Start unopposed for one round or freeze once to show the passing lane."
          ]
        ])
      },
      {
        name: "Wide Overload Decision Game",
        minutes: 18,
        description: buildActivityDescription([
          [
            "Setup",
            "Create a 24 x 20 meter field (26 x 22 yards) with a wide channel, a central start cone, a target gate, two blue attackers, one wide free player, and two red defenders."
          ],
          [
            "How to run it",
            "Blue starts centrally, attracts pressure, then chooses whether to find the wide free player, combine with support, or dribble through the open lane."
          ],
          [
            "Rules / scoring",
            "Blue scores by reaching the target gate after using the overload. Red scores by winning and countering through the start gate."
          ],
          [
            "Coaching cues",
            "Stretch the defender, keep the wide player available, use the first touch to face forward, and choose pass or dribble based on pressure."
          ],
          [
            "What to watch for",
            "Look for the wide player drifting inside, the ball carrier forcing play, or support arriving after the overload has disappeared."
          ],
          [
            "Progression",
            "Limit the attack to eight seconds or require the wide player to receive before the final gate."
          ],
          [
            "Regression",
            "Start 3v1, keep the wide player fixed in the channel, or widen the field."
          ]
        ])
      },
      {
        name: "Overload Recovery Counter Game",
        minutes: 18,
        description: buildActivityDescription([
          [
            "Setup",
            "Use the same direction as Activity 2 and add a recovery line plus a counter gate. Start 3v2 and release a recovering defender after the first touch."
          ],
          [
            "How to run it",
            "Blue attacks the first overload, then makes a second decision before the recovery defender closes the space."
          ],
          [
            "Rules / scoring",
            "Blue scores through the target gate within eight seconds. Red scores by regaining and countering through the opposite gate."
          ],
          [
            "Coaching cues",
            "Attack before the recovery run arrives, support underneath the ball, and switch from dribble to pass when the defender commits."
          ],
          [
            "What to watch for",
            "Watch for slow restarts, players hiding behind defenders, or the recovery defender arriving with no pressure on the ball."
          ],
          [
            "Progression",
            "Shorten the time limit or let the recovery defender start closer."
          ],
          [
            "Regression",
            "Delay the recovery defender until the second touch or give blue an extra support player."
          ]
        ])
      },
      {
        name: "Overload Gate Battle Final Game",
        minutes: 12,
        description: buildActivityDescription([
          [
            "Format",
            "Small-sided gate battle on a 36 x 28 meter field (39 x 31 yards) with fast restarts."
          ],
          [
            "Teams",
            "Play balanced blue and red teams. Rotate quickly or let the winning team stay on for the next round."
          ],
          [
            "Scoring",
            "One point for scoring through a gate and one bonus point for finding a wide player or support run before the chance."
          ],
          [
            "Constraint",
            "The bonus only counts when the overload creates the chance."
          ],
          [
            "Win condition",
            "First team to three goals wins the round."
          ],
          [
            "Focus",
            "Keep it competitive, reward brave attacking decisions, and let the game flow."
          ]
        ])
      }
    ]
  });
}

export const wideOverloadDecisionGameTemplate: GoldenTemplate = {
  id: TEMPLATE_ID,
  lane: "session_builder",
  version: 1,
  matches: matchesWideOverloadDecisionGame,
  build: buildWideOverloadDecisionGame
};
