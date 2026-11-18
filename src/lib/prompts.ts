import { Answers, SECTIONS, isFilled, FIELD_BY_ID, answerText } from "../data/questions";

export type PromptKind = "strategy" | "landing" | "copy";
export type OutputLang = "ar-eg" | "ar" | "en";

export interface PromptOptions {
  lang: OutputLang;
}

export const LANG_LABELS: Record<OutputLang, string> = {
  "ar-eg": "عامية مصرية",
  ar: "عربي فصحى مبسطة",
  en: "English",
};

/** Short, prompt-friendly label for each field. */
const PROMPT_LABEL: Record<string, string> = {
  brandName: "اسم البراند (Brand Name)",
  productName: "المنتج / الخدمة",
  productDescription: "وصف المنتج والمواصفات",
  keyFeatures: "المميزات الأساسية",
  mustHaveFeatures: "الأساسيات اللي العميل مايشتريش من غيرها (Must-have Features)",
  howToUse: "طريقة الاستخدام / الخطوات",
  targetAudience: "الجمهور المستهدف (Target Audience)",
  ageRange: "الفئة العمرية",
  location: "المكان الجغرافي",
  brandLanguage: "لغة الكتابة للجمهور (لغة البراند)",
  purchasingPower: "المستوى الاجتماعي / القوة الشرائية",
  audienceNeeds: "احتياجات الجمهور",
  mainProblem: "المشكلة الأساسية (Pain Point)",
  desiredOutcome: "النتيجة اللي العميل عايز يوصلها (Desired Outcome)",
  objections: "المخاوف والاعتراضات قبل الشراء",
  currentAlternatives: "البدائل اللي الجمهور بيستخدمها حاليًا",
  directCompetitors: "المنافسين المباشرين",
  differentiation: "ما يميز المنتج عن البدائل والمنافسين",
  price: "السعر",
  offers: "العروض والخصومات الحالية",
  paymentPlans: "أنظمة الدفع / التقسيط / الباقات",
  guarantee: "الضمان / سياسة الاسترجاع",
  goals: "هدف المحتوى",
  cta: "الإجراء المطلوب من العميل (CTA)",
  platforms: "منصات النشر",
  contactMethod: "طريقة التواصل / الطلب",
};

const MISSING = "⟨غير متوفر — لم يتم تقديم هذه المعلومة⟩";

function valueOf(answers: Answers, id: string): string {
  return answerText(answers, id);
}

function formatValue(raw: string): string {
  if (!raw.includes("\n")) return raw;
  return "\n" + raw.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `    • ${l}`).join("\n");
}

/** The full brief, grouped by section, with explicit markers for missing fields. */
export function renderBrief(answers: Answers): string {
  return SECTIONS.map((s) => {
    const lines = s.fields.map((f) => {
      const raw = valueOf(answers, f.id);
      return `- ${PROMPT_LABEL[f.id] ?? f.label}: ${raw ? formatValue(raw) : MISSING}`;
    });
    return `### ${s.title}\n${lines.join("\n")}`;
  }).join("\n\n");
}

/** Fields each prompt depends on most. Missing ones get called out explicitly. */
const CRITICAL: Record<PromptKind, string[]> = {
  strategy: ["ageRange", "location", "purchasingPower", "audienceNeeds", "objections", "currentAlternatives", "directCompetitors", "differentiation", "offers", "paymentPlans", "guarantee", "mustHaveFeatures"],
  landing: ["brandLanguage", "howToUse", "objections", "differentiation", "offers", "paymentPlans", "guarantee", "mustHaveFeatures", "audienceNeeds"],
  copy: ["brandLanguage", "objections", "audienceNeeds", "differentiation", "offers", "guarantee", "ageRange", "currentAlternatives", "mustHaveFeatures"],
};

