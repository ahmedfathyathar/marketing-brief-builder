import { TOTAL_QUESTIONS } from "../data/questions";
import { ArrowLeft, Target, LayoutTemplate, PenLine, Sparkles, Clock, ListChecks, ShieldCheck } from "lucide-react";

interface Props {
  hasProgress: boolean;
  onStart: () => void;
  onContinue: () => void;
  onSample: () => void;
}

export const FEATURE_CARDS = [
  {
    icon: Target,
    title: "Marketing Strategy & Action Plan",
    desc: "تحليل للجمهور والمنافسين، Positioning واضح، وخطة تنفيذ لمدة 30 يوم.",
    meta: "15 قسم",
  },
  {
    icon: LayoutTemplate,
    title: "Landing Page Prompt",
    desc: "صفحة كاملة من الـ Hero لحد الـ Final CTA، مكتوبة عشان تحوّل الزوار لعملاء.",
    meta: "13 قسم",
  },
  {
    icon: PenLine,
    title: "Sales Copywriting Prompt",
    desc: "زوايا بيع، Hooks، إعلانات وCaptions مبنية على مشاكل الجمهور واعتراضاته.",
    meta: "+50 Copy",
  },
];

export function Welcome({ hasProgress, onStart, onContinue, onSample }: Props) {
  return (
    <div className="animate-in mx-auto flex max-w-5xl flex-col gap-12 py-10 sm:py-16">
      <section className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted">
          <Sparkles className="h-4 w-4 text-primary" />
          Marketing Brief Builder
        </span>
        <h1 className="max-w-3xl text-balance text-[2rem] font-bold leading-[1.35] text-ink sm:text-[2.75rem]">
          حوّل معلومات البزنس بتاعك إلى خطة تسويقية <span className="text-primary">ومحتوى يبيع.</span>
        </h1>
        <p className="max-w-2xl text-[17px] leading-8 text-muted">
          جاوب على مجموعة من الأسئلة عن البزنس والمنتج والجمهور المستهدف، وفي النهاية هتقدر تطلع Prompts جاهزة تساعدك تبني Marketing Strategy، Landing Page، وSales Copy باستخدام الـ AI.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {hasProgress ? (
            <>
              <button id="btn-continue" onClick={onContinue} className="btn-primary">
                كمّل من حيث وقفت <ArrowLeft className="h-5 w-5" />
              </button>
              <button id="btn-start" onClick={onStart} className="btn-ghost">
                ابدأ بناء الـ Marketing Brief
              </button>
            </>
          ) : (
            <button id="btn-start" onClick={onStart} className="btn-primary">
              ابدأ بناء الـ Marketing Brief <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <button id="btn-sample" onClick={onSample} className="text-[14px] font-medium text-muted underline decoration-line decoration-2 underline-offset-8 transition hover:text-primary hover:decoration-primary">
            جرّب بمثال جاهز
          </button>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[13px] text-muted">
          <li className="flex items-center gap-1.5"><ListChecks className="h-4 w-4" /> 5 خطوات · {TOTAL_QUESTIONS} سؤال</li>
          <li className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> حوالي 10–15 دقيقة</li>
          <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> إجاباتك بتتحفظ على جهازك بس</li>
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {FEATURE_CARDS.map((c, i) => (
          <article key={c.title} className="card flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: `${80 * i}ms` }}>
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-muted">{c.meta}</span>
            </div>
            <h3 dir="ltr" className="text-end text-[17px] font-semibold text-ink">{c.title}</h3>
            <p className="text-[14px] leading-7 text-muted">{c.desc}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
