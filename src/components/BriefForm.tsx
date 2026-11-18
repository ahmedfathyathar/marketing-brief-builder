import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, ClipboardCheck } from "lucide-react";
import { Answers, SECTIONS, sectionErrors, Field, isFilled } from "../data/questions";
import { FieldShell, TextInput, TextArea, MultiSelect } from "./FormFields";

interface Props {
  step: number;
  maxStep: number;
  answers: Answers;
  onChange: (id: string, value: string | string[]) => void;
  onGoto: (step: number) => void;
  onNext: () => void;
  onBack: () => void;
  onReview: () => void;
}

export const REVIEW_STEP = SECTIONS.length;

export function Stepper({ step, maxStep, answers, onGoto, onReview, reviewActive }: {
  step: number; maxStep: number; answers: Answers; onGoto: (s: number) => void; onReview: () => void; reviewActive?: boolean;
}) {
  const mobileNav = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = mobileNav.current;
    const el = nav?.querySelector<HTMLElement>("[data-current]");
    if (nav && el) nav.scrollTo({ left: el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [step, reviewActive]);
  return (
    <>
    <nav ref={mobileNav} aria-label="خطوات الـ Brief (موبايل)" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden">
      {SECTIONS.map((s, i) => {
        const current = !reviewActive && i === step;
        const reachable = i <= maxStep;
        return (
          <button
            key={s.id}
            type="button"
            disabled={!reachable}
            onClick={() => onGoto(i)}
            data-current={current || undefined}
            className={[
              "shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition",
              current ? "border-primary bg-primary text-white" : reachable ? "border-line bg-white text-ink" : "border-line bg-white text-slate-400",
            ].join(" ")}
          >
            <span className="tabular-nums">{i + 1}.</span> {s.shortTitle}
          </button>
        );
      })}
      <button
        type="button"
        disabled={maxStep < REVIEW_STEP}
        onClick={onReview}
        data-current={reviewActive || undefined}
        className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${reviewActive ? "border-primary bg-primary text-white" : maxStep >= REVIEW_STEP ? "border-line bg-white text-ink" : "border-line bg-white text-slate-400"}`}
      >
        المراجعة
      </button>
    </nav>
    <nav aria-label="خطوات الـ Brief" className="card hidden p-3 lg:block">
      <ol className="flex flex-col gap-1">
        {SECTIONS.map((s, i) => {
          const current = !reviewActive && i === step;
          const reachable = i <= maxStep;
          const done = i < maxStep && sectionErrors(s, answers).length === 0;
          const filled = s.fields.filter((f) => isFilled(answers[f.id])).length;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onGoto(i)}
                aria-current={current ? "step" : undefined}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition",
                  current ? "bg-primary-50" : reachable ? "hover:bg-slate-50" : "cursor-not-allowed opacity-50",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums transition",
                    done ? "bg-success text-white" : current ? "bg-primary text-white" : "border border-line bg-white text-muted",
                  ].join(" ")}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className={`text-[14px] font-semibold ${current ? "text-primary-700" : "text-ink"}`}>{s.shortTitle}</span>
                  <span className="text-[12px] text-muted tabular-nums">{filled} من {s.fields.length} متجاوب</span>
                </span>
              </button>
            </li>
          );
        })}
        <li className="mt-1 border-t border-line pt-2">
          <button
            type="button"
            disabled={maxStep < REVIEW_STEP}
            onClick={onReview}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition",
              reviewActive ? "bg-primary-50" : maxStep >= REVIEW_STEP ? "hover:bg-slate-50" : "cursor-not-allowed opacity-50",
            ].join(" ")}
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${reviewActive ? "bg-primary text-white" : "border border-line bg-white text-muted"}`}>
              <ClipboardCheck className="h-4 w-4" />
            </span>
            <span className="text-[14px] font-semibold text-ink">المراجعة</span>
          </button>
        </li>
      </ol>
    </nav>
    </>
  );
}