export function missingFields(kind: PromptKind, answers: Answers): string[] {
  const all = SECTIONS.flatMap((s) => s.fields.map((f) => f.id));
  const crit = CRITICAL[kind];
  return all
    .filter((id) => !isFilled(answers[id]))
    .sort((a, b) => Number(crit.includes(b)) - Number(crit.includes(a)))
    .map((id) => PROMPT_LABEL[id] ?? FIELD_BY_ID[id]?.label ?? id);
}

function missingBlock(kind: PromptKind, answers: Answers): string {
  const m = missingFields(kind, answers);
  if (m.length === 0) {
    return "كل حقول الـ Brief متعبّية. اعتمد عليها بالكامل، ولو لقيت تعارض بين معلومتين وضّحه واسأل عنه.";
  }
  return [
    "الحقول دي ما اتقدمتش في الـ Brief:",
    ...m.map((x) => `- ${x}`),
    "",
    "التعامل مع النقص:",
    "1. لا تخترع أي معلومة مكانها، ولا تملأها بافتراضات وتقدّمها كأنها حقائق.",
    "2. اشتغل بالمعلومات المتاحة فقط.",
    "3. في أول الرد، اعمل قسم قصير بعنوان «معلومات ناقصة مهمة» تحدد فيه أنهي معلومة من دول هتأثر فعلًا على جودة الناتج، وليه، واقترح سؤال واحد واضح لصاحب البزنس عن كل واحدة.",
    "4. لو اضطريت تبني على افتراض عشان تكمل، اكتبه صراحة بعلامة [افتراض] واشرح إزاي صاحب البزنس يتأكد منه.",
  ].join("\n");
}

function langRule(lang: OutputLang): string {
  switch (lang) {
    case "ar-eg":
      return "اكتب الرد كله بالعامية المصرية الواضحة، وسيب المصطلحات التسويقية الشائعة بالإنجليزي (زي CTA, Funnel, KPI, Leads, USP). ";
    case "ar":
      return "اكتب الرد كله بالعربية الفصحى المبسطة، وسيب المصطلحات التسويقية الشائعة بالإنجليزي (مثل CTA, Funnel, KPI, Leads, USP).";
    case "en":
      return "Write your entire response in clear, professional English. Note: the brief below is written in Arabic; translate and interpret it faithfully without adding information.";
  }
}

/** Language for any customer-facing text, taken from the brief. Separate from the AI's explanation language. */
function brandLangRule(a: Answers): string {
  const langs = valueOf(a, "brandLanguage");
  const n = Array.isArray(a.brandLanguage) ? a.brandLanguage.length : 0;
  if (!langs) {
    return "لغة البراند مش محددة في الـ Brief. اسأل صاحب البزنس عنها قبل كتابة أي نص موجّه للعميل، ولحد ما يرد استخدم لغة تناسب الجمهور والمكان الجغرافي وعلّمها بـ [افتراض].";
  }
  const multi = n > 1
    ? `\n- البزنس اختار أكتر من لغة. أي نص موجّه للعميل (Headlines، إعلانات، Captions، أقسام الصفحة، CTA) اعمله بنسخة لكل لغة، واقترح إمتى أو على أنهي منصة تُستخدم كل نسخة.`
    : "";
  return `- أي كلام موجّه للعميل النهائي يتكتب بـ: ${langs}.${multi}
- لو اللغة «عربي وإنجليزي مع بعض»، اخلط بشكل طبيعي زي ما الجمهور بيتكلم فعلًا، مش ترجمة حرفية.
- ده منفصل عن لغة الشرح والتحليل اللي تحت؛ الشرح يمشي على قسم «لغة الرد»، والنصوص الجاهزة للنشر تمشي على لغة البراند.`;
}

function brand(answers: Answers): string {
  return valueOf(answers, "brandName") || "البزنس";
}

function product(answers: Answers): string {
  return valueOf(answers, "productName") || "المنتج";
}

const DIVIDER = "━━━━━━━━━━━━━━━━━━━━━━━━";

/* ───────────────────────── Prompt A: Strategy ───────────────────────── */

