export type FieldType = "text" | "textarea" | "multiselect" | "chips";

export interface Field {
  id: string;
  num: number;
  label: string;
  hint?: string;
  placeholder?: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  /** when this option is selected in a multiselect, show a free-text input */
  otherOption?: string;
  /** placeholder for the free-text input shown when otherOption is selected */
  otherPlaceholder?: string;
  rows?: number;
}

export interface Section {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  why: string;
  fields: Field[];
}

export type Answers = Record<string, string | string[]>;

export const SECTIONS: Section[] = [
  {
    id: "business",
    title: "معلومات عن البزنس والمنتج",
    shortTitle: "البزنس والمنتج",
    description: "خلّينا نبدأ من الأساس: إنت بتبيع إيه، وإيه اللي يخلّي منتجك يستاهل.",
    why: "كل ما الوصف أدق، كل ما الـ AI يقدر يكتب كلام حقيقي عن منتجك بدل كلام عام ينفع لأي حد.",
    fields: [
      { id: "brandName", num: 0, label: "اسم البزنس (Brand Name)", type: "text", required: true, placeholder: "مثلًا: ركوة" },
      { id: "productName", num: 0, label: "اسم المنتج أو الخدمة", type: "text", required: true, placeholder: "مثلًا: اشتراك وجبات صحية أسبوعي" },
      {
        id: "productDescription", num: 0, label: "وصف المنتج بالتفصيل، شامل كل المواصفات والخصائص", type: "textarea", required: true, rows: 5,
        placeholder: "اكتب كل حاجة: المكونات، الأحجام، المدة، طريقة التسليم، أي مواصفات فنية...",
      },
      {
        id: "keyFeatures", num: 0, label: "إيه المميزات الأساسية اللي بتميز المنتج عن غيره؟", type: "textarea", required: true,
        placeholder: "مثلًا: كل وجبة محسوبة سعراتها، توصيل يومي قبل ٩ الصبح، منيو بيتغير كل أسبوع",
      },
      {
        id: "mustHaveFeatures", num: 0, label: "إيه الحاجات الأساسية اللي لو مش موجودة في المنتج، العميل مش هيشتريه؟ (Must-have Features)", type: "textarea", required: true,
        hint: "دي الحاجات اللي العميل بيعتبرها بديهية. بتساعد الـ AI يعرف يركز على إيه في الرسائل.",
        placeholder: "مثلًا: أكل طازة مش مجمد، أسعار واضحة، إمكانية إيقاف الاشتراك",
      },
      {
        id: "howToUse", num: 0, label: "إيه طريقة استخدام المنتج؟ وهل محتاج خطوات معينة؟", type: "textarea", required: true,
        placeholder: "مثلًا: تختار الباقة ← تحدد هدفك ← الوجبات توصلك كل يوم",
      },
    ],
  },
  {
    id: "audience",
    title: "معلومات عن الجمهور المستهدف",
    shortTitle: "الجمهور",
    description: "مين اللي بيشتري منك، وبيفكر إزاي، وإيه اللي مقلقه.",
    why: "الـ Target Audience هو أهم جزء في أي خطة. نفس المنتج بيتباع بكلام مختلف تمامًا لطالب جامعة ولمدير شركة.",
    fields: [
      {
        id: "targetAudience", num: 0, label: "مين الجمهور المستهدف؟", type: "textarea", required: true,
        placeholder: "مثلًا: موظفين وموظفات في الشركات، مشغولين طول اليوم، عايزين ياكلوا صحي ومش لاقيين وقت يطبخوا",
      },
      {
        id: "ageRange", num: 0, label: "الفئة العمرية (Age Range)", type: "chips", required: true,
        options: ["أقل من 18", "18–24", "25–34", "35–44", "45–54", "55+"],
        hint: "اختار فئة أو أكتر.",
      },
      { id: "location", num: 0, label: "المكان الجغرافي (Location)", type: "text", required: true, placeholder: "مثلًا: القاهرة الكبرى (التجمع، المعادي، الشيخ زايد)" },
      {
        id: "brandLanguage", num: 0, label: "البزنس عايز يكتب للجمهور بأنهي لغة؟", type: "multiselect", required: true,
        options: ["عامية مصرية", "عربي فصحى مبسطة", "English", "عربي وإنجليزي مع بعض", "لغة أو لهجة تانية"],
        otherOption: "لغة أو لهجة تانية",
        otherPlaceholder: "اكتب اللغة أو اللهجة: مثلًا خليجي، شامي، Franco Arabic…",
        hint: "دي اللغة اللي هيتكتب بيها أي كلام موجّه للعميل: الإعلانات، الـ Landing Page، والـ Captions. لو اخترت أكتر من لغة، الـ AI هيعمل نسخة بكل لغة.",
      },
      { id: "purchasingPower", num: 0, label: "المستوى الاجتماعي أو القوة الشرائية", type: "text", required: true, placeholder: "مثلًا: متوسط إلى فوق المتوسط" },
      {
        id: "audienceNeeds", num: 0, label: "إيه أهم احتياجات الجمهور اللي المنتج بيقدر يلبيها؟", type: "textarea", required: true,
        placeholder: "مثلًا: توفير وقت، أكل صحي من غير تفكير، التحكم في الوزن",
      },
      {
        id: "mainProblem", num: 0, label: "إيه المشكلة الأساسية اللي بيعاني منها وعايز يحلها باستخدام المنتج؟", type: "textarea", required: true,
        placeholder: "مثلًا: بيرجع من الشغل متأخر وبيطلب Fast Food، وده بيبوّظ أي دايت بيبدأه",
      },
      {
        id: "desiredOutcome", num: 0, label: "إيه النتيجة أو الفايدة اللي عايز يوصلها بعد استخدام المنتج؟", type: "textarea", required: true,
        placeholder: "مثلًا: ينزل في الوزن ويحس بطاقة أعلى من غير ما يضيّع وقت في التخطيط والطبخ",
      },
      {
        id: "objections", num: 0, label: "إيه أهم مخاوف أو اعتراضات ممكن تخليه يتردد قبل الشراء؟", type: "textarea", required: true,
        hint: "الاعتراضات دي بتتحول لـ FAQs ورسائل بتطمّن العميل.",
        placeholder: "مثلًا: الأكل الصحي طعمه وحش، السعر غالي، خايف يدفع شهر ومايكملش",
      },
    ],
  },
  {
    id: "competitors",
    title: "المنافسين والبدائل",
    shortTitle: "المنافسين",
    description: "العميل دايمًا بيقارن. عرّفنا هو بيقارنك بمين.",
    why: "مش لازم تعرف كل المنافسين. اكتب اللي تعرفه، والـ Prompt هيطلب من الـ AI يحدد الناقص بدل ما يخترع معلومات.",
    fields: [
      {
        id: "currentAlternatives", num: 0, label: "إيه الحلول أو المنتجات اللي الجمهور بيستخدمها حاليًا لحل المشكلة؟", type: "textarea", required: true,
        placeholder: "مثلًا: بيطبخ بنفسه في الويك إند، بيطلب من تطبيقات الدليفري، بيروح لأخصائي تغذية",
      },
      { id: "directCompetitors", num: 0, label: "مين المنافسين المباشرين؟", type: "textarea", required: true, placeholder: "أسماء براندات أو أنواع بزنس بتقدم نفس الخدمة" },
      {
        id: "differentiation", num: 0, label: "إيه اللي بيميز منتجك عن البدائل والمنافسين؟", type: "textarea", required: true,
        placeholder: "مثلًا: الوحيدين اللي بيسمحوا تبدّل الوجبة لحد الساعة ١٠ بالليل",
      },
    ],
  },
  {
    id: "pricing",
    title: "السعر والعروض",
    shortTitle: "السعر والعروض",
    description: "تفاصيل السعر والعروض والضمانات اللي بتسهّل قرار الشراء.",
    why: "السعر لوحده مش كفاية. طريقة عرضه، والتقسيط، والضمان بيفرقوا جدًا في الـ Conversion.",
    fields: [
      { id: "price", num: 0, label: "سعر المنتج أو الخدمة", type: "text", required: true, placeholder: "مثلًا: 1,850 جنيه للأسبوع (٥ أيام × وجبتين)" },
      { id: "offers", num: 0, label: "هل فيه عروض أو خصومات حاليًا؟", type: "textarea", required: true, rows: 3, placeholder: "مثلًا: خصم 15% على أول اشتراك شهري" },
      { id: "paymentPlans", num: 0, label: "هل فيه أنظمة دفع أو تقسيط أو باقات مختلفة؟", type: "textarea", required: true, rows: 3, placeholder: "مثلًا: باقة أسبوعية وشهرية، دفع كاش أو InstaPay أو فيزا" },
      { id: "guarantee", num: 0, label: "هل فيه ضمان أو إمكانية استرجاع؟", type: "textarea", required: true, rows: 3, placeholder: "مثلًا: لو أول وجبة ماعجبتكش بنرجعلك فلوس اليوم ده" },
    ],
  },
  {
    id: "goals",
    title: "هدف المحتوى والتسويق",
    shortTitle: "الهدف والقنوات",
    description: "عايز المحتوى يعمل إيه بالظبط، وهيتنشر فين.",
    why: "الهدف والمنصة بيحددوا شكل الكلام: إعلان TikTok غير صفحة Landing Page غير بوست Facebook.",
    fields: [
      {
        id: "goals", num: 0, label: "إيه الهدف الأساسي من المحتوى؟", type: "multiselect", required: true,
        options: ["زيادة المبيعات", "جمع Leads", "زيادة الوعي بالبراند", "توجيه الناس لموقع أو متجر", "زيادة الرسائل والاستفسارات"],
        hint: "تقدر تختار أكتر من هدف.",
      },
      {
        id: "cta", num: 0, label: "إيه الإجراء المطلوب من العميل بعد ما يشوف المحتوى؟ (CTA)", type: "textarea", required: true, rows: 3,
        placeholder: "مثلًا: يبعت رسالة على WhatsApp عشان يحجز أول أسبوع",
      },
      {
        id: "platforms", num: 0, label: "إيه المنصة أو المكان اللي هيتنشر عليه المحتوى؟", type: "multiselect", required: true,
        options: ["Website / Landing Page", "Facebook", "Instagram", "TikTok", "Google Ads", "Other"],
        otherOption: "Other",
        otherPlaceholder: "اكتب المنصة: مثلًا Snapchat، LinkedIn، YouTube، محل…",
      },
      {
        id: "contactMethod", num: 0, label: "كيفية التواصل أو طلب المنتج", type: "textarea", required: true, rows: 3,
        placeholder: "مثلًا: WhatsApp، Website، Phone، Direct Messages",
      },
    ],
  },
];

