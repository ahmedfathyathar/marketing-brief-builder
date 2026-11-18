# Marketing Brief Builder

أداة عربية بتحوّل معلومات البزنس بتاعك إلى Prompts جاهزة تستخدمها مع Claude أو ChatGPT أو Gemini.

جاوب على 26 سؤال في 5 خطوات عن البزنس، والمنتج، والجمهور، والمنافسين، والسعر، وهدف المحتوى. وفي الآخر اختار الـ Prompt اللي محتاجه:

| الـ Prompt | بيطلّعلك إيه |
|---|---|
| **Marketing Strategy & Action Plan** | تحليل الجمهور والمنافسين، Personas، USP، Positioning، Funnel، Content Pillars، خطة 30 يوم، وKPIs |
| **Landing Page Prompt** | صفحة كاملة من الـ Hero لحد الـ Final CTA، مع FAQs بترد على اعتراضات العميل وتوصيات للموبايل |
| **Sales Copywriting Prompt** | 10 زوايا بيع، 10 Hooks، إعلانات طويلة وقصيرة، Captions، وCopies لكل منصة بأطر AIDA وPAS وFAB وBAB |

## مميزات

- واجهة عربية بالكامل (RTL) بلغة مصرية بسيطة.
- الإجابات بتتحفظ في المتصفح، فمش هتضيع لو قفلت الصفحة.
- الـ Prompts مابتخترعش معلومات. أي حاجة ناقصة الـ AI بيتطلب منه يحددها ويسأل عنها بدل ما يفترضها.
- تقدر تختار لغة الكتابة للجمهور (عامية، فصحى، English، أو مزيج)، ولغة رد الـ AI لوحدها.
- مفيش Backend ولا API Key. كل حاجة بتحصل على جهازك.

## التشغيل

```bash
npm install
npm run build      # بيطلّع dist/index.html ملف واحد فيه كل حاجة
```

افتح `dist/index.html` في المتصفح.

## هيكل المشروع

```
src/
  data/questions.ts     الأسئلة والأقسام والمثال التجريبي
  lib/prompts.ts        قوالب الـ Prompts التلاتة
  lib/storage.ts        الحفظ في المتصفح
  components/           Welcome · BriefForm · Review · Dashboard · PromptPanel
```

عشان تضيف سؤال أو تعدّله: `src/data/questions.ts`. الترقيم بيتعمل لوحده.
عشان تعدّل الـ Prompts: `src/lib/prompts.ts`.

## Tech

React · TypeScript · Tailwind CSS · Lucide icons · esbuild
