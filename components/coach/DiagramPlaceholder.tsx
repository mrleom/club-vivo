"use client";

import { useEffect, useId, useState } from "react";

type DiagramActivity = {
  name: string;
  minutes: number;
  description?: string;
};

type DiagramKind =
  | "activation_chase_or_reaction"
  | "attacking_overload"
  | "defending_1v1"
  | "first_touch_pressure"
  | "directional_possession"
  | "mini_goal_possession"
  | "pugg_goal_finishing"
  | "transition_to_attack"
  | "pressure_cover_gates"
  | "recover_delay_win"
  | "compact_recovery_activation"
  | "compact_recovery_transition"
  | "compact_recovery_progression"
  | "reaction_chase_escape"
  | "reaction_chase_progression"
  | "generic_small_sided"
  | "final_game_format";

type LegendGroup = "roles" | "movement" | "equipment" | "space";

type LegendKey =
  | "coachedPlayer"
  | "oppositionPlayer"
  | "neutralPlayer"
  | "ball"
  | "ballAction"
  | "coachedRun"
  | "defenderPressure"
  | "dribbleCarry"
  | "rotationReset"
  | "cone"
  | "coneGate"
  | "miniGoal"
  | "puggGoal"
  | "freePlayer"
  | "activityArea"
  | "wideChannel"
  | "counterGate"
  | "recoveryLine"
  | "centralProtectionZone"
  | "turnoverBall"
  | "compactRecoveryRun"
  | "counterThreatLine"
  | "targetGate"
  | "attackerDribbleLine"
  | "defenderPressureLine"
  | "passFreePlayerLine"
  | "supportRunLine"
  | "recoveryDefenderLine"
  | "zone";

type PlayerRole = "coached" | "opposition" | "neutral";
type ArrowAction = "ball" | "run" | "pressure" | "carry" | "rotation" | "counter";

type DiagramToken =
  | { type: "zone"; x: number; y: number; width: number; height: number; label?: string; tone?: "wide" | "target" | "pressure" | "finish" | "recovery" | "danger" | "line" }
  | { type: "player"; role: PlayerRole; x: number; y: number; label?: string }
  | { type: "ball"; x: number; y: number }
  | { type: "cone"; x: number; y: number; label?: string }
  | { type: "gate"; x: number; y: number; rotate?: number; label?: string }
  | { type: "miniGoal"; x: number; y: number; rotate?: number; pugg?: boolean; label?: string }
  | { type: "label"; x: number; y: number; text: string; anchor?: "start" | "middle" | "end" }
  | { type: "arrow"; d: string; action: ArrowAction; label?: string };

type DiagramPanel = {
  title: string;
  caption: string;
  tokens: DiagramToken[];
  legend: LegendKey[];
};

const LEGEND_GROUP_ORDER: LegendGroup[] = ["roles", "movement", "equipment", "space"];

const LEGEND_META: Record<LegendKey, { group: LegendGroup; label: string }> = {
  coachedPlayer: { group: "roles", label: "Blue player = coached team / blue team" },
  oppositionPlayer: { group: "roles", label: "Red player = opposition / defender" },
  neutralPlayer: { group: "roles", label: "Gray player = neutral / free player" },
  ball: { group: "equipment", label: "Ball" },
  ballAction: { group: "movement", label: "Solid line = pass / shot / ball action" },
  coachedRun: { group: "movement", label: "Dashed line = support / recovery run" },
  defenderPressure: { group: "movement", label: "Dashed line = pressure / recovery" },
  dribbleCarry: { group: "movement", label: "Dotted line = dribble / carry" },
  rotationReset: { group: "movement", label: "Curved line = rotation / reset" },
  cone: { group: "equipment", label: "Yellow = cone/equipment" },
  coneGate: { group: "equipment", label: "Cone gate = scoring gate" },
  miniGoal: { group: "equipment", label: "Mini goal" },
  puggGoal: { group: "equipment", label: "Pugg goal" },
  freePlayer: { group: "roles", label: "Gray player = free player" },
  activityArea: { group: "space", label: "Activity area = marked working space" },
  wideChannel: { group: "space", label: "Wide channel = free-player lane" },
  counterGate: { group: "space", label: "Counter gate = counter target" },
  recoveryLine: { group: "space", label: "Recovery line = defender release line" },
  centralProtectionZone: { group: "space", label: "Orange zone = central space to protect" },
  turnoverBall: { group: "equipment", label: "Ball = turnover / counter start" },
  compactRecoveryRun: { group: "movement", label: "Blue dashed line = pressure / cover / inside recovery" },
  counterThreatLine: { group: "movement", label: "Red solid line = counter threat" },
  targetGate: { group: "space", label: "Target gate = attacking target" },
  attackerDribbleLine: { group: "movement", label: "Blue dotted line = attacker dribbles to gate" },
  defenderPressureLine: { group: "movement", label: "Red dashed line = defender pressures" },
  passFreePlayerLine: { group: "movement", label: "Blue solid line = pass to free player" },
  supportRunLine: { group: "movement", label: "Blue dashed line = support run" },
  recoveryDefenderLine: { group: "movement", label: "Red dashed line = recovery defender releases" },
  zone: { group: "space", label: "Activity area" }
};
const LEGEND_KEY_ORDER = Object.keys(LEGEND_META) as LegendKey[];
function normalizeText(value: string | undefined) {
  return String(value || "").toLowerCase();
}

function inferDiagramKind(activity: DiagramActivity | undefined, activityIndex: number, totalActivities = 1): DiagramKind {
  const text = normalizeText(`${activity?.name || ""} ${activity?.description || ""}`);
  const isFinalActivity =
    totalActivities > 1
      ? activityIndex === totalActivities - 1
      : /final game|tournament|competitive close|competitive final|small-sided competitive final|7v7 competitive final/i.test(text);

  if (isFinalActivity) {
    return "final_game_format";
  }

  const isCompactRecovery =
    /ball[- ]and[- ]reaction activation|compact recovery transition game|recover and protect central spaces|first three seconds after loss|recover inside.*protect the middle|central danger gate/.test(text);

  if (isCompactRecovery && activityIndex === 0) {
    return "compact_recovery_activation";
  }

  if (isCompactRecovery && activityIndex >= 2) {
    return "compact_recovery_progression";
  }

  if (isCompactRecovery) {
    return "compact_recovery_transition";
  }

  if (activityIndex === 0) {
    return "activation_chase_or_reaction";
  }

  const isReactionChase =
    /reaction|trigger|chase|escape|safe tag|tagging|receiver/.test(text) &&
    /gate|first touch|scan|pressure|support|counter/.test(text);

  if (isReactionChase && activityIndex >= 2) {
    return "reaction_chase_progression";
  }

  if (isReactionChase) {
    return "reaction_chase_escape";
  }

  if (/pugg/.test(text)) {
    return "pugg_goal_finishing";
  }

  if (/attacking overload|overload|free player|wide support|wide channel|wide play|pass or dribble|numbers up|extra player|create chances|combination play/.test(text)) {
    return "attacking_overload";
  }

  if (/mini goal|mini goals/.test(text) && /possession|target|directional|pressure/.test(text)) {
    return "mini_goal_possession";
  }

  if (/first touch|receiving box|scan before receiving|scan before the pass|pressure gate/.test(text)) {
    return "first_touch_pressure";
  }

  if (/1v1|angle and delay|side-on|body shape|delay|force wide|recovery line/.test(text) && /defend|defender|delay|recover/.test(text)) {
    return "defending_1v1";
  }

  if (/directional possession|target zone|target zones|rondo|possession under pressure|escape pass|split pass|support angle/.test(text)) {
    return "directional_possession";
  }

  if (/recover|regain|win it back|winning the ball|transition|counter|outlet|first pass|escape pressure after regain|own box/.test(text)) {
    return /delay|recover|win it back/.test(text) ? "recover_delay_win" : "transition_to_attack";
  }

  if (/3v3|pressure|cover|defending gates|defender/.test(text) && /gate/.test(text)) {
    return "pressure_cover_gates";
  }

  if (/duck|goose|chase|escape|reaction/.test(text) && /gate/.test(text)) {
    return "activation_chase_or_reaction";
  }

  if (activityIndex === 2) {
    return "recover_delay_win";
  }

  return "generic_small_sided";
}