export const ALL_FIELDS: Field[] = SECTIONS.flatMap((s) => s.fields);
// Question numbers follow the order above, so adding or moving a question renumbers the rest.
ALL_FIELDS.forEach((f, i) => { f.num = i + 1; });
export const TOTAL_QUESTIONS = ALL_FIELDS.length;

/** Display value of a field, replacing the "other" option with what the user typed. */
export function answerText(answers: Answers, id: string, sep = "، "): string {
  const v = answers[id];
  const f = FIELD_BY_ID[id];
  if (Array.isArray(v)) {
    const other = ((answers[id + "Other"] as string) ?? "").trim();
    return v.map((x) => (f?.otherOption && x === f.otherOption && other ? other : x)).join(sep);
  }
  return ((v as string) ?? "").trim();
}
export const FIELD_BY_ID: Record<string, Field> = Object.fromEntries(ALL_FIELDS.map((f) => [f.id, f]));

export function isFilled(v: string | string[] | undefined): boolean {
  if (Array.isArray(v)) return v.length > 0;
  return !!v && v.trim().length > 0;
}

export function sectionErrors(section: Section, answers: Answers): string[] {
  const errs: string[] = [];
  for (const f of section.fields) {
    if (f.required && !isFilled(answers[f.id])) errs.push(f.id);
    if (f.otherOption && Array.isArray(answers[f.id]) && (answers[f.id] as string[]).includes(f.otherOption) && !isFilled(answers[f.id + "Other"])) {
      errs.push(f.id + "Other");
    }
  }
  return errs;
}

