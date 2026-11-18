#!/usr/bin/env bash
# Builds a single self-contained index.html (JS + CSS inlined).
set -e
cd "$(dirname "$0")"
npx tsc -p .
mkdir -p dist
npx esbuild src/main.tsx --bundle --minify --format=iife --jsx=automatic --define:process.env.NODE_ENV='"production"' --outfile=dist/app.js
npx tailwindcss -i src/index.css -o dist/app.css --minify
node -e '
const fs=require("fs");
const js=fs.readFileSync("dist/app.js","utf8").replace(/<\/script/gi,"<\\/script");
const css=fs.readFileSync("dist/app.css","utf8");
const html=`<title>Marketing Brief Builder</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>${css}</style>
<div id="root" dir="rtl" lang="ar"></div>
<script>document.documentElement.dir="rtl";document.documentElement.lang="ar";</script>
<script>${js}</script>
`;
fs.writeFileSync("dist/index.html",html);
console.log("bytes",html.length);
'
