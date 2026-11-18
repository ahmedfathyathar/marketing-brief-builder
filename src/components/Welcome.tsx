import { ArrowLeft, Type, Shapes, LayoutTemplate, PenLine, Sparkles, Clock, ShieldCheck, Check } from "lucide-react";
import { OutputKind, OUTPUT_ORDER, countQuestions, visibleSections } from "../data/questions";

interface Props {
  outputs: OutputKind[];
  hasProgress: boolean;
  onToggle: (k: OutputKind) => void;
  onStart: () => void;
  onContinue: () => void;
  onSample: () => void;
}

export const OUTPUT_CARDS: Record<OutputKind, { icon: typeof Type; title: string; desc: string; note?: string }> = {
  name: {
    icon: Type,
    title: "اسم للبراند",
    desc: "30 اقتراح اسم في 3 فئات، وأحسن 5 مترتبين بالأسباب.",
    note: "لو اخترت ده، مش هنسألك عن اسم البزنس.",
  },
  logo: {
    icon: Shapes,
    title: "لوجو",
    desc: "Prompt تحطه في أداة صور زي ChatGPT أو Gemini عشان تطلّع لوجو بسيط ومميز.",
  },
  landing: {
    icon: LayoutTemplate,
    title: "Landing Page",
    desc: "صفحة كاملة من الـ Hero لحد الـ Final CTA، مكتوبة عشان تحوّل الزوار لعملاء.",
  },
  copy: {
    icon: PenLine,
    title: "Sales Copy",
    desc: "زوايا بيع، Hooks، إعلانات وCaptions مبنية على مشاكل الجمهور واعتراضاته.",
  },
};

export function Welcome({ outputs, hasProgress, onToggle, onStart, onContinue, onSample }: Props) {
  const q = countQuestions(outputs);
  const steps = visibleSections(outputs).length;
  const minutes = Math.max(3, Math.round(q * 0.5));
  return (
    <div className="animate-in mx-auto flex max-w-5xl flex-col gap-10 py-10 sm:py-14">
      <section className="flex flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted">
          <Sparkles className="h-4 w-4 text-primary" />
          Marketing Brief Builder
        </span>
        <h1 className="max-w-3xl text-balance text-[2rem] font-bold leading-[1.35] text-ink sm:text-[2.6rem]">
          حوّل معلومات البزنس بتاعك إلى خطة تسويقية <span className="text-primary">ومحتوى يبيع.</span>
        </h1>
        <p className="max-w-2xl text-[17px] leading-8 text-muted">
          اختار إنت عايز تطلّع إيه، وجاوب على الأسئلة اللي تخصه بس. في الآخر هتاخد Prompts جاهزة تستخدمها مع Claude أو ChatGPT أو Gemini.
        </p>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="pick-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="pick-title" className="text-[18px] font-bold text-ink">عايز تطلّع إيه؟</h2>
          <span className="text-[13px] text-muted">تقدر تختار أكتر من حاجة</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OUTPUT_ORDER.map((k) => {
            const c = OUTPUT_CARDS[k];
            const on = outputs.includes(k);
            return (
              <button
                key={k}
                id={`pick-${k}`}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => onToggle(k)}
                className={[
                  "group flex items-start gap-4 rounded-2xl border bg-white p-5 text-start transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                  on ? "border-primary shadow-[0_0_0_1px_#2563EB]" : "border-line hover:border-slate-300 hover:shadow-sm",
                ].join(" ")}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${on ? "bg-primary text-white" : "bg-primary-50 text-primary"}`}>
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[16px] font-bold text-ink">{c.title}</span>
                  <span className="text-[14px] leading-7 text-muted">{c.desc}</span>
                  {c.note && <span className="text-[12px] font-medium text-primary-700">{c.note}</span>}
                </span>
                <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${on ? "border-primary bg-primary text-white" : "border-slate-300 bg-white"}`}>
                  {on && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mobile-bar -mx-4 flex flex-col gap-3 px-4 pt-3 sm:mx-0 sm:flex-row sm:items-center sm:px-0">
          {hasProgress ? (
            <>
              <button id="btn-continue" onClick={onContinue} disabled={!outputs.length} className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50">
                كمّل من حيث وقفت <ArrowLeft className="h-5 w-5" />
              </button>
              <button id="btn-start" onClick={onStart} disabled={!outputs.length} className="btn-ghost justify-center disabled:cursor-not-allowed disabled:opacity-50">
                ابدأ من أول سؤال
              </button>
            </>
          ) : (
            <button id="btn-start" onClick={onStart} disabled={!outputs.length} className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50">
              ابدأ بناء الـ Marketing Brief <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <p className="text-[13px] text-muted tabular-nums" aria-live="polite">
            {outputs.length ? `${q} سؤال في ${steps} خطوات · حوالي ${minutes} دقيقة` : "اختار حاجة واحدة على الأقل عشان تبدأ."}
          </p>
        </div>
      </section>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[13px] text-muted">
        <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> إجاباتك بتتحفظ أوتوماتيك على جهازك، ومش هتضيع لو عملت Refresh</li>
        <li className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> تقدر تقفل وترجع تكمّل في أي وقت</li>
        <li>
          <button id="btn-sample" onClick={onSample} className="font-medium text-muted underline decoration-line decoration-2 underline-offset-8 transition hover:text-primary hover:decoration-primary">
            جرّب بمثال جاهز
          </button>
        </li>
      </ul>
    </div>
  );
}