/** Hypothetical business used as a demo brief. Clearly labelled as an example in the UI. */
export const SAMPLE_BRAND = "ركوة";
export const SAMPLE_ANSWERS: Answers = {
  brandName: "ركوة (Rakwa Coffee)",
  productName: "اشتراك شهري في قهوة Specialty طازة التحميص",
  productDescription:
    "اشتراك شهري بيوصلك فيه كل شهر 2 كيس قهوة Specialty (كل كيس 250 جرام) من محاصيل مختلفة (إثيوبيا، كولومبيا، البرازيل، كينيا). القهوة بتتحمص في معملنا في القاهرة قبل الشحن بـ 48 ساعة بالكتير، وتاريخ التحميص مكتوب على كل كيس. تقدر تختار البن حبوب أو مطحون حسب طريقة التحضير (V60، فرنش بريس، إسبريسو، كنكة). كل شحنة معاها كارت فيه نوتات الطعم وطريقة تحضير مقترحة بالمقادير.",
  keyFeatures:
    "تحميص طازة قبل الشحن بـ 48 ساعة بالكتير\nطحن مخصوص حسب أداة التحضير بتاعتك\nمحصول جديد كل شهر عشان تجرّب طعم مختلف\nكارت تحضير بالمقادير مع كل شحنة\nتقدر توقف أو تأجل الاشتراك في أي وقت من الموقع",
  mustHaveFeatures: "قهوة طازة بتاريخ تحميص واضح، طعم ثابت ومن غير مرارة محروقة، توصيل في معاد معروف، وسعر مفهوم من غير رسوم مخفية",
  howToUse:
    "1. تختار الباقة (كيس أو كيسين في الشهر)\n2. تحدد أداة التحضير عشان نطحنلك صح، أو تختار حبوب\n3. الشحنة توصلك أول كل شهر\n4. تحضّر القهوة باتباع الكارت اللي جوه الشحنة\n5. تقيّم المحصول من الموقع عشان نظبط ترشيحات الشهر الجاي",
  targetAudience:
    "محبي القهوة اللي بيحضّروها في البيت أو المكتب: موظفين، فريلانسرز، وطلبة دراسات عليا. ناس بدأت تهتم بالقهوة المختصة بعد ما جربوها في الكافيهات، وعايزين نفس الجودة في البيت بتكلفة أقل من الكافيه يوميًا.",
  ageRange: ["25–34", "35–44"],
  location: "مصر، والتركيز على القاهرة الكبرى والإسكندرية (التوصيل متاح لكل المحافظات)",
  brandLanguage: ["عامية مصرية"],
  brandLanguageOther: "",
  purchasingPower: "متوسط إلى فوق المتوسط",
  audienceNeeds:
    "قهوة طازة وجودتها ثابتة، تجربة طعوم جديدة من غير مخاطرة، توفير فلوس الكافيه اليومي، ومعرفة إزاي يحضّر القهوة صح",
  mainProblem:
    "القهوة اللي بيلاقيها في السوبر ماركت قديمة ومش معروف تاريخ تحميصها وطعمها مر، والكافيهات المختصة غالية لو هيشرب كل يوم. ولما بيشتري بن مختص لوحده بيحتار يختار إيه، وساعات بيطحنه غلط فالطعم بيبوظ.",
  desiredOutcome:
    "يشرب كل يوم في البيت قهوة طعمها زي الكافيه أو أحسن، بتكلفة أقل، ويستمتع بتجربة محاصيل جديدة ويتعلم يحضّرها صح من غير مجهود في البحث والاختيار",
  objections:
    "سعر الاشتراك أغلى من البن العادي\nخايف المحصول مايعجبوش ويكون دفع على الفاضي\nمش متأكد إنه هيعرف يحضّرها صح\nخايف من الالتزام باشتراك شهري ومايعرفش يلغيه\nقلقان إن القهوة توصل متأخر أو مش طازة",
  currentAlternatives:
    "بن من السوبر ماركت، محلات البن التقليدية (بن محوج أو تركي)، قهوة سريعة التحضير، كبسولات، أو شرب القهوة من الكافيهات المختصة",
  directCompetitors:
    "محامص قهوة مختصة صغيرة في القاهرة بتبيع أونلاين بالكيس، وصفحات على Instagram بتبيع بن مستورد، وكافيهات مختصة بتبيع بن معبأ جوه الفرع",
  differentiation:
    "معظم المنافسين بيبيعوا بالكيس، إحنا اشتراك بيختارلك محصول جديد كل شهر ومعاه كارت تحضير. الطحن بيكون مخصوص لأداة التحضير، وتاريخ التحميص دايمًا قبل الشحن بـ 48 ساعة. والإيقاف أو التأجيل بضغطة من الموقع من غير ما تكلم حد.",
  price: "باقة كيس واحد: 650 جنيه في الشهر. باقة كيسين: 1,200 جنيه في الشهر. الشحن مجاني داخل القاهرة والجيزة، و60 جنيه لباقي المحافظات.",
  offers: "أول شهر بخصم 20% لأي مشترك جديد، وكوب سيراميك هدية مع الاشتراك لمدة 3 شهور",
  paymentPlans: "اشتراك شهري متجدد، أو دفع مقدم لـ 3 شهور بخصم 10%. الدفع بالفيزا أو InstaPay أو كاش عند الاستلام لأول شحنة بس.",
  guarantee:
    "لو أول شحنة ماعجبتكش بنبدّلك المحصول بمحصول تاني مجانًا. تقدر تلغي الاشتراك في أي وقت قبل يوم 25 في الشهر من غير أي رسوم.",
  goals: ["زيادة المبيعات", "جمع Leads", "توجيه الناس لموقع أو متجر"],
  cta: "يدخل الموقع ويشترك في أول شهر بخصم 20%، أو يسيب رقمه عشان ياخد دليل مجاني لتحضير القهوة في البيت",
  platforms: ["Instagram", "Facebook", "TikTok", "Website / Landing Page"],
  platformsOther: "",
  contactMethod: "الاشتراك من الموقع، أو رسايل Instagram، أو WhatsApp لخدمة العملاء",
};
