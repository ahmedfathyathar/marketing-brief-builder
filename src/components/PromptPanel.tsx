import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Copy, Check, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { Answers } from "../data/questions";
import { PromptKind, OutputLang, LANG_LABELS, buildPrompt, missingFields, PROMPT_META, HAS_LANG_OPTION } from "../lib/prompts";
import { copyText } from "../lib/clipboard";

interface Props {
  kind: PromptKind;
  answers: Answers;
  lang: OutputLang;
  onLang: (l: OutputLang) => void;
  onBack: () => void;
  onToast: (msg: string, tone?: "success" | "error") => void;
  onAnswer: (id: string, value: string) => void;
}

const AI_TOOLS = [
  { name: "Claude", href: "https://claude.ai/new" },
  { name: "ChatGPT", href: "https://chatgpt.com/" },
  { name: "Gemini", href: "https://gemini.google.com/app" },
];

export function PromptPanel({ kind, answers, lang, onLang, onBack, onToast, onAnswer }: Props) {
  const [version, setVersion] = useState(0);
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // Rebuilds from the latest saved answers and the chosen output language.
  const prompt = useMemo(() => buildPrompt(kind, answers, { lang }), [kind, answers, lang, version]);
  const missing = useMemo(() => missingFields(kind, answers).filter((m) => !(kind === "logo" && m.startsWith("اسم البراند"))), [kind, answers]);
  const meta = PROMPT_META[kind];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [kind]);

  const handleCopy = async () => {
    const ok = await copyText(prompt);
    if (ok) {
      setCopied(true);
      onToast("اتنسخ الـ Prompt! الصقه في أي AI Tool.");
      window.setTimeout(() => setCopied(false), 2200);
    } else {
      const sel = window.getSelection();
      if (preRef.current && sel) {
        const r = document.createRange();
        r.selectNodeContents(preRef.current);
        sel.removeAllRanges();
        sel.addRange(r);
      }
      onToast("المتصفح منع النسخ التلقائي. النص اتحدد، اضغط Ctrl+C أو Cmd+C.", "error");
    }
  };

  const handleRegenerate = () => {
    setVersion((v) => v + 1);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 700);
    onToast("اتعمل الـ Prompt من جديد بآخر إجاباتك.");
  };

  const words = prompt.split(/\s+/).filter(Boolean).length;

  return (
    <div className="animate-in flex flex-col gap-5 py-8">
      <button id="btn-back-dashboard" onClick={onBack} className="inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-muted transition hover:text-primary">
        <ArrowRight className="h-4 w-4" /> رجوع للـ Dashboard
      </button>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 dir="ltr" className="text-end text-[1.6rem] font-bold text-ink sm:text-[1.9rem]">{meta.title}</h1>
          <p className="text-[14px] text-muted">
            الدور: <span dir="ltr" className="font-medium text-ink">{meta.role}</span>
            <span className="mx-2 text-line">|</span>
            <span className="tabular-nums">{words.toLocaleString("en-US")} كلمة</span>
          </p>
        </div>
        {HAS_LANG_OPTION[kind] ? (
        <div className="flex w-full flex-col gap-1.5 sm:w-auto">
          <span className="text-[12px] font-medium text-muted">لغة رد الـ AI</span>
          <div role="radiogroup" aria-label="لغة رد الـ AI" className="grid grid-cols-3 rounded-xl border border-line bg-white p-1 sm:inline-flex">
            {(Object.keys(LANG_LABELS) as OutputLang[]).map((l) => (
              <button
                key={l}
                role="radio"
                aria-checked={lang === l}
                onClick={() => onLang(l)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${lang === l ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
        ) : (
          <p className="max-w-xs text-[12px] leading-6 text-muted">الـ Prompt ده بالإنجليزي عشان أدوات الصور بتفهمه أحسن. الصقه في ChatGPT أو Gemini واطلب صورة.</p>
        )}
      </header>

      {kind === "logo" && (
        <div className="card flex flex-col gap-2 p-4">
          <label htmlFor="f-logo-name" className="text-[14px] font-semibold text-ink">اسم البراند اللي هيتكتب في اللوجو</label>
          <input
            id="f-logo-name"
            type="text"
            value={(answers.brandName as string) ?? ""}
            onChange={(e) => onAnswer("brandName", e.target.value)}
            placeholder="اكتب الاسم اللي اخترته، مثلًا: Rakwa"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
          <p className="text-[12px] text-muted">
            {((answers.brandName as string) ?? "").trim() ? "الـ Prompt اتحدّث بالاسم ده." : "لسه مفيش اسم. الـ Prompt هيبقى فيه [INSERT BUSINESS NAME] لحد ما تكتبه."}
          </p>
        </div>
      )}

      {missing.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-[13px] leading-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-ink">
              <strong className="font-semibold">{missing.length} معلومة مش موجودة في الـ Brief.</strong>{" "}
              الـ Prompt بيطلب من الـ AI يشتغل بالمتاح ويحدد الناقص بدل ما يخترعه.
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {missing.map((m) => (
                <li key={m} className="rounded-md bg-amber-50 px-2 py-0.5 text-[12px] text-amber-900">{m}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <section className="card sm:overflow-hidden">
        <div className="z-10 flex flex-wrap rounded-t-2xl sm:sticky sm:top-16 items-center justify-between gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-5">
          <span className="text-[13px] font-semibold text-muted">الـ Prompt الكامل</span>
          <div className="hidden flex-wrap gap-2 sm:flex">
            <button id="btn-regenerate" onClick={handleRegenerate} className="btn-ghost btn-sm">
              <RefreshCw className={`h-4 w-4 ${flash ? "animate-spin-once" : ""}`} /> إعادة إنشاء
            </button>
            <button id="btn-copy" onClick={handleCopy} className={`btn-sm ${copied ? "btn-success" : "btn-primary"}`}>
              {copied ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
              {copied ? "اتنسخ" : "انسخ الـ Prompt"}
            </button>
          </div>
        </div>
        <pre
          ref={preRef}
          dir="rtl"
          className={`overflow-auto sm:max-h-[70vh] whitespace-pre-wrap break-words p-4 font-sans text-[14px] leading-8 text-ink transition-colors duration-700 sm:p-7 ${flash ? "bg-primary-50" : "bg-white"}`}
        >
          {prompt}
        </pre>
        <div className="mobile-bar flex gap-2 rounded-b-2xl border-t border-line p-3 sm:hidden">
          <button id="btn-regenerate-m" onClick={handleRegenerate} className="btn-ghost btn-sm" aria-label="إعادة إنشاء">
            <RefreshCw className={`h-4 w-4 ${flash ? "animate-spin-once" : ""}`} /> إعادة إنشاء
          </button>
          <button id="btn-copy-m" onClick={handleCopy} className={`btn-sm flex-1 justify-center ${copied ? "btn-success" : "btn-primary"}`}>
            {copied ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
            {copied ? "اتنسخ" : "انسخ الـ Prompt"}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100/80 p-4">
        <p className="text-[13px] text-muted">انسخ الـ Prompt وافتح أي أداة من دول والصقه في محادثة جديدة:</p>
        <div className="flex flex-wrap gap-2">
          {AI_TOOLS.map((t) => (
            <a key={t.name} href={t.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-ink transition hover:border-primary hover:text-primary">
              {t.name} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
