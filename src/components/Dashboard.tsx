import { Target, LayoutTemplate, PenLine, ArrowLeft, Pencil, CheckCircle2, FlaskConical } from "lucide-react";
import { Answers, TOTAL_QUESTIONS } from "../data/questions";
import { PromptKind, missingFields, PROMPT_META } from "../lib/prompts";

interface Props {
  answers: Answers;
  generated: Partial<Record<PromptKind, boolean>>;
  onOpen: (k: PromptKind) => void;
  onEditBrief: () => void;
  isDemo?: boolean;
}

const CARDS: {
  kind: PromptKind;
  icon: typeof Target;
  desc: string;
  button: string;
  includes: string[];
  tone: { icon: string; ring: string; btn: string; chip: string };
}[] = [
  {
    kind: "strategy",
    icon: Target,
    desc: "حوّل معلومات البزنس والمنتج والجمهور إلى استراتيجية تسويقية متكاملة وخطة تنفيذ واضحة.",
    button: "إنشاء Strategy Prompt",
    includes: ["Personas", "USP & Positioning", "Funnel", "Content Pillars", "خطة 30 يوم", "KPIs"],
    tone: { icon: "bg-primary text-white", ring: "hover:border-primary/40", btn: "btn-primary", chip: "bg-primary-50 text-primary-700" },
  },
  {
    kind: "landing",
    icon: LayoutTemplate,
    desc: "استخدم معلومات المنتج والجمهور لبناء Landing Page مصممة لتحويل الزوار إلى عملاء.",
    button: "إنشاء Landing Page Prompt",
    includes: ["Hero & CTA", "Pain Points", "How It Works", "Pricing", "FAQs", "Mobile-first"],
    tone: { icon: "bg-ink text-white", ring: "hover:border-slate-400", btn: "btn-dark", chip: "bg-slate-100 text-ink" },
  },
  {
    kind: "copy",
    icon: PenLine,
    desc: "أنشئ مجموعة من الـ Marketing Copies المبنية على احتياجات الجمهور ومشاكله ودوافع الشراء والاعتراضات.",
    button: "إنشاء Sales Copy Prompt",
    includes: ["10 Angles", "10 Hooks", "Ad Copies", "Captions", "AIDA · PAS · FAB · BAB", "Objections"],
    tone: { icon: "bg-success text-white", ring: "hover:border-success/40", btn: "btn-success", chip: "bg-green-50 text-green-800" },
  },
];

export function Dashboard({ answers, generated, onOpen, onEditBrief, isDemo }: Props) {
  const brand = ((answers.brandName as string) ?? "").trim();
  return (
    <div className="animate-in flex flex-col gap-8 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[13px] font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" /> {brand ? `Brief «${brand}» اكتمل` : "الـ Brief اكتمل"}
          </span>
          <h1 className="text-[1.9rem] font-bold text-ink sm:text-[2.25rem]">الـ Marketing Brief بتاعك جاهز!</h1>
          <p className="max-w-2xl text-[16px] leading-8 text-muted">استخدم المعلومات اللي دخلتها لإنشاء Prompts مخصصة تقدر تستخدمها مع أي AI Tool.</p>
        </div>
        <button id="btn-edit-brief" onClick={onEditBrief} className="btn-ghost">
          <Pencil className="h-4 w-4" /> عدّل الـ Brief
        </button>
      </header>

      {isDemo && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary-50 p-4 text-[14px] leading-7 text-ink">
          <FlaskConical className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <p>
            <strong className="font-semibold">ده Brief تجريبي لبزنس افتراضي: «ركوة»</strong>، اشتراك شهري في قهوة Specialty. كل الـ {TOTAL_QUESTIONS} سؤال متجاوبين.
            اختار الـ Prompt اللي عايزه تحت، أو اضغط «عدّل الـ Brief» عشان تشوف الإجابات وتغيّرها، أو «ابدأ من جديد» فوق عشان تدخل بيانات البزنس بتاعك.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {CARDS.map((c) => {
          const missing = missingFields(c.kind, answers).length;
          return (
            <article key={c.kind} className={`card group flex flex-col gap-5 p-5 sm:p-6 transition hover:-translate-y-0.5 hover:shadow-lg ${c.tone.ring}`}>
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.tone.icon}`}>
                  <c.icon className="h-6 w-6" />
                </span>
                {generated[c.kind] && (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" /> اتعمل قبل كده
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h2 dir="ltr" className="text-end text-[19px] font-bold text-ink">{PROMPT_META[c.kind].title}</h2>
                <p className="text-[14px] leading-7 text-muted">{c.desc}</p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {c.includes.map((x) => (
                  <li key={x} dir="auto" className={`rounded-md px-2 py-1 text-[12px] font-medium ${c.tone.chip}`}>{x}</li>
                ))}
              </ul>
              <p className="mt-auto text-[12px] text-muted tabular-nums">
                {missing === 0 ? "كل المعلومات متوفرة" : `${missing} معلومة ناقصة هيتطلب من الـ AI يحددها`}
              </p>
              <button id={`open-${c.kind}`} onClick={() => onOpen(c.kind)} className={`${c.tone.btn} w-full justify-center`}>
                {c.button} <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-0.5" />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