function uniqueLegendKeys(keys: LegendKey[]) {
  return keys.filter((key, index) => keys.indexOf(key) === index);
}

function orderedLegendKeys(keys: LegendKey[]) {
  const uniqueKeys = uniqueLegendKeys(keys);
  return uniqueKeys.sort((a, b) => {
    const groupDelta = LEGEND_GROUP_ORDER.indexOf(LEGEND_META[a].group) - LEGEND_GROUP_ORDER.indexOf(LEGEND_META[b].group);

    if (groupDelta !== 0) {
      return groupDelta;
    }

    return LEGEND_KEY_ORDER.indexOf(a) - LEGEND_KEY_ORDER.indexOf(b);
  });
}

function panelHasToken(tokens: DiagramToken[], predicate: (token: DiagramToken) => boolean) {
  return tokens.some(predicate);
}

function panelUsesLegendKey(key: LegendKey, tokens: DiagramToken[]) {
  if (key === "coachedPlayer") return false;
  if (key === "oppositionPlayer") return false;
  if (key === "neutralPlayer" || key === "freePlayer") {
    return panelHasToken(tokens, (token) => token.type === "player" && token.role === "neutral");
  }
  if (key === "ball") return false;
  if (key === "cone") return false;
  if (key === "coneGate" || key === "targetGate" || key === "counterGate") {
    return panelHasToken(tokens, (token) => token.type === "gate");
  }
  if (key === "miniGoal") {
    return panelHasToken(tokens, (token) => token.type === "miniGoal" && !token.pugg);
  }
  if (key === "puggGoal") {
    return panelHasToken(tokens, (token) => token.type === "miniGoal" && Boolean(token.pugg));
  }
  if (key === "activityArea" || key === "zone") {
    return panelHasToken(tokens, (token) => token.type === "zone");
  }
  if (key === "wideChannel") {
    return panelHasToken(tokens, (token) => token.type === "zone" && token.tone === "wide");
  }
  if (key === "recoveryLine") {
    return panelHasToken(tokens, (token) => token.type === "zone" && (token.tone === "recovery" || token.tone === "line"));
  }
  if (key === "centralProtectionZone") {
    return panelHasToken(tokens, (token) => token.type === "zone" && token.tone === "danger");
  }
  if (key === "turnoverBall") {
    return panelHasToken(tokens, (token) => token.type === "ball");
  }
  if (key === "compactRecoveryRun") {
    return panelHasToken(tokens, (token) => token.type === "arrow" && token.action === "run");
  }
  if (key === "counterThreatLine") {
    return panelHasToken(tokens, (token) => token.type === "arrow" && token.action === "counter");
  }
  if (key === "ballAction" || key === "passFreePlayerLine") {
    return panelHasToken(tokens, (token) => token.type === "arrow" && token.action === "ball");
  }
  if (key === "coachedRun" || key === "supportRunLine") {
    return panelHasToken(tokens, (token) => token.type === "arrow" && token.action === "run");
  }
  if (key === "defenderPressure" || key === "defenderPressureLine" || key === "recoveryDefenderLine") {
    return panelHasToken(tokens, (token) => token.type === "arrow" && token.action === "pressure");
  }
  if (key === "dribbleCarry" || key === "attackerDribbleLine") {
    return panelHasToken(tokens, (token) => token.type === "arrow" && token.action === "carry");
  }
  if (key === "rotationReset") {
    return panelHasToken(tokens, (token) => token.type === "arrow" && token.action === "rotation");
  }

  return true;
}

function localLegendKeys(keys: LegendKey[], tokens: DiagramToken[]) {
  const visibleKeys = keys.filter((key) => panelUsesLegendKey(key, tokens));
  return visibleKeys.filter((key) => !(key === "zone" && visibleKeys.includes("activityArea")));
}

function inferredCaption(text: string) {
  const trimmedText = text.trim();
  return trimmedText ? trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1) : "";
}