function strategyPrompt(a: Answers, o: PromptOptions): string {
  const goals = valueOf(a, "goals") || "غير محدد";
  const platforms = valueOf(a, "platforms") || "غير محدد";
  return `# الدور
إنت Senior Marketing Strategist و Growth Consultant، عندك خبرة عميقة في Market Research، Positioning، Customer Psychology، Competitive Analysis، Marketing Funnels، و Performance Marketing. شغلك إنك تحوّل المعلومات الخام لاستراتيجية واضحة وخطة تنفيذ عملية، مش لكلام نظري.

# المهمة
حلّل الـ Marketing Brief الخاص بـ «${brand(a)}» (المنتج: ${product(a)}) وابني استراتيجية تسويقية متكاملة وخطة تنفيذ لمدة 30 يوم.
الأهداف المعلنة: ${goals}.
القنوات اللي صاحب البزنس ناوي يستخدمها: ${platforms}.

${DIVIDER}
# الـ Marketing Brief
${renderBrief(a)}
${DIVIDER}

# المعلومات الناقصة
${missingBlock("strategy", a)}

# قواعد أساسية
- لا تخترع إحصائيات سوق، أو أرقام، أو معلومات عن منافسين، أو نتائج أبحاث عملاء.
- فرّق بوضوح في كل قسم بين ٣ أنواع من الكلام، وعلّم كل نقطة بنوعها:
  [حقيقة من الـ Brief] — معلومة قالها صاحب البزنس.
  [افتراض استراتيجي] — استنتاج منطقي منك محتاج يتأكد.
  [توصية بحث] — حاجة لازم تتبحث أو تتقاس قبل الاعتماد عليها.
- الخطة لازم تكون واقعية ومناسبة لحجم البزنس ومعلوماته الفعلية. لو الميزانية أو حجم الفريق مش معروفين، اقترح نسخة بسيطة قابلة للتنفيذ وقول إيه اللي يتغير لو الموارد أكبر.
- رتّب كل التوصيات حسب الأولوية والأثر المتوقع.
- خلّي كل توصية مربوطة بمعلومة من الـ Brief، ووضّح الربط ده.

# المطلوب (بالترتيب ده بالظبط)
1. **Business & Product Analysis** — نقاط القوة والضعف في المنتج والعرض الحالي من واقع الـ Brief.
2. **Target Audience Analysis** — مين بالظبط، وإيه السياق اللي بيشتري فيه.
3. **Customer Pain Points & Purchase Motivations** — الألم، الرغبة، والدوافع العقلانية والعاطفية للشراء.
4. **Customer Personas** — من 2 لـ 3 شخصيات: الاسم، الخلفية، يوم عادي في حياته، المشكلة، الاعتراض الأساسي، الرسالة اللي تقنعه، والقناة الأنسب للوصول له.
5. **Competitor & Alternative Analysis** — حلّل البدائل والمنافسين المذكورين فقط. لو المعلومات قليلة، اعمل جدول بالمعلومات اللي محتاج صاحب البزنس يجمعها عن كل منافس وإزاي يجمعها.
6. **Unique Selling Proposition (USP)** — جملة واحدة واضحة، ومعاها 2 بديل.
7. **Brand Positioning** — Positioning Statement بالصيغة: لـ [الجمهور] اللي [الاحتياج]، ${brand(a)} هو [الفئة] اللي [الفايدة الأساسية]، على عكس [البديل] لأن [السبب].
8. **Value Proposition** — الفايدة الوظيفية، والعاطفية، والاقتصادية.
9. **Messaging & Communication Angles** — Key Message أساسية، و 5 زوايا تواصل مختلفة، مع إمتى تستخدم كل زاوية.
10. **Marketing Funnel** — TOFU / MOFU / BOFU: الهدف، نوع المحتوى، القناة، والـ CTA في كل مرحلة، ومربوطة بالـ CTA النهائي: «${valueOf(a, "cta") || "غير محدد"}».
11. **Recommended Marketing Channels** — قيّم القنوات المختارة، واقترح ترتيب أولوية، ووضّح لو فيه قناة مش مناسبة وليه.
12. **Content Strategy & Content Pillars** — من 3 لـ 5 Pillars، ولكل واحد أمثلة لـ 3 أفكار محتوى.
13. **Marketing Campaign Ideas** — 3 أفكار حملات: الاسم، الفكرة، الرسالة، القناة، والعرض المستخدم (من العروض المذكورة فقط).
14. **Detailed 30-Day Marketing Action Plan** — جدول مقسّم على 4 أسابيع. لكل أسبوع: الهدف، المهام بالترتيب، القناة، المخرجات المطلوبة، ومين ينفذ (لو معروف). الأسبوع الأول يركز على التأسيس والقياس.
15. **KPIs & Performance Metrics** — مؤشرات لكل مرحلة في الـ Funnel، وإزاي تتقاس، ومن غير ما تحط أرقام مستهدفة مخترعة. لو اقترحت Benchmark وضّح إنه [افتراض] محتاج يتأكد من نتايج أول أسبوعين.

# شكل الرد
- عناوين واضحة مرقّمة زي القائمة فوق.
- استخدم جداول للـ Personas، وتحليل المنافسين، والـ Funnel، وخطة الـ 30 يوم.
- في الآخر: «أهم 5 خطوات تبدأ بيها النهارده» بالترتيب.

# لغة البراند (للنصوص الجاهزة للنشر)
${brandLangRule(a)}

# لغة الرد (للشرح والتحليل)
${langRule(o.lang)}`;
}

