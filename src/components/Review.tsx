import { ArrowRight, Pencil, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Answers, Section, isFilled, sectionErrors, answerText } from "../data/questions";
import { Stepper, ProgressHeader } from "./BriefForm";

interface Props {
  sections: Section[];
  answers: Answers;
  maxStep: number;
  onEdit: (step: number) => void;
  onBack: () => void;
  onGenerate: () => void;
}

function display(answers: Answers, id: string): string {
  return answerText(answers, id);
}

export function Review({ sections, answers, maxStep, onEdit, onBack, onGenerate }: Props) {
  const REVIEW_STEP = sections.length;
  const total = sections.reduce((n, s) => n + s.fields.length, 0);
  const filled = sections.reduce((n, s) => n + s.fields.filter((f) => isFilled(answers[f.id])).length, 0);
  const blocking = sections.map((s, i) => ({ i, s, errs: sectionErrors(s, answers) })).filter((x) => x.errs.length);
  const emptyOptional = total - filled;

  return (
    <div className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Stepper sections={sections} step={REVIEW_STEP} maxStep={maxStep} answers={answers} onGoto={onEdit} onReview={() => {}} reviewActive />
      </aside>

      <div className="flex min-w-0 flex-col gap-5">
        <ProgressHeader step={REVIEW_STEP} total={sections.length} title="المراجعة" />

        <header className="flex flex-col gap-2 pt-2">
          <h2 className="text-[1.6rem] font-bold text-ink">راجع الـ Marketing Brief بتاعك</h2>
          <p className="text-[15px] leading-7 text-muted">
            اتأكد إن كل حاجة مظبوطة قبل ما نطلع الـ Prompts. تقدر تعدّل أي قسم وترجع هنا تاني.
          </p>
        </header>

        <div className="card flex flex-wrap items-center gap-x-6 gap-y-3 p-4 text-[14px]">
          <span className="flex items-center gap-2 font-semibold text-ink tabular-nums">
            <CheckCircle2 className="h-5 w-5 text-success" /> {filled} من {total} سؤال متجاوب
          </span>
          {emptyOptional > 0 && (
            <span className="text-muted">
              الأسئلة الفاضية ({emptyOptional}) هتتعلّم في الـ Prompts كمعلومات ناقصة، والـ AI هيتطلب منه يحددها بدل ما يخترعها.
            </span>
          )}
        </div>

        {blocking.length > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-[14px] text-amber-900" role="alert">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex flex-col gap-1">
              <strong>فيه أسئلة مطلوبة لسه فاضية:</strong>
              {blocking.map((b) => (
                <button key={b.s.id} onClick={() => onEdit(b.i)} className="w-fit font-medium underline underline-offset-4">
                  {b.s.title} ({b.errs.length})
                </button>
              ))}
            </div>
          </div>
        )}

        {sections.map((s, i) => (
          <section key={s.id} className="card overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-line bg-slate-50/70 px-4 py-3 sm:px-5 sm:py-3.5">
              <h3 className="flex items-center gap-3 text-[16px] font-semibold text-ink">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[13px] text-muted ring-1 ring-line tabular-nums">{i + 1}</span>
                {s.title}
              </h3>
              <button id={`edit-${s.id}`} onClick={() => onEdit(i)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-primary transition hover:bg-primary-50">
                <Pencil className="h-4 w-4" /> تعديل
              </button>
            </header>
            <dl className="divide-y divide-line">
              {s.fields.map((f) => {
                const val = display(answers, f.id);
                return (
                  <div key={f.id} className="grid grid-cols-1 gap-1 px-4 py-3.5 sm:px-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                    <dt className="text-[13px] font-medium leading-6 text-muted">{f.label}</dt>
                    <dd className="min-w-0 whitespace-pre-wrap break-words text-[14px] leading-7 text-ink" dir="auto">
                      {val ? val : (
                        <span className={f.required ? "font-medium text-red-600" : "text-slate-400"}>
                          {f.required ? "مطلوب — لسه فاضي" : "مش متوفر"}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}

        <div className="mobile-bar -mx-4 flex items-center justify-between gap-3 px-4 pt-3 sm:mx-0 sm:px-0 sm:pt-2">
          <button onClick={onBack} className="btn-ghost"><ArrowRight className="h-5 w-5" /> رجوع</button>
          <button id="btn-generate" onClick={onGenerate} disabled={blocking.length > 0} className="btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
            <Sparkles className="h-5 w-5" /> إنشاء الـ Prompts
          </button>
        </div>
      </div>
    </div>
  );
}