function buildAttackingOverloadPanels(activityIndex: number): DiagramPanel[] {
  const isProgression = activityIndex >= 2;

  if (isProgression) {
    return [
      {
        title: "Setup",
        caption: inferredCaption("start central, keep the wide free player visible, and release a recovering defender from the recovery line."),
        legend: ["wideChannel", "targetGate", "counterGate", "recoveryLine"],
        tokens: [
          { type: "zone", x: 20, y: 16, width: 92, height: 72, tone: "target" },
          { type: "zone", x: 113, y: 16, width: 25, height: 72, tone: "wide" },
          { type: "zone", x: 96, y: 17, width: 2, height: 70, tone: "recovery" },
          { type: "gate", x: 141, y: 40, rotate: 90 },
          { type: "gate", x: 22, y: 70, rotate: 90 },
          { type: "player", role: "coached", x: 56, y: 53 },
          { type: "player", role: "coached", x: 75, y: 74 },
          { type: "player", role: "neutral", x: 122, y: 40 },
          { type: "player", role: "opposition", x: 84, y: 51 },
          { type: "player", role: "opposition", x: 103, y: 69 },
          { type: "ball", x: 66, y: 56 }
        ]
      },
      {
        title: "Action",
        caption: inferredCaption("the first decision finds the free player while the recovery defender releases from the line; the counter gate is ready if defenders win it."),
        legend: ["wideChannel", "targetGate", "counterGate", "recoveryLine", "passFreePlayerLine", "recoveryDefenderLine"],
        tokens: [
          { type: "zone", x: 20, y: 16, width: 92, height: 72, tone: "target" },
          { type: "zone", x: 113, y: 16, width: 25, height: 72, tone: "wide" },
          { type: "zone", x: 96, y: 17, width: 2, height: 70, tone: "recovery" },
          { type: "gate", x: 141, y: 40, rotate: 90 },
          { type: "gate", x: 22, y: 70, rotate: 90 },
          { type: "player", role: "coached", x: 58, y: 53 },
          { type: "player", role: "coached", x: 82, y: 74 },
          { type: "player", role: "neutral", x: 123, y: 40 },
          { type: "player", role: "opposition", x: 86, y: 50 },
          { type: "player", role: "opposition", x: 104, y: 67 },
          { type: "ball", x: 67, y: 56 },
          { type: "arrow", d: "M70 55 C84 48, 104 42, 120 40", action: "ball" },
          { type: "arrow", d: "M104 67 C101 59, 99 51, 97 43", action: "pressure" }
        ]
      }
    ];
  }

  return [
    {
      title: "Setup",
      caption: inferredCaption("set a wide channel, central ball start, central defender, and visible free player before the overload starts."),
        legend: ["freePlayer", "wideChannel", "targetGate"],
      tokens: [
        { type: "zone", x: 24, y: 16, width: 89, height: 72, tone: "target" },
        { type: "zone", x: 113, y: 16, width: 25, height: 72, tone: "wide" },
        { type: "gate", x: 140, y: 52, rotate: 90 },
        { type: "player", role: "coached", x: 66, y: 53 },
        { type: "player", role: "coached", x: 78, y: 74 },
        { type: "player", role: "neutral", x: 119, y: 40 },
        { type: "player", role: "opposition", x: 91, y: 52 },
        { type: "ball", x: 75, y: 56 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("the ball carrier commits the defender and passes to the free player; the support runner stays visible underneath."),
        legend: ["freePlayer", "wideChannel", "targetGate", "passFreePlayerLine", "supportRunLine"],
      tokens: [
        { type: "zone", x: 24, y: 16, width: 89, height: 72, tone: "target" },
        { type: "zone", x: 113, y: 16, width: 25, height: 72, tone: "wide" },
        { type: "gate", x: 140, y: 52, rotate: 90 },
        { type: "player", role: "coached", x: 67, y: 53 },
        { type: "player", role: "coached", x: 79, y: 77 },
        { type: "player", role: "neutral", x: 119, y: 40 },
        { type: "player", role: "opposition", x: 90, y: 51 },
        { type: "ball", x: 76, y: 56 },
        { type: "arrow", d: "M79 55 C91 48, 104 42, 116 40", action: "ball" },
        { type: "arrow", d: "M80 77 C89 70, 99 62, 111 55", action: "run" }
      ]
    },
    {
      title: "Score / Reset",
      caption: inferredCaption("attack the free-player side, score through the gate, then rotate the passer into the wide support role."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ballAction", "coachedRun", "defenderPressure", "rotationReset", "coneGate"],
      tokens: [
        { type: "gate", x: 140, y: 52, rotate: 90 },
        { type: "player", role: "neutral", x: 118, y: 36, label: "F" },
        { type: "player", role: "coached", x: 105, y: 57 },
        { type: "player", role: "coached", x: 78, y: 76 },
        { type: "player", role: "opposition", x: 91, y: 49 },
        { type: "ball", x: 118, y: 36 },
        { type: "arrow", d: "M119 38 C125 43, 132 48, 139 52", action: "ball" },
        { type: "arrow", d: "M78 76 C88 69, 99 63, 109 58", action: "run" },
        { type: "arrow", d: "M91 49 C100 48, 108 44, 116 38", action: "pressure" },
        { type: "arrow", d: "M105 61 C85 88, 51 81, 49 55", action: "rotation", label: "Rotate wide" },
        { type: "label", x: 135, y: 42, text: "Score gate", anchor: "end" }
      ]
    }
  ];
}

function buildDefending1v1Panels(): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("build a narrow channel with a recovery line so the defender can show angle and delay."),
      legend: ["coachedPlayer", "oppositionPlayer", "ball", "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 46, y: 16, width: 68, height: 73, label: "1v1 channel", tone: "pressure" },
        { type: "gate", x: 124, y: 35, rotate: 90 },
        { type: "gate", x: 124, y: 70, rotate: 90 },
        { type: "player", role: "coached", x: 56, y: 52, label: "A" },
        { type: "player", role: "opposition", x: 78, y: 49 },
        { type: "ball", x: 56, y: 52 },
        { type: "label", x: 81, y: 22, text: "Recovery line", anchor: "middle" },
        { type: "zone", x: 78, y: 18, width: 2, height: 69, tone: "target" }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("the defender curves in side-on, delays the attacker, and forces play away from the middle."),
      legend: ["coachedPlayer", "oppositionPlayer", "ball", "dribbleCarry", "defenderPressure", "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 46, y: 16, width: 68, height: 73, label: "Angle & delay", tone: "pressure" },
        { type: "gate", x: 124, y: 35, rotate: 90 },
        { type: "gate", x: 124, y: 70, rotate: 90 },
        { type: "player", role: "coached", x: 69, y: 52, label: "A" },
        { type: "player", role: "opposition", x: 88, y: 45 },
        { type: "ball", x: 69, y: 52 },
        { type: "arrow", d: "M71 53 C84 57, 96 62, 116 69", action: "carry" },
        { type: "arrow", d: "M88 45 C81 48, 76 51, 71 55", action: "pressure" },
        { type: "label", x: 94, y: 32, text: "Side-on", anchor: "middle" }
      ]
    },
    {
      title: "Score / Reset",
      caption: inferredCaption("attackers score through a gate; defenders score by delaying, winning, or recovering across the line."),
      legend: ["coachedPlayer", "oppositionPlayer", "ballAction", "defenderPressure", "rotationReset", "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 46, y: 16, width: 68, height: 73, tone: "pressure" },
        { type: "gate", x: 124, y: 70, rotate: 90 },
        { type: "player", role: "coached", x: 103, y: 65, label: "A" },
        { type: "player", role: "opposition", x: 91, y: 52 },
        { type: "ball", x: 103, y: 65 },
        { type: "arrow", d: "M105 65 C112 66, 118 68, 124 70", action: "ball" },
        { type: "arrow", d: "M91 52 C96 56, 100 60, 104 66", action: "pressure" },
        { type: "arrow", d: "M116 78 C84 96, 47 79, 57 55", action: "rotation", label: "Reset pair" },
        { type: "label", x: 80, y: 22, text: "Recovery line", anchor: "middle" }
      ]
    }
  ];
}

function buildFirstTouchPanels(): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("show the receiver, coach-start ball, pressure gate, and receiving box before the first touch happens."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ball", "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 61, y: 31, width: 38, height: 34, tone: "target" },
        { type: "gate", x: 103, y: 48, rotate: 90 },
        { type: "gate", x: 134, y: 54, rotate: 90 },
        { type: "player", role: "neutral", x: 30, y: 52 },
        { type: "player", role: "coached", x: 74, y: 50 },
        { type: "player", role: "opposition", x: 112, y: 48 },
        { type: "ball", x: 30, y: 52 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("the receiver scans, takes the first touch away from pressure, and exits toward the scoring gate."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ballAction", "coachedRun", "defenderPressure", "dribbleCarry", "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 61, y: 31, width: 38, height: 34, tone: "target" },
        { type: "gate", x: 103, y: 48, rotate: 90 },
        { type: "gate", x: 134, y: 54, rotate: 90 },
        { type: "player", role: "neutral", x: 30, y: 52 },
        { type: "player", role: "coached", x: 74, y: 50 },
        { type: "player", role: "opposition", x: 112, y: 48 },
        { type: "ball", x: 30, y: 52 },
        { type: "arrow", d: "M34 52 C47 48, 60 47, 71 50", action: "ball" },
        { type: "arrow", d: "M75 52 C91 63, 111 65, 132 55", action: "carry" },
        { type: "arrow", d: "M112 48 C100 48, 87 49, 76 51", action: "pressure" },
        { type: "arrow", d: "M58 76 C72 70, 87 66, 103 65", action: "run" }
      ]
    },
    {
      title: "Score / Reset",
      caption: inferredCaption("score through the exit gate, then rotate coach-start player to receiver and receiver to pressure."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ballAction", "rotationReset", "coneGate"],
      tokens: [
        { type: "gate", x: 134, y: 54, rotate: 90 },
        { type: "player", role: "coached", x: 116, y: 57 },
        { type: "player", role: "opposition", x: 98, y: 51 },
        { type: "player", role: "neutral", x: 51, y: 52 },
        { type: "ball", x: 116, y: 57 },
        { type: "arrow", d: "M117 57 C123 56, 128 55, 134 54", action: "ball" },
        { type: "arrow", d: "M116 64 C92 91, 49 84, 50 56", action: "rotation" }
      ]
    }
  ];
}

function buildPossessionPanels(useMiniGoals: boolean): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("build a directional possession area with target zones so the next pass has a clear destination."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ball", useMiniGoals ? "miniGoal" : "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 13, y: 18, width: 28, height: 69, label: "Target zone", tone: "target" },
        { type: "zone", x: 119, y: 18, width: 28, height: 69, label: "Target zone", tone: "target" },
        useMiniGoals
          ? { type: "miniGoal", x: 143, y: 52, rotate: 90 }
          : { type: "gate", x: 142, y: 52, rotate: 90 },
        { type: "player", role: "coached", x: 54, y: 35 },
        { type: "player", role: "coached", x: 54, y: 70 },
        { type: "player", role: "neutral", x: 128, y: 52, label: "T" },
        { type: "player", role: "opposition", x: 82, y: 43 },
        { type: "player", role: "opposition", x: 91, y: 67 },
        { type: "ball", x: 54, y: 35 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("use support angles to play away from pressure and connect into the target zone."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ballAction", "coachedRun", "defenderPressure", useMiniGoals ? "miniGoal" : "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 119, y: 18, width: 28, height: 69, label: "Target zone", tone: "target" },
        useMiniGoals
          ? { type: "miniGoal", x: 143, y: 52, rotate: 90 }
          : { type: "gate", x: 142, y: 52, rotate: 90 },
        { type: "player", role: "coached", x: 59, y: 36 },
        { type: "player", role: "coached", x: 76, y: 72 },
        { type: "player", role: "coached", x: 101, y: 50 },
        { type: "player", role: "neutral", x: 129, y: 52, label: "T" },
        { type: "player", role: "opposition", x: 82, y: 43 },
        { type: "player", role: "opposition", x: 93, y: 63 },
        { type: "ball", x: 59, y: 36 },
        { type: "arrow", d: "M62 37 C75 42, 89 46, 100 50", action: "ball" },
        { type: "arrow", d: "M101 50 C111 51, 120 52, 128 52", action: "ball" },
        { type: "arrow", d: "M76 72 C83 62, 91 55, 101 50", action: "run" },
        { type: "arrow", d: "M82 43 C74 40, 67 38, 61 36", action: "pressure" },
        { type: "arrow", d: "M93 63 C97 58, 100 54, 102 50", action: "pressure" }
      ]
    },
    {
      title: "Score / Reset",
      caption: inferredCaption("score by finding the target player or mini goal, then reset with the counter-pressure visible."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ballAction", "defenderPressure", "rotationReset", useMiniGoals ? "miniGoal" : "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 119, y: 18, width: 28, height: 69, label: "Target zone", tone: "target" },
        useMiniGoals
          ? { type: "miniGoal", x: 143, y: 52, rotate: 90 }
          : { type: "gate", x: 142, y: 52, rotate: 90 },
        { type: "player", role: "coached", x: 105, y: 51 },
        { type: "player", role: "neutral", x: 129, y: 52, label: "T" },
        { type: "player", role: "opposition", x: 93, y: 62 },
        { type: "ball", x: 105, y: 51 },
        { type: "arrow", d: useMiniGoals ? "M107 51 C119 51, 130 52, 143 52" : "M107 51 C116 51, 126 52, 142 52", action: "ball" },
        { type: "arrow", d: "M93 62 C100 59, 107 55, 114 52", action: "pressure" },
        { type: "arrow", d: "M130 68 C104 95, 65 88, 56 61", action: "rotation", label: "Reset direction" }
      ]
    }
  ];
}