/* ───────────────────────── Prompt B: Landing Page ───────────────────────── */

function landingPrompt(a: Answers, o: PromptOptions): string {
  const hasSocialProof = false; // the brief has no testimonials field; the prompt must not fabricate any
  const cta = valueOf(a, "cta") || "غير محدد";
  return `# الدور
إنت Senior Conversion Rate Optimization (CRO) Specialist، و UX/UI Designer، و Direct Response Copywriter في نفس الوقت. بتبني Landing Pages هدفها الوحيد تحويل الزائر لعميل، وكل قسم في الصفحة ليه وظيفة واضحة في رحلة القرار.

# المهمة
اكتب Landing Page كاملة وجاهزة للتنفيذ لـ «${product(a)}» من «${brand(a)}».
الـ CTA الأساسي للصفحة: «${cta}».
طريقة التواصل / الطلب: ${valueOf(a, "contactMethod") || "غير محددة"}.

${DIVIDER}
# الـ Marketing Brief
${renderBrief(a)}
${DIVIDER}

# المعلومات الناقصة
${missingBlock("landing", a)}

# قواعد الكتابة
- كل كلمة في الصفحة لازم تكون مبنية على الـ Brief. ممنوع الكلام العام اللي ينفع لأي منتج (زي «أفضل جودة» أو «خدمة متميزة») إلا لو معاه دليل محدد من الـ Brief.
- استخدم مبادئ الـ Persuasive Copywriting (وضوح، تحديد، فايدة قبل الميزة، تقليل المخاطرة) من غير ادعاءات مش مدعومة.
- ممنوع تخترع أرقام، أو عدد عملاء، أو تقييمات، أو آراء عملاء، أو شهادات، أو جوايز.
- ${hasSocialProof ? "" : "الـ Brief مافيهوش Social Proof فعلي. قسم الـ Social Proof يتكتب كـ Placeholder واضح مع تعليمات لصاحب البزنس عن نوع الدليل اللي يجمعه (Reviews، صور، أرقام حقيقية)، أو يتشال من الصفحة لو مفيش."}
- لو مفيش ضمان أو عروض في الـ Brief، ماتضيفش ضمان أو عرض من عندك؛ اقترحه كـ [توصية] منفصلة بس.
- خلي الـ CTA واحد ومتكرر بنفس المعنى في الصفحة كلها.

# المطلوب
قدّم الصفحة بالأقسام دي بالترتيب. لكل قسم اكتب: (أ) الهدف من القسم في سطر، (ب) النص النهائي الجاهز للنشر، (ج) ملاحظة تصميم مختصرة (Layout / عناصر بصرية).

1. **Landing Page Objective** — هدف الصفحة، والزائر المتوقع، ومؤشر النجاح الأساسي.
2. **Recommended Page Structure** — Wireframe نصي لترتيب الأقسام وليه الترتيب ده.
3. **Hero Section** — 3 اختيارات Headline، و Subheadline، و نص زرار الـ CTA، ووصف للصورة أو الفيديو المقترح. وضّح الاختيار اللي ترشحه وليه.
4. **Problem & Pain Points** — صياغة المشكلة بلغة العميل نفسه، مبنية على: «${valueOf(a, "mainProblem") || "غير محدد"}».
5. **Product / Service Introduction** — تقديم المنتج كحل للمشكلة.
6. **Benefits & Key Features** — حوّل كل ميزة لفايدة (Feature → Benefit) في جدول أو كروت.
7. **How It Works** — الخطوات من الـ Brief، مبسطة في 3 لـ 4 خطوات.
8. **Competitive Advantages** — مقارنة مع البدائل المذكورة في الـ Brief فقط، من غير ذكر أسماء منافسين بشكل سلبي.
9. **Social Proof** — حسب القاعدة فوق.
10. **Pricing & Offers** — عرض السعر والباقات والعروض بالظبط زي ما هي في الـ Brief، مع طريقة عرض تقلل الإحساس بالتكلفة من غير تضليل.
11. **FAQs** — من 6 لـ 8 أسئلة، أولويتها الرد على الاعتراضات المذكورة في الـ Brief، والإجابات من معلومات الـ Brief فقط. لو إجابة سؤال مهم مش موجودة، اكتب [محتاج معلومة من صاحب البزنس].
12. **Final CTA** — قسم ختامي يلخص القيمة ويكرر الـ CTA.
13. **Mobile-first Responsive Design Recommendations** — توصيات عملية: Sticky CTA، أحجام الخطوط، ترتيب العناصر على الموبايل، سرعة التحميل، وتجربة التواصل عبر: ${valueOf(a, "contactMethod") || "قناة التواصل المحددة"}.

# في الآخر
- قائمة Checklist قبل النشر (Tracking، Pixel، اختبار الفورم أو زرار التواصل).
- 3 أفكار A/B Testing مرتبة حسب الأثر المتوقع.

# لغة البراند (للنصوص الجاهزة للنشر)
${brandLangRule(a)}

# لغة الرد (للشرح والتحليل)
${langRule(o.lang)}`;
}

