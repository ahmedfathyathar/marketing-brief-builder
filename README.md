# Marketing Brief Builder

أداة عربية بتحوّل معلومات البزنس بتاعك إلى Prompts جاهزة تستخدمها مع Claude أو ChatGPT أو Gemini.

اختار الأول إنت عايز تطلّع إيه، والأداة هتسألك الأسئلة اللي تخصه بس:

| الـ Prompt | بيطلّعلك إيه |
|---|---|
| **Brand Name** | 30 اقتراح اسم في 3 فئات، بالنطق والمعنى، وأحسن 5 مترتبين |
| **Logo** | Prompt لأدوات الصور عشان تطلّع لوجو بسيط ومميز (Symbol + Wordmark) |
| **Landing Page Prompt** | صفحة كاملة من الـ Hero لحد الـ Final CTA، مع FAQs بترد على اعتراضات العميل وتوصيات للموبايل |
| **Sales Copywriting Prompt** | 10 زوايا بيع، 10 Hooks، إعلانات طويلة وقصيرة، Captions، وCopies لكل منصة بأطر AIDA وPAS وFAB وBAB |

## مميزات

- واجهة عربية بالكامل (RTL) بلغة مصرية بسيطة.
- لو اخترت «اسم للبراند»، مش هيسألك عن اسم البزنس.
- كل اللي بتكتبه بيتحفظ أوتوماتيك في المتصفح، فمش هيضيع لو عملت Refresh أو قفلت الصفحة.
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
  data/questions.ts     الأسئلة والأقسام والمثال التجريبي (كل سؤال متعلّم بالـ Prompts اللي بيحتاجه)
  lib/prompts.ts        قوالب الـ Prompts الأربعة
  lib/storage.ts        الحفظ في المتصفح
  components/           Welcome · BriefForm · Review · Dashboard · PromptPanel
```

عشان تضيف سؤال أو تعدّله: `src/data/questions.ts`، وحدد في `for` هو تبع أنهي Prompt. الترقيم بيتعمل لوحده.
عشان تعدّل الـ Prompts: `src/lib/prompts.ts`.

## Tech

React · TypeScript · Tailwind CSS · Lucide icons · esbuild
