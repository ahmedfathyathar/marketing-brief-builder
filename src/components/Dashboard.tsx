import { Type, Shapes, LayoutTemplate, PenLine, ArrowLeft, Pencil, CheckCircle2, FlaskConical, Plus } from "lucide-react";
import { Answers, OutputKind, OUTPUT_ORDER, countQuestions } from "../data/questions";
import { missingFields, PROMPT_META } from "../lib/prompts";
import { OUTPUT_CARDS } from "./Welcome";

interface Props {
  answers: Answers;
  outputs: OutputKind[];
  generated: Partial<Record<OutputKind, boolean>>;
  onOpen: (k: OutputKind) => void;
  onAdd: (k: OutputKind) => void;
  onEditBrief: () => void;
  isDemo?: boolean;
}

const CARDS: Record<OutputKind, {
  icon: typeof Type;
  desc: string;
  button: string;
  includes: string[];
  tone: { icon: string; ring: string; btn: string; chip: string };
}> = {
  name: {
    icon: Type,
    desc: "اقتراحات أسماء مبنية على المجال والجمهور واللغة والـ Positioning اللي اخترتهم.",
    button: "إنشاء Name Prompt",
    includes: ["30 اسم", "3 فئات", "النطق والمعنى", "Top 5"],
    tone: { icon: "bg-primary text-white", ring: "hover:border-primary/40", btn: "btn-primary", chip: "bg-primary-50 text-primary-700" },
  },
  logo: {
    icon: Shapes,
    desc: "Prompt بالإنجليزي لأدوات الصور، عشان تطلّع لوجو بسيط ومميز يعيش سنين.",
    button: "إنشاء Logo Prompt",
    includes: ["Symbol", "Wordmark", "2–3 Colors", "Flat Vector"],
    tone: { icon: "bg-ink text-white", ring: "hover:border-slate-400", btn: "btn-dark", chip: "bg-slate-100 text-ink" },
  },
  landing: {
    icon: LayoutTemplate,
    desc: "استخدم معلومات المنتج والجمهور لبناء Landing Page مصممة لتحويل الزوار إلى عملاء.",
    button: "إنشاء Landing Page Prompt",
    includes: ["Hero & CTA", "Pain Points", "How It Works", "Pricing", "FAQs", "Mobile-first"],
    tone: { icon: "bg-primary text-white", ring: "hover:border-primary/40", btn: "btn-primary", chip: "bg-primary-50 text-primary-700" },
  },
  copy: {
    icon: PenLine,
    desc: "أنشئ مجموعة من الـ Marketing Copies المبنية على احتياجات الجمهور ومشاكله ودوافع الشراء والاعتراضات.",
    button: "إنشاء Sales Copy Prompt",
    includes: ["10 Angles", "10 Hooks", "Ad Copies", "Captions", "AIDA · PAS · FAB · BAB"],
    tone: { icon: "bg-success text-white", ring: "hover:border-success/40", btn: "btn-success", chip: "bg-green-50 text-green-800" },
  },
};

export function Dashboard({ answers, outputs, generated, onOpen, onAdd, onEditBrief, isDemo }: Props) {
  const brand = ((answers.brandName as string) ?? "").trim();
  const chosen = OUTPUT_ORDER.filter((k) => outputs.includes(k));
  const others = OUTPUT_ORDER.filter((k) => !outputs.includes(k));
  return (
    <div className="animate-in flex flex-col gap-8 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[13px] font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" /> {brand && !outputs.includes("name") ? `Brief «${brand}» اكتمل` : "الـ Brief اكتمل"}
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
            <strong className="font-semibold">ده Brief تجريبي لبزنس افتراضي: «ركوة»</strong>، اشتراك شهري في قهوة Specialty. كل الأسئلة متجاوبة.
            اختار الـ Prompt اللي عايزه، أو اضغط «ابدأ من جديد» فوق عشان تدخل بيانات البزنس بتاعك.
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-5 ${chosen.length > 1 ? "md:grid-cols-2" : ""} ${chosen.length === 3 ? "lg:grid-cols-3" : ""}`}>
        {chosen.map((k) => {
          const c = CARDS[k];
          const missing = missingFields(k, answers).length;
          return (
            <article key={k} className={`card group flex flex-col gap-5 p-5 sm:p-6 transition hover:-translate-y-0.5 hover:shadow-lg ${c.tone.ring}`}>
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.tone.icon}`}>
                  <c.icon className="h-6 w-6" />
                </span>
                {generated[k] && (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" /> اتعمل قبل كده
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h2 dir="ltr" className="text-end text-[19px] font-bold text-ink">{PROMPT_META[k].title}</h2>
                <p className="text-[14px] leading-7 text-muted">{c.desc}</p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {c.includes.map((x) => (
                  <li key={x} dir="auto" className={`rounded-md px-2 py-1 text-[12px] font-medium ${c.tone.chip}`}>{x}</li>
                ))}
              </ul>
              <p className="mt-auto text-[12px] text-muted tabular-nums">
                {k === "logo" && outputs.includes("name") && !brand
                  ? "هتكتب الاسم اللي اخترته في صفحة الـ Prompt"
                  : missing === 0 ? "كل المعلومات متوفرة" : `${missing} معلومة ناقصة هيتطلب من الـ AI يحددها`}
              </p>
              <button id={`open-${k}`} onClick={() => onOpen(k)} className={`${c.tone.btn} w-full justify-center`}>
                {c.button} <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-0.5" />
              </button>
            </article>
          );
        })}
      </div>

      {others.length > 0 && (
        <section className="flex flex-col gap-3 border-t border-line pt-6" aria-labelledby="more-title">
          <h2 id="more-title" className="text-[16px] font-bold text-ink">عايز تطلّع حاجة تانية؟</h2>
          <div className="flex flex-wrap gap-2.5">
            {others.map((k) => {
              const extra = countQuestions([...outputs, k]) - countQuestions(outputs);
              return (
                <button key={k} id={`add-${k}`} onClick={() => onAdd(k)} className="btn-ghost btn-sm">
                  <Plus className="h-4 w-4" /> {OUTPUT_CARDS[k].title}
                  <span className="text-[12px] font-normal text-muted tabular-nums">{extra > 0 ? `· ${extra} سؤال زيادة` : "· مفيش أسئلة زيادة"}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
