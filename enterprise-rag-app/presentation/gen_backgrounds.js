// Generate the dark gradient background images used on title / section /
// closing slides (pptxgenjs has no native gradient fill).
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "assets");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const W = 1920, H = 1080;

const bgDark = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B1030"/>
      <stop offset="0.55" stop-color="#141B47"/>
      <stop offset="1" stop-color="#1B2559"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.82" cy="0.18" r="0.5">
      <stop offset="0" stop-color="#4C5BD4" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#4C5BD4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.1" cy="0.92" r="0.55">
      <stop offset="0" stop-color="#0EA5E9" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#0EA5E9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
</svg>`;

const bgSection = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0" stop-color="#141B47"/>
      <stop offset="1" stop-color="#26326F"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.5" r="0.6">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
</svg>`;

Promise.all([
  sharp(Buffer.from(bgDark)).png().toFile(path.join(OUT, "bg_dark.png")),
  sharp(Buffer.from(bgSection)).png().toFile(path.join(OUT, "bg_section.png")),
]).then(() => console.log("Wrote bg_dark.png and bg_section.png"));
