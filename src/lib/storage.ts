import { Answers, SAMPLE_ANSWERS, OutputKind, OUTPUT_ORDER, visibleSections } from "../data/questions";
import type { OutputLang, PromptKind } from "./prompts";

export type Stage = "welcome" | "form" | "review" | "dashboard" | "prompt";

export interface AppState {
  stage: Stage;
  /** what the person wants to generate; decides which questions are asked */
  outputs: OutputKind[];
  step: number;
  maxStep: number;
  answers: Answers;
  lang: OutputLang;
  activePrompt: PromptKind | null;
  generated: Partial<Record<PromptKind, boolean>>;
  isDemo?: boolean;
  savedAt?: number;
}

const KEY = "marketing-brief-builder:v5";

/** Set at build time: the preview build opens on the filled demo, the public build opens on the picker. */
declare const __DEMO_DEFAULT__: boolean;
const DEMO_DEFAULT = typeof __DEMO_DEFAULT__ !== "undefined" && __DEMO_DEFAULT__;

export const INITIAL_STATE: AppState = {
  stage: "welcome", outputs: [], step: 0, maxStep: 0, answers: {}, lang: "ar-eg", activePrompt: null, generated: {},
};

/** The hypothetical "ركوة" brief with every output selected and every question answered. */
export function demoState(): AppState {
  const outputs = [...OUTPUT_ORDER];
  return {
    ...INITIAL_STATE, stage: "dashboard", outputs, maxStep: visibleSections(outputs).length, answers: { ...SAMPLE_ANSWERS }, isDemo: true,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEMO_DEFAULT ? demoState() : INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...INITIAL_STATE, ...parsed, answers: parsed.answers ?? {}, outputs: parsed.outputs ?? [] };
  } catch {
    return DEMO_DEFAULT ? demoState() : INITIAL_STATE;
  }
}

/** Saves on every change, so a refresh never loses typed answers. Returns false if the browser blocks storage. */
export function saveState(state: AppState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
