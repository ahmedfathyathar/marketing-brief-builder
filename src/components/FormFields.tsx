import React from "react";
import { Check, AlertCircle } from "lucide-react";
import { Field } from "../data/questions";

interface FieldShellProps {
  field: Field;
  error?: boolean;
  children: React.ReactNode;
}

export function RequirementBadge({ required }: { required: boolean }) {
  return required ? (
    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary">مطلوب</span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-muted">اختياري</span>
  );
}

export function FieldShell({ field, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2" data-field={field.id}>
      <div className="flex items-start justify-between gap-3">
        <label htmlFor={`f-${field.id}`} className="text-[15px] font-semibold leading-7 text-ink">
          <span className="ml-2 inline-block min-w-[1.5rem] font-mono text-xs font-medium text-muted tabular-nums">{field.num}.</span>
          {field.label}
        </label>
        <div className="shrink-0 pt-1">
          <RequirementBadge required={field.required} />
        </div>
      </div>
      {field.hint && <p className="text-[13px] leading-6 text-muted">{field.hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-red-600" role="alert">
          <AlertCircle className="h-4 w-4" /> السؤال ده مطلوب عشان نكمل.
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] leading-7 text-ink placeholder:text-slate-400 transition focus:outline-none focus:ring-4";
const inputOk = "border-line hover:border-slate-300 focus:border-primary focus:ring-primary/15";
const inputErr = "border-red-400 focus:border-red-500 focus:ring-red-500/15";

interface TextProps {
  field: Field;
  value: string;
  error?: boolean;
  onChange: (v: string) => void;
}

export function TextInput({ field, value, error, onChange }: TextProps) {
  return (
    <input
      id={`f-${field.id}`}
      type="text"
      value={value}
      placeholder={field.placeholder}
      aria-invalid={error || undefined}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} ${error ? inputErr : inputOk}`}
    />
  );
}

export function TextArea({ field, value, error, onChange }: TextProps) {
  return (
    <textarea
      id={`f-${field.id}`}
      rows={field.rows ?? 4}
      value={value}
      placeholder={field.placeholder}
      aria-invalid={error || undefined}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} ${error ? inputErr : inputOk} resize-y`}
    />
  );
}

interface MultiProps {
  field: Field;
  value: string[];
  error?: boolean;
  onChange: (v: string[]) => void;
  variant?: "cards" | "chips";
}

export function MultiSelect({ field, value, error, onChange, variant = "cards" }: MultiProps) {
  const toggle = (opt: string) => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  const isChips = variant === "chips";
  return (
    <div
      id={`f-${field.id}`}
      role="group"
      aria-label={field.label}
      className={isChips ? "flex flex-wrap gap-2" : "grid grid-cols-1 gap-2.5 sm:grid-cols-2"}
    >
      {field.options!.map((opt) => {
        const on = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            role="checkbox"
            aria-checked={on}
            onClick={() => toggle(opt)}
            className={[
              "group flex items-center gap-3 border text-start transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
              isChips ? "rounded-full px-4 py-2 text-sm" : "rounded-xl px-4 py-3 text-[15px]",
              on
                ? "border-primary bg-primary-50 text-primary-700 font-semibold"
                : `${error ? "border-red-300" : "border-line"} bg-white text-ink hover:border-slate-300 hover:bg-slate-50`,
            ].join(" ")}
          >
            <span
              className={[
                "flex shrink-0 items-center justify-center rounded-md border transition",
                isChips ? "h-4 w-4" : "h-5 w-5",
                on ? "border-primary bg-primary text-white" : "border-slate-300 bg-white",
              ].join(" ")}
            >
              {on && <Check className={isChips ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={3} />}
            </span>
            <span dir="auto">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

interface SingleProps {
  field: Field;
  value: string;
  error?: boolean;
  onChange: (v: string) => void;
}

/** One answer out of a few. Text before ":" is shown bold, the rest as a description. */
export function SingleSelect({ field, value, error, onChange }: SingleProps) {
  return (
    <div id={`f-${field.id}`} role="radiogroup" aria-label={field.label} className="grid grid-cols-1 gap-2.5">
      {field.options!.map((opt) => {
        const on = value === opt;
        const i = opt.indexOf(":");
        const head = i > 0 ? opt.slice(0, i) : opt;
        const rest = i > 0 ? opt.slice(i + 1).trim() : "";
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(opt)}
            className={[
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-start text-[15px] transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
              on ? "border-primary bg-primary-50" : `${error ? "border-red-300" : "border-line"} bg-white hover:border-slate-300 hover:bg-slate-50`,
            ].join(" ")}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${on ? "border-primary" : "border-slate-300"}`}>
              {on && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <span className="flex min-w-0 flex-col">
              <span dir="auto" className={on ? "font-semibold text-primary-700" : "font-medium text-ink"}>{head}</span>
              {rest && <span className="text-[13px] leading-6 text-muted">{rest}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