export function ProgressHeader({ step, total, title }: { step: number; total: number; title: string }) {
  const pct = Math.round(((step + 1) / (total + 1)) * 100);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-semibold text-primary tabular-nums">
          {step < total ? `الخطوة ${step + 1} من ${total}` : "المراجعة النهائية"}
        </span>
        <span className="text-muted lg:hidden">{title}</span>
        <span className="hidden text-muted tabular-nums lg:inline">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function renderField(field: Field, answers: Answers, errors: string[], onChange: Props["onChange"]) {
  const err = errors.includes(field.id);
  const v = answers[field.id];
  switch (field.type) {
    case "text":
      return <TextInput field={field} value={(v as string) ?? ""} error={err} onChange={(x) => onChange(field.id, x)} />;
    case "textarea":
      return <TextArea field={field} value={(v as string) ?? ""} error={err} onChange={(x) => onChange(field.id, x)} />;
    case "multiselect":
    case "chips": {
      const arr = Array.isArray(v) ? v : [];
      const showOther = field.otherOption && arr.includes(field.otherOption);
      const otherId = field.id + "Other";
      return (
        <div className="flex flex-col gap-3">
          <MultiSelect field={field} value={arr} error={err} variant={field.type === "chips" ? "chips" : "cards"} onChange={(x) => onChange(field.id, x)} />
          {showOther && (
            <div className="animate-in flex flex-col gap-1.5">
              <input
                id={`f-${otherId}`}
                type="text"
                value={(answers[otherId] as string) ?? ""}
                onChange={(e) => onChange(otherId, e.target.value)}
                placeholder={field.otherPlaceholder ?? "اكتب إجابتك"}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] focus:outline-none focus:ring-4 ${errors.includes(otherId) ? "border-red-400 focus:ring-red-500/15" : "border-line focus:border-primary focus:ring-primary/15"}`}
              />
              {errors.includes(otherId) && <p className="text-[13px] font-medium text-red-600">اكتب إجابتك هنا عشان نكمل.</p>}
            </div>
          )}
        </div>
      );
    }
  }
}

export function BriefForm({ step, maxStep, answers, onChange, onGoto, onNext, onBack, onReview }: Props) {
  const section = SECTIONS[step];
  const [showErrors, setShowErrors] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const errors = showErrors ? sectionErrors(section, answers) : [];

  useEffect(() => {
    setShowErrors(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const handleNext = () => {
    const errs = sectionErrors(section, answers);
    if (errs.length) {
      setShowErrors(true);
      const first = document.getElementById(`f-${errs[0]}`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (first && "focus" in first) (first as HTMLElement).focus({ preventScroll: true });
      return;
    }
    onNext();
  };

  const isLast = step === SECTIONS.length - 1;

  return (
    <div ref={topRef} className="grid scroll-mt-24 grid-cols-1 gap-6 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Stepper step={step} maxStep={maxStep} answers={answers} onGoto={onGoto} onReview={onReview} />
      </aside>

      <div className="flex min-w-0 flex-col gap-5">
        <ProgressHeader step={step} total={SECTIONS.length} title={section.shortTitle} />

        <form
          key={section.id}
          noValidate
          onSubmit={(e) => { e.preventDefault(); handleNext(); }}
          className="card animate-in flex flex-col"
        >
          <header className="flex flex-col gap-2 border-b border-line p-5 sm:p-8">
            <h2 className="text-balance text-[1.5rem] font-bold text-ink">{section.title}</h2>
            <p className="text-[15px] leading-7 text-muted">{section.description}</p>
            <p className="mt-2 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[13px] leading-6 text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {section.why}
            </p>
          </header>

          <div className="flex flex-col gap-8 p-5 sm:p-8">
            {section.fields.map((f) => (
              <FieldShell key={f.id} field={f} error={errors.includes(f.id)}>
                {renderField(f, answers, errors, onChange)}
              </FieldShell>
            ))}
          </div>

          <footer className="mobile-bar flex items-center justify-between gap-3 rounded-b-2xl border-t border-line p-4 sm:px-8">
            <button type="button" onClick={onBack} className="btn-ghost">
              <ArrowRight className="h-5 w-5" /> رجوع
            </button>
            {showErrors && errors.length > 0 && (
              <span className="hidden text-[13px] font-medium text-red-600 sm:inline">فيه {errors.length} سؤال مطلوب لسه فاضي</span>
            )}
            <button type="submit" className="btn-primary flex-1 justify-center sm:flex-none">
              {isLast ? "راجع الـ Brief" : "كمّل"} <ArrowLeft className="h-5 w-5" />
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