/* ───────────────────────── Prompt C: Sales Copy ───────────────────────── */

function copyPrompt(a: Answers, o: PromptOptions): string {
  const platforms = Array.isArray(a.platforms) ? valueOf(a, "platforms") : "";
  const cta = valueOf(a, "cta") || "غير محدد";
  return `# الدور
إنت Senior Direct Response Copywriter و Consumer Psychology Specialist. بتكتب كلام بيبيع لأنه بيفهم العميل: بيتكلم بلغته، بيلمس مشكلته الحقيقية، وبيرد على تردده، من غير مبالغة ولا كليشيهات.

# المهمة
اكتب مجموعة Marketing Copies مبنية على التحويل (Conversion-focused) لـ «${product(a)}» من «${brand(a)}».

- الجمهور: ${valueOf(a, "targetAudience") || "غير محدد"}
- الهدف: ${valueOf(a, "goals") || "غير محدد"}
- الـ CTA المطلوب: ${cta}
- المنصات: ${platforms || "غير محددة"}

${DIVIDER}
# الـ Marketing Brief
${renderBrief(a)}
${DIVIDER}

# المعلومات الناقصة
${missingBlock("copy", a)}

# قواعد الكتابة
- كل Copy لازم يكون مبني على معلومة من الـ Brief: مشكلة، فايدة، ميزة، اعتراض، أو عرض.
- ممنوع: الأرقام المخترعة، الوعود المطلقة («هتخس 10 كيلو في أسبوع»)، آراء عملاء وهمية، Urgency وهمي (زي «العرض لآخر النهارده») إلا لو مذكور في الـ Brief.
- ممنوع الكليشيهات والكلام العام: «جودة لا مثيل لها»، «الحل الأمثل»، «لا تفوّت الفرصة»، «ثورة في عالم...».
- نوّع فعلًا: ماتكررش نفس الافتتاحية أو نفس التركيب أو نفس الفايدة في أكتر من Copy.
- استخدم Copywriting Frameworks مختلفة واكتب اسم الـ Framework جنب كل Copy: AIDA، PAS، FAB، BAB، وغيرهم لو مناسب.
- كل Copy ينتهي بالـ CTA المطلوب أو صياغة قريبة منه.

# المطلوب
1. **10 Marketing Angles** — جدول: اسم الزاوية، الفكرة، الشريحة الأنسب ليها من الجمهور، والدافع النفسي اللي بتلعب عليه (خوف من خسارة، رغبة في توفير وقت، Identity، إلخ).
2. **10 Headlines & Hooks** — متنوعة: سؤال، رقم من الـ Brief، تحدي لاعتقاد شائع، مشهد من يوم العميل، نتيجة. اكتب الزاوية اللي كل Hook تابع لها.
3. **5 Primary Ad Copies** — إعلانات طويلة (80–150 كلمة)، كل واحد بـ Framework مختلف وزاوية مختلفة.
4. **5 Short Ad Copies** — إعلانات قصيرة (أقل من 40 كلمة).
5. **5 Social Media Captions** — مناسبة للنشر الأورجانيك، مع اقتراح نوع البوست (Carousel، Reel، صورة) لكل Caption.
6. **5 CTA Variations** — صياغات مختلفة لنفس الإجراء: «${cta}».
7. **3 Promotional Campaign Concepts** — اسم الحملة، الفكرة الكبيرة، الرسالة، العرض المستخدم (من العروض المذكورة فقط، أو [توصية] لو مفيش)، والمنصات.
8. **Objection-handling Copy** — لكل اعتراض مذكور في الـ Brief: الاعتراض، الإحساس اللي ورا الاعتراض، و Copy قصير يرد عليه بمعلومة حقيقية من الـ Brief.
9. **Benefit-driven Messaging** — جدول Feature → Benefit → Emotional Benefit → جملة جاهزة للاستخدام.
10. **Platform-specific Variations** — ${platforms ? `لكل منصة من دول (${platforms})` : "لكل منصة مناسبة"}: Copy مكتوب بطريقة المنصة (طول النص، الأسلوب، الـ Hook في أول سطر، الهاشتاجات لو مناسبة، وقيود المنصة زي حدود الحروف في Google Ads). لو فيه TikTok أو Reels، اكتب Script قصير بالثواني.

# في الآخر
رشّح أفضل 3 Copies للبدء بيهم في الاختبار، وليه.

# لغة البراند (للنصوص الجاهزة للنشر)
${brandLangRule(a)}

# لغة الرد (للشرح والتحليل)
${langRule(o.lang)}`;
}

export const PROMPT_META: Record<PromptKind, { title: string; role: string }> = {
  strategy: { title: "Marketing Strategy & Action Plan", role: "Senior Marketing Strategist & Growth Consultant" },
  landing: { title: "Landing Page Prompt", role: "CRO Specialist, UX/UI Designer & Direct Response Copywriter" },
  copy: { title: "Sales Copywriting Prompt", role: "Direct Response Copywriter & Consumer Psychology Specialist" },
};

export function buildPrompt(kind: PromptKind, answers: Answers, options: PromptOptions): string {
  switch (kind) {
    case "strategy":
      return strategyPrompt(answers, options);
    case "landing":
      return landingPrompt(answers, options);
    case "copy":
      return copyPrompt(answers, options);
  }
}
