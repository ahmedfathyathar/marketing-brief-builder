import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, RotateCcw, CheckCircle2, AlertCircle, X } from "lucide-react";
import { SECTIONS, SAMPLE_ANSWERS, isFilled } from "./data/questions";
import { AppState, loadState, saveState, clearState, INITIAL_STATE } from "./lib/storage";
import { Welcome } from "./components/Welcome";
import { BriefForm, REVIEW_STEP } from "./components/BriefForm";
import { Review } from "./components/Review";
import { Dashboard } from "./components/Dashboard";
import { PromptPanel } from "./components/PromptPanel";
import type { PromptKind } from "./lib/prompts";

interface Toast { id: number; msg: string; tone: "success" | "error" }

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const toastTimer = useRef<number>();

  useEffect(() => saveState(state), [state]);

  const update = useCallback((patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch })), []);

  const showToast = useCallback((msg: string, tone: "success" | "error" = "success") => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), msg, tone });
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const setAnswer = (id: string, value: string | string[]) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } }));

  const gotoStep = (step: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    update({ stage: "form", step });
  };

  const hasProgress = Object.values(state.answers).some((v) => isFilled(v as string | string[]));

  const go = {
    start: () => update({ stage: "form", step: 0 }),
    continue: () => {
      if (state.maxStep >= REVIEW_STEP) update({ stage: "review" });
      else update({ stage: "form", step: state.step });
    },
    sample: () => {
      setState((s) => ({ ...s, answers: { ...SAMPLE_ANSWERS }, stage: "dashboard", maxStep: REVIEW_STEP, step: 0, isDemo: true }));
      showToast("اتملى الـ Brief بمثال تجريبي (ركوة). عدّل أي حاجة براحتك.");
    },
    next: () => {
      const nextStep = state.step + 1;
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (nextStep >= SECTIONS.length) update({ stage: "review", maxStep: REVIEW_STEP });
      else update({ step: nextStep, maxStep: Math.max(state.maxStep, nextStep) });
    },
    back: () => {
      if (state.step === 0) update({ stage: "welcome" });
      else gotoStep(state.step - 1);
    },
    review: () => { window.scrollTo({ top: 0 }); update({ stage: "review" }); },
    generate: () => { window.scrollTo({ top: 0 }); update({ stage: "dashboard" }); },
    openPrompt: (k: PromptKind) =>
      setState((s) => ({ ...s, stage: "prompt", activePrompt: k, generated: { ...s.generated, [k]: true } })),
    dashboard: () => { window.scrollTo({ top: 0 }); update({ stage: "dashboard" }); },
    editBrief: () => { window.scrollTo({ top: 0 }); update({ stage: "review" }); },
    home: () => update({ stage: "welcome" }),
  };

  const doReset = () => {
    clearState();
    setState(INITIAL_STATE);
    setConfirmReset(false);
    showToast("اتمسحت كل الإجابات. تقدر تبدأ من الأول.");
  };

  return (
    <div className="min-h-full bg-canvas">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="gutter mx-auto flex h-16 max-w-6xl items-center justify-between gap-3">
          <button onClick={go.home} className="flex items-center gap-2.5" aria-label="الصفحة الرئيسية">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <FileText className="h-5 w-5" />
            </span>
            <span dir="ltr" className="text-[15px] font-bold text-ink">Marketing Brief Builder</span>
          </button>
          <div className="flex items-center gap-2">
            {hasProgress && (
              confirmReset ? (
                <div className="animate-in flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 py-1 pe-1 ps-3 text-[13px]">
                  <span className="hidden font-medium text-red-700 sm:inline">امسح كل الإجابات؟</span>
                  <button id="btn-reset-confirm" onClick={doReset} className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700">امسح</button>
                  <button onClick={() => setConfirmReset(false)} aria-label="إلغاء" className="rounded-lg p-1.5 text-red-700 hover:bg-red-100"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <button id="btn-reset" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-muted transition hover:bg-slate-100 hover:text-ink">
                  <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">ابدأ من جديد</span>
                </button>
              )
            )}
          </div>
        </div>
      </header>

      <main className="gutter mx-auto max-w-6xl pb-24">
        {state.stage === "welcome" && (
          <Welcome hasProgress={hasProgress} onStart={go.start} onContinue={go.continue} onSample={go.sample} />
        )}
        {state.stage === "form" && (
          <BriefForm
            step={state.step}
            maxStep={state.maxStep}
            answers={state.answers}
            onChange={setAnswer}
            onGoto={gotoStep}
            onNext={go.next}
            onBack={go.back}
            onReview={go.review}
          />
        )}
        {state.stage === "review" && (
          <Review answers={state.answers} maxStep={state.maxStep} onEdit={gotoStep} onBack={() => gotoStep(SECTIONS.length - 1)} onGenerate={go.generate} />
        )}
        {state.stage === "dashboard" && (
          <Dashboard answers={state.answers} generated={state.generated} onOpen={go.openPrompt} onEditBrief={go.editBrief} isDemo={state.isDemo} />
        )}
        {state.stage === "prompt" && state.activePrompt && (
          <PromptPanel
            kind={state.activePrompt}
            answers={state.answers}
            lang={state.lang}
            onLang={(lang) => update({ lang })}
            onBack={go.dashboard}
            onToast={showToast}
          />
        )}
      </main>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] sm:pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)]">
        {toast && (
          <div
            key={toast.id}
            className={`toast-in pointer-events-auto flex max-w-md items-center gap-2.5 rounded-xl px-4 py-3 text-[14px] font-medium text-white shadow-xl ${toast.tone === "success" ? "bg-ink" : "bg-red-600"}`}
          >
            {toast.tone === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}