function buildPuggFinishingPanels(): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("mark a finish lane, a coach feeder, a shooter, a recovering defender, a rebound cone, and a Pugg goal."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ball", "cone", "puggGoal", "zone"],
      tokens: [
        { type: "zone", x: 54, y: 30, width: 63, height: 43, label: "Finish lane", tone: "finish" },
        { type: "miniGoal", x: 133, y: 52, rotate: 90, pugg: true },
        { type: "cone", x: 104, y: 25, label: "Rebound cone" },
        { type: "player", role: "neutral", x: 32, y: 52, label: "Srv" },
        { type: "player", role: "coached", x: 58, y: 52, label: "Sh" },
        { type: "player", role: "opposition", x: 72, y: 68 },
        { type: "ball", x: 32, y: 52 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("feed into the finish lane, shoot quickly, and let the defender arrive under controlled pressure."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ballAction", "defenderPressure", "puggGoal", "zone"],
      tokens: [
        { type: "zone", x: 54, y: 30, width: 63, height: 43, label: "Finish lane", tone: "finish" },
        { type: "miniGoal", x: 133, y: 52, rotate: 90, pugg: true },
        { type: "player", role: "neutral", x: 32, y: 52, label: "Srv" },
        { type: "player", role: "coached", x: 69, y: 52, label: "Sh" },
        { type: "player", role: "opposition", x: 82, y: 67 },
        { type: "ball", x: 32, y: 52 },
        { type: "arrow", d: "M35 52 C46 49, 57 49, 68 52", action: "ball" },
        { type: "arrow", d: "M70 52 C89 49, 110 50, 133 52", action: "ball", label: "Shot" },
        { type: "arrow", d: "M82 67 C78 62, 74 57, 70 53", action: "pressure" }
      ]
    },
    {
      title: "Score / Reset",
      caption: inferredCaption("finish, chase the rebound, then rotate shooter to defender, defender to feeder, and feeder to shooter."),
      legend: ["coachedPlayer", "oppositionPlayer", "neutralPlayer", "ballAction", "coachedRun", "rotationReset", "cone", "puggGoal"],
      tokens: [
        { type: "miniGoal", x: 133, y: 52, rotate: 90, pugg: true },
        { type: "cone", x: 104, y: 25 },
        { type: "player", role: "coached", x: 103, y: 42, label: "Sh" },
        { type: "player", role: "opposition", x: 76, y: 67 },
        { type: "player", role: "neutral", x: 34, y: 52, label: "Srv" },
        { type: "ball", x: 103, y: 42 },
        { type: "arrow", d: "M104 42 C113 45, 123 49, 133 52", action: "ball" },
        { type: "arrow", d: "M103 42 C102 36, 102 31, 104 25", action: "run" },
        { type: "arrow", d: "M103 61 C82 92, 40 83, 35 56", action: "rotation", label: "Rotate" }
      ]
    }
  ];
}

function buildActivationPanels(): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("start with the simplest activation gate duel: one attacker, one defender, four scoring gates, then progress numbers in the activity text."),
      legend: ["activityArea", "coneGate"],
      tokens: [
        { type: "zone", x: 24, y: 18, width: 112, height: 69, tone: "target" },
        { type: "gate", x: 31, y: 29 },
        { type: "gate", x: 129, y: 29 },
        { type: "gate", x: 31, y: 77 },
        { type: "gate", x: 129, y: 77 },
        { type: "player", role: "coached", x: 62, y: 53 },
        { type: "player", role: "opposition", x: 91, y: 57 },
        { type: "ball", x: 70, y: 56 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("one attacker carries through a scoring gate while the defender pressures under control."),
      legend: ["activityArea", "coneGate", "attackerDribbleLine", "defenderPressureLine"],
      tokens: [
        { type: "zone", x: 24, y: 18, width: 112, height: 69, tone: "target" },
        { type: "gate", x: 31, y: 29 },
        { type: "gate", x: 129, y: 29 },
        { type: "gate", x: 31, y: 77 },
        { type: "gate", x: 129, y: 77 },
        { type: "player", role: "coached", x: 64, y: 50 },
        { type: "player", role: "opposition", x: 103, y: 65 },
        { type: "ball", x: 75, y: 55 },
        { type: "arrow", d: "M79 57 C94 68, 110 75, 126 77", action: "carry" },
        { type: "arrow", d: "M103 65 C98 66, 92 64, 85 59", action: "pressure" }
      ]
    }
  ];
}

function buildReactionChasePanels(isProgression: boolean): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption(
        isProgression
          ? "keep the same four scoring gates, start the ball with the attacker or nearby coach, then add support and a second defender."
          : "set an attacker, coach trigger, defender, ball start, and four escape gates with safe spacing between chase lanes."
      ),
      legend: ["coneGate", "activityArea"],
      tokens: [
        { type: "zone", x: 23, y: 18, width: 114, height: 69, tone: isProgression ? "finish" : "target" },
        { type: "gate", x: 31, y: 29 },
        { type: "gate", x: 129, y: 29 },
        { type: "gate", x: 31, y: 77 },
        { type: "gate", x: 129, y: 77 },
        { type: "player", role: "neutral", x: 48, y: 52 },
        { type: "player", role: "coached", x: 76, y: 52 },
        { type: "player", role: "opposition", x: 99, y: 50 },
        ...(isProgression
          ? [
              { type: "player" as const, role: "coached" as const, x: 101, y: 73 },
              { type: "player" as const, role: "opposition" as const, x: 113, y: 64 }
            ]
          : []),
        { type: "ball", x: isProgression ? 72 : 48, y: isProgression ? 53 : 52 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption(
        isProgression
          ? "the attacker scans, escapes first pressure, uses support if needed, then attacks any open scoring gate."
          : "the receiver reacts to the trigger, scans, takes the first touch away from pressure, and escapes through a gate."
      ),
      legend: [
        "coachedPlayer",
        "oppositionPlayer",
        "ballAction",
        "attackerDribbleLine",
        "defenderPressureLine",
        isProgression ? "supportRunLine" : "coneGate",
        "activityArea"
      ],
      tokens: [
        { type: "zone", x: 23, y: 18, width: 114, height: 69, tone: isProgression ? "finish" : "target" },
        { type: "gate", x: 31, y: 29 },
        { type: "gate", x: 129, y: 29 },
        { type: "gate", x: 31, y: 77 },
        { type: "gate", x: 129, y: 77 },
        { type: "player", role: "neutral", x: 48, y: 52 },
        { type: "player", role: "coached", x: isProgression ? 89 : 78, y: isProgression ? 48 : 49 },
        { type: "player", role: "opposition", x: 101, y: 53 },
        ...(isProgression
          ? [
              { type: "player" as const, role: "coached" as const, x: 106, y: 74 },
              { type: "player" as const, role: "opposition" as const, x: 116, y: 64 }
            ]
          : []),
        { type: "ball", x: isProgression ? 86 : 48, y: isProgression ? 49 : 52 },
        { type: "arrow", d: "M51 52 C61 48, 70 47, 78 49", action: "ball" },
        { type: "arrow", d: isProgression ? "M90 49 C100 40, 115 34, 128 29" : "M80 50 C95 43, 113 34, 128 29", action: "carry" },
        { type: "arrow", d: isProgression ? "M101 53 C97 51, 94 50, 90 49" : "M101 53 C94 52, 87 51, 80 50", action: "pressure" },
        ...(isProgression
          ? [
              { type: "arrow" as const, d: "M106 74 C113 76, 121 77, 129 77", action: "run" as const },
              { type: "arrow" as const, d: "M116 64 C112 60, 107 56, 101 53", action: "pressure" as const }
            ]
          : [])
      ]
    }
  ];
}

