import { Answers, SAMPLE_ANSWERS, SECTIONS } from "../data/questions";
import type { OutputLang, PromptKind } from "./prompts";

export type Stage = "welcome" | "form" | "review" | "dashboard" | "prompt";

export interface AppState {
  stage: Stage;
  step: number;
  maxStep: number;
  answers: Answers;
  lang: OutputLang;
  activePrompt: PromptKind | null;
  generated: Partial<Record<PromptKind, boolean>>;
  isDemo?: boolean;
}

const KEY = "marketing-brief-builder:v3";

export const INITIAL_STATE: AppState = {
  stage: "welcome", step: 0, maxStep: 0, answers: {}, lang: "ar-eg", activePrompt: null, generated: {},
};

/** First visit opens on the dashboard with the hypothetical "ركوة" brief already filled in. */
export const DEMO_STATE: AppState = {
  ...INITIAL_STATE, stage: "dashboard", maxStep: SECTIONS.length, answers: { ...SAMPLE_ANSWERS }, isDemo: true,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEMO_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...INITIAL_STATE, ...parsed, answers: parsed.answers ?? {} };
  } catch {
    return DEMO_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: the app keeps working in memory */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
