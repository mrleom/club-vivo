import type { GenerateSessionPackInput, SessionPack } from "../session-builder-api";

export type GoldenTemplate = {
  id: string;
  lane: "quick_soccer_game" | "session_builder";
  version: 1;
  matches(input: GenerateSessionPackInput): boolean;
  build(input: GenerateSessionPackInput): SessionPack;
};
