import { Answers, SECTIONS, isFilled, FIELD_BY_ID, answerText, OutputKind } from "../data/questions";

export type PromptKind = OutputKind;
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
  industry: "المجال (Industry)",
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
  nameLanguage: "لغة الاسم",
  customerLanguage: "لغة الجمهور",
  nameType: "نوع الاسم",
  positioning: "Positioning",
  namePersonality: "شخصية البراند",
  nameLength: "طول الاسم",
  nameStructure: "عدد الكلمات",
  nameIncludeAvoid: "حروف أو كلمات يحطها أو يتجنبها",
  brandPersonality: "Brand Personality",
  brandColors: "الألوان المفضلة",
  brandMessage: "Brand Message",
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
export function renderBrief(answers: Answers, kind: PromptKind): string {
  return SECTIONS.map((s) => ({ ...s, fields: s.fields.filter((f) => f.for.includes(kind)) })).filter((s) => s.fields.length).map((s) => {
    const lines = s.fields.map((f) => {
      const raw = valueOf(answers, f.id);
      return `- ${PROMPT_LABEL[f.id] ?? f.label}: ${raw ? formatValue(raw) : MISSING}`;
    });
    return `### ${s.title}\n${lines.join("\n")}`;
  }).join("\n\n");
}

/** Questions this prompt uses that were left empty. */
export function missingFields(kind: PromptKind, answers: Answers): string[] {
  return SECTIONS.flatMap((s) => s.fields)
    .filter((f) => f.for.includes(kind) && !isFilled(answers[f.id]))
    .map((f) => PROMPT_LABEL[f.id] ?? FIELD_BY_ID[f.id]?.label ?? f.id);
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

/* ───────────────────────── Landing Page ───────────────────────── */

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
${renderBrief(a, "landing")}
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

/* ───────────────────────── Sales Copy ───────────────────────── */

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
${renderBrief(a, "copy")}
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

/* ───────────────────────── Brand Name ───────────────────────── */

const ARABIC_NOTE = "Note: some of the answers below are written in Arabic (Egyptian dialect). Read them carefully and interpret them faithfully. Do not add facts that are not in the answers.";

function nameLangRule(lang: OutputLang): string {
  switch (lang) {
    case "ar-eg":
      return "Write all explanations (meanings, reasons, personality) in clear Egyptian Arabic. Write every brand name in Latin letters and in Arabic script, so the business owner can see how it reads in both.";
    case "ar":
      return "Write all explanations (meanings, reasons, personality) in simple Modern Standard Arabic. Write every brand name in Latin letters and in Arabic script.";
    case "en":
      return "Write the entire response in clear, professional English. Also show every brand name in Arabic script.";
  }
}

function v(a: Answers, id: string, fallback = "[NOT PROVIDED]"): string {
  return valueOf(a, id) || fallback;
}

function namePrompt(a: Answers, o: PromptOptions): string {
  return `PROFESSIONAL BRAND NAME GENERATOR
Act as a world-class brand naming strategist, creative director, and branding expert.
Your task is to create unique, memorable, easy-to-understand, and marketable brand names that have the potential to become globally recognizable brands.

IMPORTANT: The business owner has already answered all the discovery questions below. Do not ask them again. Use these answers and go straight to generating the names.
${ARABIC_NOTE}

STEP 1: UNDERSTAND THE BUSINESS
1. Industry: ${v(a, "industry")}
2. Products or services: ${v(a, "productName")}. ${v(a, "productDescription", "")}
3. Target customer: ${v(a, "targetAudience")}

STEP 2: UNDERSTAND THE LANGUAGE
4. Language the brand name should be based on: ${v(a, "nameLanguage")}
5. Language the target customers primarily speak and understand: ${v(a, "customerLanguage")}
6. Type of name: ${v(a, "nameType")}
IMPORTANT: The name must be easy to pronounce, spell, read, and remember for the target audience.

STEP 3: UNDERSTAND BRAND POSITIONING
7. Positioning: ${v(a, "positioning")}
8. Brand personality: ${v(a, "namePersonality")}

STEP 4: NAMING PREFERENCES
9. Preferred name length: ${v(a, "nameLength")}
10. Preferred naming structure: ${v(a, "nameStructure")}
11. Letters, sounds, words, or names to include or avoid: ${v(a, "nameIncludeAvoid")}
12. Competitors or existing brand names to avoid: ${v(a, "directCompetitors")}

STEP 5: GENERATE BRAND NAMES
Generate 30 brand name suggestions.
Follow these rules:
- Prioritize one-word brand names.
- Aim for 5–7 letters.
- Make names easy to pronounce and spell.
- Ensure names are understandable and appropriate for the target language.
- Make names relevant to the business without being too obvious or generic.
- Avoid complicated spelling, random letters, and difficult pronunciation.
- Avoid names that sound too similar to famous existing brands.
- Prioritize originality, memorability, and long-term brand potential.
- Ensure the names fit the desired positioning: premium, mass-market, or mid-range.
- Make the names suitable for logos, websites, packaging, social media, and future business expansion.

STEP 6: PRESENT THE RESULTS
Organize the 30 names into three categories:
CATEGORY A – SIMPLE & MEMORABLE: 10 easy-to-understand names with strong brand potential.
CATEGORY B – MODERN & UNIQUE: 10 creative, distinctive names that sound like modern international brands.
CATEGORY C – PREMIUM & TIMELESS: 10 sophisticated names suitable for building a strong, long-term brand.
For every name, provide:
1. Brand name.
2. Number of letters.
3. Pronunciation.
4. Meaning or naming inspiration.
5. Why it fits the business.
6. Its overall brand personality.

STEP 7: FINAL SHORTLIST
Select the TOP 5 strongest names based on:
- Memorability.
- Ease of pronunciation.
- Relevance to the industry.
- Appeal to the target customer.
- Brand positioning.
- Visual potential for logo design.
- Potential for long-term brand growth.
Rank the five names and explain why each one is a strong choice.

IMPORTANT FINAL INSTRUCTIONS
Do not sacrifice clarity for creativity.
Do not generate meaningless combinations of letters just to make a name look unique.
A great brand name should be easy to say, easy to remember, visually attractive, and suitable for the customers who will use it.
Treat every naming project as if you are naming the next internationally recognized brand.
Finally, clearly state that domain availability, social media handles, trademarks, and business-name registrations must be checked independently before selecting a final name.

RESPONSE LANGUAGE
${nameLangRule(o.lang)}`;
}

/* ───────────────────────── Logo ───────────────────────── */

function logoColors(a: Answers): string {
  const c = valueOf(a, "brandColors");
  if (!c || /حرية|creative|freedom|مش فارق/i.test(c)) return "CREATIVE FREEDOM";
  return c;
}

function logoPrompt(a: Answers): string {
  const name = valueOf(a, "brandName");
  return `PROFESSIONAL LOGO DESIGN PROMPT
Act as a world-class brand identity designer specializing in iconic, minimalist, and timeless logos.

Create a unique, professional logo for the following business:
BUSINESS INFORMATION
- Business Name: ${name || "[INSERT BUSINESS NAME]"}
- Industry / Sector: ${v(a, "industry")}
- Products or Services: ${v(a, "productName")}. ${v(a, "productDescription", "")}
- Target Audience: ${v(a, "targetAudience")}
- Brand Personality: ${v(a, "brandPersonality")}
- Preferred Colors: ${logoColors(a)}
- Brand Message: ${v(a, "brandMessage")}
${ARABIC_NOTE} Keep the business name spelled exactly as written above.
DESIGN DIRECTION
Create a logo inspired by the design principles of iconic global brands such as Adidas, Netflix, and Spotify.

The logo must be:
1. Simple: Minimalist, clean, and free from unnecessary details.
2. Memorable: Instantly recognizable and easy to remember.
3. Unique: Original visual identity that does not imitate existing brands.
4. Versatile: Works perfectly on websites, social media, packaging, merchandise, business cards, and advertisements.
5. Timeless: Avoid temporary design trends. Create something that remains relevant for years.
6. Scalable: Looks equally good as a tiny app icon and a large billboard.
7. Professional: Reflects the business's industry, personality, and target audience.
CREATIVE APPROACH
- Explore a distinctive symbol, geometric shape, abstract mark, or clever visual concept.
- Consider incorporating the business initials or a hidden visual meaning into the symbol.
- Use clean typography with carefully balanced spacing and proportions.
- Create a strong visual relationship between the icon and business name.
- Use a maximum of 2–3 colors.
- Ensure the logo remains recognizable in black and white.
- Avoid generic stock icons, excessive gradients, complicated illustrations, unnecessary shadows, and decorative elements.
FINAL OUTPUT
Generate a distinctive logo featuring:
- A unique brand symbol.
- A clean, custom-looking wordmark.
- A balanced combination of symbol and typography.
- A professional color palette.
- A flat, vector-style appearance.
Present the logo on a clean, plain background.

IMPORTANT: Do not create a copy of Adidas, Netflix, Spotify, or any existing brand. Take inspiration only from their simplicity, memorability, and strong visual identity.

The final result should feel like a globally recognizable brand: simple enough to understand in one second, distinctive enough to remember, and versatile enough to build an entire business identity around.`;
}

export const PROMPT_META: Record<PromptKind, { title: string; role: string }> = {
  name: { title: "Brand Name Prompt", role: "Brand Naming Strategist & Creative Director" },
  logo: { title: "Logo Design Prompt", role: "Brand Identity Designer" },
  landing: { title: "Landing Page Prompt", role: "CRO Specialist, UX/UI Designer & Direct Response Copywriter" },
  copy: { title: "Sales Copywriting Prompt", role: "Direct Response Copywriter & Consumer Psychology Specialist" },
};

/** Logo prompts go to image tools and stay in English; the others can switch the AI's reply language. */
export const HAS_LANG_OPTION: Record<PromptKind, boolean> = { name: true, logo: false, landing: true, copy: true };

export function buildPrompt(kind: PromptKind, answers: Answers, options: PromptOptions): string {
  switch (kind) {
    case "name":
      return namePrompt(answers, options);
    case "logo":
      return logoPrompt(answers);
    case "landing":
      return landingPrompt(answers, options);
    case "copy":
      return copyPrompt(answers, options);
  }
}