function buildCompactRecoveryActivationPanels(): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("begin with the same two blue players and one red counter attacker; the blue pass becomes the turnover moment."),
      legend: ["activityArea", "centralProtectionZone", "ballAction"],
      tokens: [
        { type: "zone", x: 30, y: 18, width: 100, height: 69, tone: "target" },
        { type: "zone", x: 70, y: 19, width: 20, height: 67, tone: "danger" },
        { type: "player", role: "coached", x: 50, y: 42 },
        { type: "player", role: "coached", x: 51, y: 68 },
        { type: "player", role: "opposition", x: 109, y: 53 },
        { type: "ball", x: 50, y: 42 },
        { type: "arrow", d: "M53 43 C68 48, 84 52, 105 53", action: "ball" }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("the same red counter attacker receives the turnover; the nearest blue player presses and the second blue player recovers inside."),
      legend: ["activityArea", "centralProtectionZone", "turnoverBall", "compactRecoveryRun"],
      tokens: [
        { type: "zone", x: 30, y: 18, width: 100, height: 69, tone: "target" },
        { type: "zone", x: 70, y: 19, width: 20, height: 67, tone: "danger" },
        { type: "player", role: "opposition", x: 106, y: 53 },
        { type: "player", role: "coached", x: 91, y: 43 },
        { type: "player", role: "coached", x: 52, y: 69 },
        { type: "ball", x: 106, y: 53 },
        { type: "arrow", d: "M91 43 C96 47, 101 50, 106 53", action: "run" },
        { type: "arrow", d: "M52 69 C60 62, 67 56, 74 52", action: "run" }
      ]
    }
  ];
}

function buildCompactRecoveryTransitionPanels(): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("keep three blue recovery players and two red counter players visible around the ball-loss point and counter gates."),
      legend: ["activityArea", "centralProtectionZone", "counterGate", "turnoverBall"],
      tokens: [
        { type: "zone", x: 22, y: 16, width: 116, height: 73, tone: "target" },
        { type: "zone", x: 68, y: 17, width: 23, height: 71, tone: "danger" },
        { type: "gate", x: 136, y: 38, rotate: 90 },
        { type: "gate", x: 136, y: 70, rotate: 90 },
        { type: "player", role: "opposition", x: 89, y: 53 },
        { type: "player", role: "opposition", x: 113, y: 39 },
        { type: "player", role: "coached", x: 74, y: 43 },
        { type: "player", role: "coached", x: 66, y: 64 },
        { type: "player", role: "coached", x: 47, y: 74 },
        { type: "ball", x: 89, y: 53 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("the same red pair counters toward a gate while blue presses the ball, covers, recovers inside, communicates, and delays."),
      legend: ["activityArea", "centralProtectionZone", "counterGate", "turnoverBall", "compactRecoveryRun", "counterThreatLine"],
      tokens: [
        { type: "zone", x: 22, y: 16, width: 116, height: 73, tone: "target" },
        { type: "zone", x: 68, y: 17, width: 23, height: 71, tone: "danger" },
        { type: "gate", x: 136, y: 38, rotate: 90 },
        { type: "gate", x: 136, y: 70, rotate: 90 },
        { type: "player", role: "opposition", x: 90, y: 53 },
        { type: "player", role: "opposition", x: 115, y: 39 },
        { type: "player", role: "coached", x: 77, y: 44 },
        { type: "player", role: "coached", x: 69, y: 65 },
        { type: "player", role: "coached", x: 50, y: 74 },
        { type: "ball", x: 90, y: 53 },
        { type: "arrow", d: "M90 53 C100 47, 107 42, 115 39 C123 38, 130 38, 136 38", action: "counter" },
        { type: "arrow", d: "M77 44 C81 48, 85 51, 90 53", action: "run" },
        { type: "arrow", d: "M69 65 C73 60, 78 56, 83 54", action: "run" },
        { type: "arrow", d: "M50 74 C58 67, 64 61, 71 55", action: "run" }
      ]
    }
  ];
}

function buildCompactRecoveryProgressionPanels(): DiagramPanel[] {
  return [
    {
      title: "Setup",
      caption: inferredCaption("keep the same recovery group, then release a higher red counter runner beyond the recovery line toward the central danger lane."),
      legend: ["activityArea", "centralProtectionZone", "counterGate", "recoveryLine", "turnoverBall"],
      tokens: [
        { type: "zone", x: 18, y: 20, width: 124, height: 65, tone: "target" },
        { type: "zone", x: 91, y: 21, width: 23, height: 63, tone: "danger" },
        { type: "zone", x: 53, y: 21, width: 2, height: 63, tone: "line" },
        { type: "gate", x: 140, y: 53, rotate: 90 },
        { type: "player", role: "opposition", x: 78, y: 61 },
        { type: "player", role: "opposition", x: 116, y: 40 },
        { type: "player", role: "coached", x: 66, y: 50 },
        { type: "player", role: "coached", x: 59, y: 72 },
        { type: "player", role: "coached", x: 38, y: 36 },
        { type: "ball", x: 78, y: 61 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption("the released red counter runner attacks the target while the same blue group presses, covers, and recovers inside before the orange lane opens."),
      legend: ["activityArea", "centralProtectionZone", "counterGate", "recoveryLine", "turnoverBall", "compactRecoveryRun", "counterThreatLine"],
      tokens: [
        { type: "zone", x: 18, y: 20, width: 124, height: 65, tone: "target" },
        { type: "zone", x: 91, y: 21, width: 23, height: 63, tone: "danger" },
        { type: "zone", x: 53, y: 21, width: 2, height: 63, tone: "line" },
        { type: "gate", x: 140, y: 53, rotate: 90 },
        { type: "player", role: "opposition", x: 80, y: 61 },
        { type: "player", role: "opposition", x: 118, y: 40 },
        { type: "player", role: "coached", x: 69, y: 53 },
        { type: "player", role: "coached", x: 64, y: 74 },
        { type: "player", role: "coached", x: 41, y: 35 },
        { type: "ball", x: 80, y: 61 },
        { type: "arrow", d: "M80 61 C95 52, 106 44, 118 40 C126 42, 133 47, 140 53", action: "counter" },
        { type: "arrow", d: "M69 53 C73 56, 76 59, 80 61", action: "run" },
        { type: "arrow", d: "M64 74 C72 68, 81 62, 92 56", action: "run" },
        { type: "arrow", d: "M41 35 C52 41, 64 47, 75 54", action: "run" }
      ]
    }
  ];
}

function buildGenericPanels(kind: DiagramKind): DiagramPanel[] {
  const isProgression = kind === "recover_delay_win" || kind === "transition_to_attack";

  return [
    {
      title: "Setup",
      caption: inferredCaption("use a compact game space with teams, gates, and the ball location clearly visible."),
      legend: ["coachedPlayer", "oppositionPlayer", "ball", "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 24, y: 16, width: 112, height: 73, tone: isProgression ? "pressure" : "target" },
        { type: "gate", x: 136, y: 34, rotate: 90 },
        { type: "gate", x: 136, y: 72, rotate: 90 },
        { type: "player", role: "coached", x: 50, y: 35 },
        { type: "player", role: "coached", x: 55, y: 70 },
        { type: "player", role: "opposition", x: 94, y: 39 },
        { type: "player", role: "opposition", x: 101, y: 70 },
        { type: "ball", x: 50, y: 35 }
      ]
    },
    {
      title: "Action",
      caption: inferredCaption(
        isProgression
          ? "after the regain, first pass and support run point the counter toward the scoring target."
          : "pressure arrives, the support run opens, and the ball moves toward the scoring target."
      ),
      legend: ["coachedPlayer", "oppositionPlayer", "ballAction", "coachedRun", "defenderPressure", "coneGate", "zone"],
      tokens: [
        { type: "zone", x: 24, y: 16, width: 112, height: 73, tone: isProgression ? "pressure" : "target" },
        { type: "gate", x: 136, y: 34, rotate: 90 },
        { type: "player", role: "coached", x: 68, y: 47 },
        { type: "player", role: "coached", x: 82, y: 75 },
        { type: "player", role: "opposition", x: 91, y: 42 },
        { type: "player", role: "opposition", x: 103, y: 65 },
        { type: "ball", x: 68, y: 47 },
        { type: "arrow", d: "M70 47 C88 41, 111 36, 136 34", action: "ball" },
        { type: "arrow", d: "M82 75 C93 62, 108 48, 124 39", action: "run" },
        { type: "arrow", d: "M91 42 C83 43, 76 45, 70 47", action: "pressure" }
      ]
    },
    {
      title: "Score / Reset",
      caption: inferredCaption("score through the target, then reset the ball and team shape for the next repetition."),
      legend: ["coachedPlayer", "oppositionPlayer", "ballAction", "rotationReset", "coneGate"],
      tokens: [
        { type: "gate", x: 136, y: 34, rotate: 90 },
        { type: "player", role: "coached", x: 118, y: 37 },
        { type: "player", role: "coached", x: 90, y: 72 },
        { type: "player", role: "opposition", x: 103, y: 53 },
        { type: "ball", x: 118, y: 37 },
        { type: "arrow", d: "M119 37 C126 36, 131 35, 136 34", action: "ball" },
        { type: "arrow", d: "M117 50 C90 89, 45 80, 50 39", action: "rotation", label: "Reset" }
      ]
    }
  ];
}

function learningPanels(panels: DiagramPanel[]) {
  return panels.slice(0, 2);
}

function buildDiagramPanels(kind: DiagramKind, activityIndex: number): DiagramPanel[] {
  if (kind === "attacking_overload") {
    return learningPanels(buildAttackingOverloadPanels(activityIndex));
  }

  if (kind === "defending_1v1") {
    return learningPanels(buildDefending1v1Panels());
  }

  if (kind === "first_touch_pressure") {
    return learningPanels(buildFirstTouchPanels());
  }

  if (kind === "directional_possession") {
    return learningPanels(buildPossessionPanels(false));
  }

  if (kind === "mini_goal_possession") {
    return learningPanels(buildPossessionPanels(true));
  }

  if (kind === "pugg_goal_finishing") {
    return learningPanels(buildPuggFinishingPanels());
  }

  if (kind === "activation_chase_or_reaction") {
    return learningPanels(buildActivationPanels());
  }

  if (kind === "reaction_chase_escape") {
    return learningPanels(buildReactionChasePanels(false));
  }

  if (kind === "reaction_chase_progression") {
    return learningPanels(buildReactionChasePanels(true));
  }

  if (kind === "compact_recovery_activation") {
    return learningPanels(buildCompactRecoveryActivationPanels());
  }

  if (kind === "compact_recovery_transition") {
    return learningPanels(buildCompactRecoveryTransitionPanels());
  }

  if (kind === "compact_recovery_progression") {
    return learningPanels(buildCompactRecoveryProgressionPanels());
  }

  return learningPanels(buildGenericPanels(kind));
}

function FieldArea({ children }: { children: React.ReactNode }) {
  return (
    <>
      <rect x="6" y="6" width="148" height="93" rx="7" fill="#f8fafc" stroke="#cbd5e1" />
      <line x1="80" y1="6" x2="80" y2="99" stroke="#e2e8f0" strokeDasharray="3 3" />
      <circle cx="80" cy="52.5" r="13" fill="none" stroke="#e2e8f0" />
      {children}
    </>
  );
}

function PlayerToken({ x, y, role }: { x: number; y: number; role: PlayerRole; label?: string }) {
  const fill = role === "coached" ? "#2563eb" : role === "opposition" ? "#ef4444" : "#94a3b8";

  return (
    <g>
      <circle cx={x} cy={y} r="4.8" fill={fill} stroke="white" strokeWidth="1.5" />
      <circle cx={x} cy={y - 1.35} r="1.15" fill="white" opacity="0.9" />
      <path
        d={`M${x - 2.45} ${y + 1.35} C${x - 1.2} ${y + 2.45}, ${x + 1.2} ${y + 2.45}, ${x + 2.45} ${y + 1.35}`}
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="0.8"
        opacity="0.9"
      />
    </g>
  );
}

function BallToken({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.7" fill="white" stroke="#0f172a" strokeWidth="1" />
      <circle cx={x} cy={y} r="1" fill="#0f172a" />
      <path
        d={`M${x - 2.2} ${y - 1.3} L${x - 3.1} ${y - 2.8} M${x + 2.2} ${y - 1.3} L${x + 3.1} ${y - 2.8} M${x - 2.2} ${y + 1.4} L${x - 3.1} ${y + 2.8} M${x + 2.2} ${y + 1.4} L${x + 3.1} ${y + 2.8}`}
        fill="none"
        stroke="#0f172a"
        strokeLinecap="round"
        strokeWidth="0.55"
      />
    </g>
  );
}

function ConeToken({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y - 4.2} L${x - 4.5} ${y + 4.2} H${x + 4.5} Z`}
      fill="#facc15"
      stroke="#ca8a04"
      strokeLinejoin="round"
      strokeWidth="0.7"
    />
  );
}

function ConeGate({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <circle cx="-6" cy="0" r="2.8" fill="#facc15" stroke="#ca8a04" strokeWidth="0.7" />
      <circle cx="6" cy="0" r="2.8" fill="#facc15" stroke="#ca8a04" strokeWidth="0.7" />
      <line x1="-3.2" y1="0" x2="3.2" y2="0" stroke="#ca8a04" strokeWidth="1.1" strokeDasharray="2 2" />
    </g>
  );
}

function MiniGoal({ x, y, rotate = 0, pugg = false }: { x: number; y: number; rotate?: number; pugg?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x="-9" y="-7" width="18" height="14" rx="1.5" fill="white" stroke="#334155" strokeWidth="1.2" />
      <path d="M-6 -5 V5 M0 -5 V5 M6 -5 V5" stroke="#cbd5e1" strokeWidth="0.6" />
      {pugg ? (
        <g transform="translate(0 10)">
          <rect x="-8" y="-4.2" width="16" height="8.4" rx="2" fill="#0f172a" />
        </g>
      ) : null}
    </g>
  );
}

function ZoneBox({
  x,
  y,
  width,
  height,
  tone = "target"
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  tone?: "wide" | "target" | "pressure" | "finish" | "recovery" | "danger" | "line";
}) {
  const fill =
    tone === "wide"
      ? "#dbeafe"
      : tone === "pressure"
        ? "#fee2e2"
        : tone === "finish"
          ? "#dcfce7"
          : tone === "recovery" || tone === "danger"
            ? "#fef3c7"
            : "#f1f5f9";
  const stroke =
    tone === "wide"
      ? "#60a5fa"
      : tone === "pressure"
        ? "#f87171"
        : tone === "finish"
          ? "#22c55e"
          : tone === "recovery" || tone === "danger"
            ? "#f59e0b"
            : "#94a3b8";

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="5" fill={fill} fillOpacity="0.56" stroke={stroke} strokeDasharray="4 3" />
    </g>
  );
}

function ArrowPath({
  d,
  action,
  markerBaseId
}: {
  d: string;
  action: ArrowAction;
  markerBaseId: string;
}) {
  const color =
    action === "pressure" || action === "counter" ? "#ef4444" : action === "rotation" ? "#64748b" : "#2563eb";
  const dash = action === "pressure" || action === "run" ? "6 4" : action === "carry" ? "0.1 3.5" : undefined;
  const markerSuffix = action === "pressure" || action === "counter" ? "red" : action === "rotation" ? "slate" : "blue";

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={action === "rotation" ? "1.1" : "1.3"}
      strokeDasharray={dash}
      strokeLinecap="round"
      markerEnd={`url(#${markerBaseId}-${markerSuffix})`}
    />
  );
}

function renderToken(token: DiagramToken, markerBaseId: string) {
  if (token.type === "zone") {
    return <ZoneBox key={`zone-${token.x}-${token.y}`} {...token} />;
  }

  if (token.type === "player") {
    return <PlayerToken key={`player-${token.role}-${token.x}-${token.y}`} {...token} />;
  }

  if (token.type === "ball") {
    return <BallToken key={`ball-${token.x}-${token.y}`} x={token.x} y={token.y} />;
  }

  if (token.type === "cone") {
    return (
      <g key={`cone-${token.x}-${token.y}`}>
        <ConeToken x={token.x} y={token.y} />
      </g>
    );
  }

  if (token.type === "gate") {
    return (
      <g key={`gate-${token.x}-${token.y}`}>
        <ConeGate x={token.x} y={token.y} rotate={token.rotate} />
      </g>
    );
  }

  if (token.type === "miniGoal") {
    return (
      <g key={`goal-${token.x}-${token.y}-${token.pugg ? "pugg" : "mini"}`}>
        <MiniGoal x={token.x} y={token.y} rotate={token.rotate} pugg={token.pugg} />
      </g>
    );
  }

  if (token.type === "label") {
    return null;
  }

  return (
    <g key={`arrow-${token.d}-${token.action}`}>
      <ArrowPath d={token.d} action={token.action} markerBaseId={markerBaseId} />
    </g>
  );
}

function DiagramMarkers({ markerBaseId }: { markerBaseId: string }) {
  return (
    <defs>
      <marker id={`${markerBaseId}-blue`} markerWidth="6" markerHeight="6" refX="5.4" refY="3" orient="auto">
        <path d="M0,1 L5.5,3 L0,5 Z" fill="#2563eb" />
      </marker>
      <marker id={`${markerBaseId}-red`} markerWidth="6" markerHeight="6" refX="5.4" refY="3" orient="auto">
        <path d="M0,1 L5.5,3 L0,5 Z" fill="#ef4444" />
      </marker>
      <marker id={`${markerBaseId}-slate`} markerWidth="6" markerHeight="6" refX="5.4" refY="3" orient="auto">
        <path d="M0,1 L5.5,3 L0,5 Z" fill="#64748b" />
      </marker>
    </defs>
  );
}

function DiagramBoard({
  panel,
  markerBaseId,
  size
}: {
  panel: DiagramPanel;
  markerBaseId: string;
  size: "compact" | "large";
}) {
  const isLarge = size === "large";

  return (
    <svg
      viewBox="0 0 160 105"
      role="img"
      aria-label={`${panel.title}: ${panel.caption}`}
      className={["h-full w-full", isLarge ? "min-h-72" : "min-h-40"].join(" ")}
    >
      <DiagramMarkers markerBaseId={markerBaseId} />
      <FieldArea>{panel.tokens.map((token) => renderToken(token, markerBaseId))}</FieldArea>
    </svg>
  );
}

function LegendSymbol({ item }: { item: LegendKey }) {
  if (item === "coachedPlayer") {
    return <PlayerLegendSymbol fill="#2563eb" />;
  }

  if (item === "oppositionPlayer") {
    return <PlayerLegendSymbol fill="#ef4444" />;
  }

  if (item === "neutralPlayer" || item === "freePlayer") {
    return <PlayerLegendSymbol fill="#94a3b8" />;
  }

  if (item === "ball" || item === "turnoverBall") {
    return <span className="h-2.5 w-2.5 rounded-full border border-slate-900 bg-white" />;
  }

  if (item === "cone") {
    return (
      <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5">
        <path d="M7 2 L3 12 H11 Z" fill="#facc15" stroke="#ca8a04" strokeLinejoin="round" strokeWidth="1" />
      </svg>
    );
  }

  if (item === "coneGate" || item === "targetGate" || item === "counterGate") {
    return (
      <span className="inline-flex items-center gap-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 ring-1 ring-yellow-600" />
        <span className="h-px w-3 bg-yellow-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 ring-1 ring-yellow-600" />
      </span>
    );
  }

  if (item === "miniGoal" || item === "puggGoal") {
    return (
      <span className="inline-flex h-3.5 min-w-5 items-center justify-center rounded-sm border border-slate-600 bg-white px-0.5 text-[7px] font-bold leading-none text-slate-800">
        {item === "puggGoal" ? "P" : ""}
      </span>
    );
  }

  if (item === "activityArea" || item === "wideChannel" || item === "zone") {
    return item === "wideChannel"
      ? <span className="h-3 w-5 rounded-sm border border-dashed border-blue-400 bg-blue-50" />
      : <span className="h-3 w-5 rounded-sm border border-dashed border-slate-400 bg-slate-100" />;
  }

  if (item === "centralProtectionZone") {
    return <span className="h-3 w-5 rounded-sm border border-dashed border-amber-500 bg-amber-100" />;
  }

  if (item === "recoveryLine") {
    return <span className="h-4 w-px border-l border-dashed border-slate-400" />;
  }

  const color =
    item === "defenderPressure" || item === "defenderPressureLine" || item === "recoveryDefenderLine" || item === "counterThreatLine"
      ? "#ef4444"
      : item === "rotationReset"
        ? "#64748b"
        : "#2563eb";
  const dash =
    item === "defenderPressure" ||
    item === "coachedRun" ||
    item === "compactRecoveryRun" ||
    item === "defenderPressureLine" ||
    item === "supportRunLine" ||
    item === "recoveryDefenderLine"
      ? "6 4"
      : item === "dribbleCarry" || item === "attackerDribbleLine"
        ? "0.1 3.5"
        : undefined;
  const path = item === "rotationReset" ? "M4 10 C11 2, 22 2, 29 8" : "M2 7 H28";

  return (
    <svg viewBox="0 0 34 14" aria-hidden="true" className="h-3.5 w-10">
      <path d={path} fill="none" stroke={color} strokeDasharray={dash} strokeLinecap="round" strokeWidth="1.6" />
      <path d="M27 4 L32 7 L27 10" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
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

function PanelLegend({ keys, tokens }: { keys: LegendKey[]; tokens: DiagramToken[] }) {
  const orderedKeys = orderedLegendKeys(localLegendKeys(keys, tokens));

  if (orderedKeys.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-1.5 border-t border-slate-100 px-3 py-2 text-[11px] leading-4 text-slate-500 sm:grid-cols-2">
      {orderedKeys.map((item) => (
        <p key={item} className="flex items-center gap-2">
          <LegendSymbol item={item} />
          {LEGEND_META[item].label}
        </p>
      ))}
    </div>
  );
}

function PanelCard({
  panel,
  markerBaseId,
  size
}: {
  panel: DiagramPanel;
  markerBaseId: string;
  size: "compact" | "large";
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-3 py-2">
        <h6 className="text-xs font-semibold uppercase tracking-wide text-teal-800">{panel.title}</h6>
      </div>
      <div className={size === "large" ? "min-h-72" : "min-h-40"}>
        <DiagramBoard panel={panel} markerBaseId={markerBaseId} size={size} />
      </div>
      <p className="border-t border-slate-100 px-3 py-2 text-xs leading-5 text-slate-600">
        {shortenDiagramText(panel.caption, 120)}
      </p>
      <PanelLegend keys={panel.legend} tokens={panel.tokens} />
    </section>
  );
}

function shortenDiagramText(value: string, maxLength = 96) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).replace(/\s+\S*$/, "").trim()}...`;
}

function extractFinalGameLine(description: string, label: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = description.match(
    new RegExp(`${escapedLabel}:\\s*([\\s\\S]*?)(?=\\s(?:Format|Teams|Scoring|Constraint|Win condition|Focus|Run):|$)`, "i")
  );

  return match?.[1]?.trim() || "";
}

function FinalGameGridVisual() {
  return (
    <svg viewBox="0 0 160 105" role="img" aria-label="Tournament grid with four scoring gates" className="h-full min-h-40 w-full">
      <DiagramMarkers markerBaseId="club-vivo-final-card" />
      <FieldArea>
        <rect x="24" y="18" width="112" height="69" rx="5" fill="#dcfce7" fillOpacity="0.5" stroke="#22c55e" strokeDasharray="4 3" />
        <ConeGate x={31} y={29} />
        <ConeGate x={129} y={29} />
        <ConeGate x={31} y={77} />
        <ConeGate x={129} y={77} />
        <PlayerToken role="coached" x={58} y={39} />
        <PlayerToken role="coached" x={58} y={66} />
        <PlayerToken role="coached" x={76} y={53} />
        <PlayerToken role="opposition" x={101} y={39} />
        <PlayerToken role="opposition" x={101} y={66} />
        <PlayerToken role="opposition" x={86} y={53} />
        <BallToken x={78} y={53} />
        <ArrowPath d="M80 53 C92 45, 109 35, 128 29" action="carry" markerBaseId="club-vivo-final-card" />
      </FieldArea>
    </svg>
  );
}

function CompactRecoveryFinalGameVisual() {
  return (
    <svg viewBox="0 0 160 105" role="img" aria-label="Directional compact recovery final game grid" className="h-full min-h-40 w-full">
      <DiagramMarkers markerBaseId="club-vivo-compact-recovery-final-card" />
      <FieldArea>
        <rect x="23" y="18" width="114" height="69" rx="5" fill="#f1f5f9" fillOpacity="0.62" stroke="#94a3b8" strokeDasharray="4 3" />
        <rect x="68" y="18" width="25" height="69" rx="5" fill="#fef3c7" fillOpacity="0.52" stroke="#f59e0b" strokeDasharray="4 3" />
        <ConeGate x={28} y={36} rotate={90} />
        <ConeGate x={28} y={70} rotate={90} />
        <ConeGate x={132} y={36} rotate={90} />
        <ConeGate x={132} y={70} rotate={90} />
        <PlayerToken role="opposition" x={88} y={53} />
        <PlayerToken role="opposition" x={111} y={58} />
        <PlayerToken role="opposition" x={108} y={35} />
        <PlayerToken role="coached" x={73} y={44} />
        <PlayerToken role="coached" x={65} y={65} />
        <PlayerToken role="coached" x={51} y={73} />
        <BallToken x={88} y={53} />
        <ArrowPath d="M73 44 C78 47, 83 50, 88 53" action="run" markerBaseId="club-vivo-compact-recovery-final-card" />
        <ArrowPath d="M65 65 C71 61, 76 57, 81 54" action="run" markerBaseId="club-vivo-compact-recovery-final-card" />
        <ArrowPath d="M51 73 C58 67, 65 60, 71 54" action="run" markerBaseId="club-vivo-compact-recovery-final-card" />
        <ArrowPath d="M88 53 C102 48, 117 41, 132 36" action="counter" markerBaseId="club-vivo-compact-recovery-final-card" />
      </FieldArea>
    </svg>
  );
}

function CompactRecoveryFinalGameLegend() {
  const keys: LegendKey[] = ["centralProtectionZone", "counterGate", "compactRecoveryRun", "counterThreatLine"];

  return (
    <div className="grid gap-1.5 border-t border-teal-100 bg-white/70 px-3 py-2 text-[11px] leading-4 text-slate-500 sm:grid-cols-2">
      {keys.map((item) => (
        <p key={item} className="flex items-center gap-2">
          <LegendSymbol item={item} />
          {LEGEND_META[item].label}
        </p>
      ))}
    </div>
  );
}

function FinalGameFormatCard({ activity }: { activity?: DiagramActivity }) {
  const description = activity?.description?.trim() ||
    "Format: small-sided gate battle with fast restarts. Teams: balanced blue and red teams. Scoring: bonus for finding a wide player or support run before scoring. Constraint: the overload must create the chance. Win condition: first to three, then winner stays on or quick rematch. Focus: compete and let the game flow.";
  const isEscapeGatesTournament = /escape gates mini tournament/i.test(activity?.name || "");
  const isCompactRecoveryFinalGame = /compact recovery final game/i.test(activity?.name || "");
  const rulesScoringText = isCompactRecoveryFinalGame
    ? "When possession is lost, react in the first three seconds: press the ball, recover inside, communicate, protect the middle, and delay the counter."
    : isEscapeGatesTournament
    ? "Score by escaping pressure and playing or dribbling through any open gate."
    : extractFinalGameLine(description, "Scoring") || "Score through any open gate.";
  const bonusText = isCompactRecoveryFinalGame
    ? "Bonus point if the team regains once support arrives."
    : isEscapeGatesTournament
    ? "Bonus point if the team uses support before scoring."
    : "Add one bonus point when the session focus creates the chance.";
  const winnerRuleText = isCompactRecoveryFinalGame
    ? "First team to three goals wins, or most goals after five minutes."
    : isEscapeGatesTournament
    ? "First team to three goals wins, or most goals after five minutes."
    : extractFinalGameLine(description, "Win condition") || "First team to three goals; winner stays on or reset for a quick rematch.";
  const rows = [
    ["Rules / scoring", rulesScoringText],
    ["Bonus + winner rule", `${bonusText} ${winnerRuleText}`]
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/50">
      <div className="border-b border-teal-100 bg-white/75 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          Competitive close
        </p>
        <h5 className="mt-1 text-sm font-semibold text-slate-900">
          {activity?.name || "Escape Gates Mini Tournament"}
        </h5>
      </div>
      {isCompactRecoveryFinalGame ? <CompactRecoveryFinalGameVisual /> : <FinalGameGridVisual />}
      {isCompactRecoveryFinalGame ? <CompactRecoveryFinalGameLegend /> : null}
      <dl className="grid gap-2 border-t border-teal-100 p-3">
        {rows.map(([label, text]) => (
          <div key={label} className="rounded-xl border border-teal-100 bg-white/80 px-3 py-2">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-teal-800">
              {label}
            </dt>
            <dd className="mt-1 text-xs leading-5 text-slate-600">{shortenDiagramText(text, 220)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ActivityDiagramCanvas({
  activity,
  activityIndex,
  totalActivities = 1,
  size = "compact"
}: {
  activity?: DiagramActivity;
  activityIndex: number;
  totalActivities?: number;
  size?: "compact" | "large";
}) {
  const id = useId().replace(/:/g, "");
  const kind = inferDiagramKind(activity, activityIndex, totalActivities);

  if (kind === "final_game_format") {
    return <FinalGameFormatCard activity={activity} />;
  }

  const panels = buildDiagramPanels(kind, activityIndex);

  return (
    <div className="grid gap-3">
      {panels.map((panel, index) => (
        <PanelCard
          key={`${panel.title}-${index}`}
          panel={panel}
          markerBaseId={`club-vivo-diagram-arrow-${id}-${index}`}
          size={size}
        />
      ))}
    </div>
  );
}

export function DiagramPlaceholder({
  activity,
  activityIndex = 0,
  totalActivities = 1
}: {
  activity?: DiagramActivity;
  activityIndex?: number;
  totalActivities?: number;
}) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const kind = inferDiagramKind(activity, activityIndex, totalActivities);
  const isFinalCard = kind === "final_game_format";
  const title = isFinalCard ? "Competitive close" : "Inferred activity diagram";

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsZoomOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen]);

  if (isFinalCard) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <FinalGameFormatCard activity={activity} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsZoomOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsZoomOpen(true);
          }
        }}
        className="block w-full rounded-xl text-left outline-none transition hover:bg-teal-50/20 focus-visible:ring-2 focus-visible:ring-teal-600"
        aria-label={`Open larger inferred activity diagram for ${activity?.name || "this activity"}`}
      >
        <ActivityDiagramCanvas
          activity={activity}
          activityIndex={activityIndex}
          totalActivities={totalActivities}
        />
      </div>

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6"
          role="presentation"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Larger inferred activity diagram for ${activity?.name || "this activity"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                  {title}
                </p>
                <h5 className="mt-1 text-base font-semibold text-slate-900">
                  {activity?.name || `Activity ${activityIndex + 1}`}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-lg leading-none text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                aria-label="Close larger inferred activity diagram"
              >
                &times;
              </button>
            </div>

            <ActivityDiagramCanvas
              activity={activity}
              activityIndex={activityIndex}
              totalActivities={totalActivities}
              size="large"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
