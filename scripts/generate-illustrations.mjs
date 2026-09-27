/**
 * Generates the original vector illustrations used for articles 11–20, plus
 * the fallback image and the square logo. Every image is drawn from simple
 * shapes in code, so there are no third-party assets and no licensing questions.
 *
 *   node scripts/generate-illustrations.mjs          # write all images
 *   node scripts/generate-illustrations.mjs --only live-kirtan
 *
 * Output: public/images/articles/<name>.jpg (1376×768), public/images/fallback.jpg,
 * public/logo.png (512×512).
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1376;
const H = 768;
const OUT = path.join(process.cwd(), "public", "images", "articles");

const C = {
  night: "#141934",
  indigo: "#1f2750",
  dusk: "#3a3566",
  plum: "#6b4a6e",
  saffron: "#e8963a",
  amber: "#f2b35a",
  goldLight: "#f6d488",
  gold: "#dca544",
  goldDark: "#a8742a",
  cream: "#f4ecdc",
  paper: "#efe5d1",
  marble: "#ebe5d8",
  marbleShade: "#cbc2af",
  marbleDeep: "#a99f8b",
  green: "#5d7b5b",
  greenDark: "#3d5641",
  teal: "#3f6f78",
  maroon: "#8a3b2e",
  terracotta: "#b8643a",
  wood: "#7a4a2a",
  woodDark: "#553220",
  ink: "#26242a",
};

/* ------------------------------------------------------------------ helpers */

const defs = `
  <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.night}"/>
    <stop offset="0.55" stop-color="${C.indigo}"/>
    <stop offset="0.82" stop-color="${C.plum}"/>
    <stop offset="1" stop-color="${C.saffron}"/>
  </linearGradient>
  <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2b3160"/>
    <stop offset="0.5" stop-color="#6d5a80"/>
    <stop offset="0.8" stop-color="#e59a5a"/>
    <stop offset="1" stop-color="#f6c986"/>
  </linearGradient>
  <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9fb8c9"/>
    <stop offset="0.7" stop-color="#e6ddc9"/>
    <stop offset="1" stop-color="#f3e3c2"/>
  </linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3b3a63"/>
    <stop offset="0.35" stop-color="#1d2449"/>
    <stop offset="1" stop-color="#10142b"/>
  </linearGradient>
  <linearGradient id="waterDay" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8fa9b4"/>
    <stop offset="1" stop-color="#4f7480"/>
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.goldLight}"/>
    <stop offset="0.55" stop-color="${C.gold}"/>
    <stop offset="1" stop-color="${C.goldDark}"/>
  </linearGradient>
  <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.goldLight}"/>
    <stop offset="1" stop-color="${C.goldDark}"/>
  </linearGradient>
  <linearGradient id="marbleV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.marble}"/>
    <stop offset="1" stop-color="${C.marbleShade}"/>
  </linearGradient>
  <radialGradient id="glow">
    <stop offset="0" stop-color="#ffe2a1" stop-opacity="0.95"/>
    <stop offset="0.35" stop-color="#f7b458" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#f7b458" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="softLight" cx="0.5" cy="0.35" r="0.7">
    <stop offset="0" stop-color="#fff3d6" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#fff3d6" stop-opacity="0"/>
  </radialGradient>
  <clipPath id="frame"><rect x="26" y="26" width="${W - 52}" height="${H - 52}" rx="4"/></clipPath>
`;

function svgDoc(body, extraDefs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${defs}${extraDefs}</defs>
  <rect width="${W}" height="${H}" fill="${C.cream}"/>
  <g clip-path="url(#frame)">${body}</g>
  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" rx="4" fill="none" stroke="#d9ccb2" stroke-width="2"/>
</svg>`;
}

/** Deterministic pseudo-random numbers so images are reproducible. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function stars(seed, count, maxY) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = 30 + r() * (W - 60);
    const y = 30 + r() * (maxY - 30);
    const size = r() < 0.12 ? 1.8 : 1 + r() * 0.6;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="#f7ecd2" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
  }
  return out;
}

function treeLine(y, seed, color, height = 40) {
  const r = rng(seed);
  let d = `M0 ${y + 10}`;
  for (let x = 0; x <= W; x += 22 + r() * 30) {
    const h = height * (0.35 + r() * 0.75);
    d += ` Q${(x + 12).toFixed(0)} ${(y - h).toFixed(0)} ${(x + 26).toFixed(0)} ${(y - h * 0.4).toFixed(0)}`;
  }
  d += ` L${W} ${y + 10} Z`;
  return `<path d="${d}" fill="${color}"/>`;
}

function glowAt(x, y, r, opacity = 1) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#glow)" opacity="${opacity}"/>`;
}

/** Small clay oil lamp (diya) with flame. */
function diya(x, y, s = 1, withGlow = true) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${withGlow ? `<circle cx="0" cy="-20" r="46" fill="url(#glow)" opacity="0.85"/>` : ""}
    <path d="M-22 -4 Q0 16 22 -4 L18 -8 Q0 2 -18 -8 Z" fill="${C.terracotta}"/>
    <path d="M-22 -4 Q0 -12 22 -4 Q0 4 -22 -4 Z" fill="#8f4a2a"/>
    <path d="M14 -9 L24 -12 L20 -6 Z" fill="${C.terracotta}"/>
    <path d="M22 -12 Q15 -24 22 -34 Q29 -24 22 -12 Z" fill="#ffd27a"/>
    <path d="M22 -14 Q19 -21 22 -27 Q25 -21 22 -14 Z" fill="#fff4cf"/>
  </g>`;
}

/** Stylised gilded shrine. Generic, not an architectural record. */
function shrine(cx, baseY, s = 1) {
  const kiosk = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">
      <rect x="-2" y="-26" width="4" height="26" fill="${C.goldDark}"/>
      <rect x="-12" y="-26" width="3" height="26" fill="${C.goldDark}"/>
      <rect x="9" y="-26" width="3" height="26" fill="${C.goldDark}"/>
      <rect x="-15" y="-30" width="30" height="5" fill="url(#goldV)"/>
      <path d="M-14 -30 Q-15 -48 0 -58 Q15 -48 14 -30 Z" fill="url(#gold)"/>
      <line x1="0" y1="-58" x2="0" y2="-70" stroke="${C.gold}" stroke-width="2"/>
      <circle cx="0" cy="-70" r="2.5" fill="${C.goldLight}"/>
    </g>`;
  let arches = "";
  for (let i = 0; i < 7; i++) {
    const x = -105 + i * 35;
    arches += `<path d="M${x} 0 L${x} -34 Q${x + 11} -52 ${x + 22} -34 L${x + 22} 0 Z" fill="${C.goldDark}" opacity="0.75"/>`;
  }
  let upperArches = "";
  for (let i = 0; i < 5; i++) {
    const x = -78 + i * 34;
    upperArches += `<path d="M${x} -82 L${x} -104 Q${x + 11} -118 ${x + 22} -104 L${x + 22} -82 Z" fill="${C.goldDark}" opacity="0.7"/>`;
  }
  let fluting = "";
  for (let i = -3; i <= 3; i++) {
    fluting += `<path d="M${i * 12} -150 Q${i * 9} -200 0 -228" stroke="${C.goldDark}" stroke-width="1.6" fill="none" opacity="0.55"/>`;
  }
  return `<g transform="translate(${cx} ${baseY}) scale(${s})">
    <rect x="-150" y="-8" width="300" height="14" fill="${C.marble}"/>
    <rect x="-128" y="-72" width="256" height="66" fill="url(#gold)"/>
    <g transform="translate(0 -8)">${arches}</g>
    <rect x="-132" y="-80" width="264" height="10" fill="${C.goldLight}"/>
    <rect x="-100" y="-122" width="200" height="44" fill="url(#gold)"/>
    ${upperArches}
    <rect x="-104" y="-128" width="208" height="8" fill="${C.goldLight}"/>
    <rect x="-44" y="-150" width="88" height="24" fill="url(#goldV)"/>
    <path d="M-50 -150 Q-68 -200 0 -232 Q68 -200 50 -150 Z" fill="url(#gold)"/>
    ${fluting}
    <path d="M-56 -150 Q-40 -160 -28 -150 Q-14 -160 0 -150 Q14 -160 28 -150 Q40 -160 56 -150 Z" fill="${C.goldLight}"/>
    <line x1="0" y1="-232" x2="0" y2="-258" stroke="${C.gold}" stroke-width="3"/>
    <circle cx="0" cy="-250" r="5" fill="${C.goldLight}"/>
    ${kiosk(-116, -128, 0.9)}${kiosk(116, -128, 0.9)}${kiosk(-70, -128, 0.7)}${kiosk(70, -128, 0.7)}
  </g>`;
}

function ripples(seed, y0, y1, color = "#cfd6f0", opacity = 0.18, count = 60) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const y = y0 + r() * (y1 - y0);
    const x = 30 + r() * (W - 60);
    const len = 20 + r() * 90 * ((y - y0) / (y1 - y0) + 0.3);
    out += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + len).toFixed(0)}" y2="${y.toFixed(0)}" stroke="${color}" stroke-width="${(1 + r() * 1.5).toFixed(1)}" stroke-linecap="round" opacity="${opacity}"/>`;
  }
  return out;
}

/* ------------------------------------------------------------------ scenes */

const scenes = {
  /* 11: shrine in the middle of its pool, causeway, reflection */
  "golden-temple-names": () => {
    const horizon = 420;
    const building = shrine(760, 418, 1.05);
    return svgDoc(`
      <rect width="${W}" height="${horizon}" fill="url(#skyDawn)"/>
      ${stars(11, 70, 220)}
      ${treeLine(horizon - 4, 3, "#3c3452", 36)}
      <rect x="0" y="${horizon - 30}" width="${W}" height="34" fill="${C.marbleShade}"/>
      ${Array.from({ length: 22 }, (_, i) => `<path d="M${40 + i * 62} ${horizon - 4} L${40 + i * 62} ${horizon - 20} Q${56 + i * 62} ${horizon - 32} ${72 + i * 62} ${horizon - 20} L${72 + i * 62} ${horizon - 4} Z" fill="${C.marbleDeep}" opacity="0.7"/>`).join("")}
      <rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#water)"/>
      <g transform="translate(0 ${horizon * 2 + 6}) scale(1 -1)" opacity="0.32">${building}</g>
      ${ripples(5, horizon + 10, H - 30)}
      ${glowAt(760, 300, 260, 0.35)}
      ${building}
      <path d="M26 ${horizon + 118} L610 ${horizon + 4} L626 ${horizon + 10} L26 ${horizon + 150} Z" fill="${C.marble}"/>
      <path d="M26 ${horizon + 150} L626 ${horizon + 10} L626 ${horizon + 16} L26 ${horizon + 162} Z" fill="${C.marbleDeep}"/>
      ${Array.from({ length: 10 }, (_, i) => {
        const t = i / 9;
        const x = 60 + t * 540;
        const y = horizon + 112 - t * 106;
        return glowAt(x, y - 6, 22 - t * 12, 0.9) + `<circle cx="${x}" cy="${y - 6}" r="${3 - t * 1.6}" fill="#ffe4a8"/>`;
      }).join("")}
      <path d="M26 ${H - 90} L${W} ${H - 150} L${W} ${H} L26 ${H} Z" fill="${C.marble}"/>
      <path d="M26 ${H - 90} L${W} ${H - 150} L${W} ${H - 140} L26 ${H - 80} Z" fill="${C.marbleShade}"/>
      ${Array.from({ length: 9 }, (_, i) => `<line x1="${110 + i * 150}" y1="${H - 90 - i * 7}" x2="${60 + i * 160}" y2="${H}" stroke="${C.marbleShade}" stroke-width="2"/>`).join("")}
    `);
  },

  /* 12: fluted gilded dome above marble with floral inlay */
  "golden-temple-architecture": () => {
    let flutes = "";
    for (let i = -6; i <= 6; i++) {
      flutes += `<path d="M${688 + i * 30} 400 Q${688 + i * 22} 230 688 110" stroke="${C.goldDark}" stroke-width="2.4" fill="none" opacity="0.5"/>`;
    }
    let petals = "";
    for (let i = -7; i <= 7; i++) {
      const x = 688 + i * 30;
      petals += `<path d="M${x - 16} 410 Q${x} 370 ${x + 16} 410 Z" fill="${C.goldLight}" stroke="${C.goldDark}" stroke-width="1.5"/>`;
    }
    const flower = (x, y, k, color) => `<g transform="translate(${x} ${y}) scale(${k})">
      ${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="-13" rx="6" ry="12" fill="${color}" transform="rotate(${a})"/>`).join("")}
      <circle r="5" fill="${C.gold}"/></g>`;
    const leaf = (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="13" fill="${C.greenDark}" transform="rotate(${a} ${x} ${y})"/>`;
    let panels = "";
    for (let i = 0; i < 4; i++) {
      const x = 130 + i * 300;
      panels += `
        <path d="M${x} 740 L${x} 540 Q${x + 110} 470 ${x + 220} 540 L${x + 220} 740 Z" fill="${C.marble}" stroke="${C.marbleDeep}" stroke-width="3"/>
        <path d="M${x + 110} 725 C${x + 70} 670 ${x + 150} 630 ${x + 110} 570" stroke="${C.greenDark}" stroke-width="3" fill="none"/>
        ${leaf(x + 92, 690, -40)}${leaf(x + 128, 650, 40)}${leaf(x + 96, 610, -35)}
        ${flower(x + 110, 568, 1.2, C.maroon)}${flower(x + 70, 660, 0.8, "#b85c3c")}${flower(x + 150, 700, 0.8, "#3c4a6b")}
      `;
    }
    return svgDoc(`
      <rect width="${W}" height="480" fill="url(#skyDawn)"/>
      ${stars(12, 40, 200)}
      ${glowAt(688, 250, 360, 0.3)}
      <path d="M470 400 Q420 250 688 90 Q956 250 906 400 Z" fill="url(#gold)"/>
      ${flutes}
      <line x1="688" y1="90" x2="688" y2="40" stroke="${C.gold}" stroke-width="7"/>
      <circle cx="688" cy="58" r="11" fill="${C.goldLight}"/>
      <circle cx="688" cy="34" r="7" fill="${C.goldLight}"/>
      ${petals}
      <rect x="420" y="408" width="536" height="30" fill="url(#goldV)"/>
      ${Array.from({ length: 18 }, (_, i) => `<circle cx="${436 + i * 30}" cy="423" r="6" fill="${C.goldDark}" opacity="0.6"/>`).join("")}
      <path d="M150 440 L190 470 L230 440 Z" fill="url(#gold)"/><path d="M1146 440 L1186 470 L1226 440 Z" fill="url(#gold)"/>
      <rect x="26" y="470" width="${W}" height="${H}" fill="${C.marbleShade}"/>
      <rect x="26" y="470" width="${W}" height="30" fill="${C.marbleDeep}"/>
      ${Array.from({ length: 30 }, (_, i) => `<path d="M${40 + i * 46} 485 l10 -8 l10 8 l-10 8 Z" fill="${C.maroon}" opacity="0.8"/>`).join("")}
      ${panels}
    `);
  },

  /* 13: hilltop fort at dusk with lamps along the ramparts */
  "bandi-chhor-divas": () => {
    let crenels = "";
    for (let x = 300; x < 1120; x += 22) crenels += `<rect x="${x}" y="286" width="12" height="14" fill="#3b2c3c"/>`;
    let rampartLamps = "";
    for (let x = 310; x < 1110; x += 44) rampartLamps += glowAt(x, 296, 26, 0.9) + `<circle cx="${x}" cy="296" r="3.2" fill="#ffe7ad"/>`;
    const path = [
      [1180, 740], [1060, 690], [920, 650], [1010, 600], [880, 560], [760, 520], [860, 480], [720, 440],
    ];
    let pathLamps = "";
    let d = `M${path[0][0]} ${path[0][1]}`;
    path.slice(1).forEach(([x, y]) => (d += ` L${x} ${y}`));
    for (let i = 0; i < path.length - 1; i++) {
      const [x1, y1] = path[i];
      const [x2, y2] = path[i + 1];
      for (let t = 0; t < 1; t += 0.34) {
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        pathLamps += glowAt(x, y - 4, 18, 0.9) + `<circle cx="${x}" cy="${y - 4}" r="2.6" fill="#ffe7ad"/>`;
      }
    }
    const tower = (x, h) => `<rect x="${x - 34}" y="${300 - h}" width="68" height="${h + 80}" rx="6" fill="#4a3548"/>
      ${Array.from({ length: 4 }, (_, i) => `<rect x="${x - 34 + i * 18}" y="${300 - h - 12}" width="12" height="12" fill="#4a3548"/>`).join("")}
      <path d="M${x - 10} ${340 - h} L${x - 10} ${320 - h} Q${x} ${306 - h} ${x + 10} ${320 - h} L${x + 10} ${340 - h} Z" fill="#f2b35a" opacity="0.9"/>`;
    return svgDoc(`
      <rect width="${W}" height="${H}" fill="url(#skyNight)"/>
      ${stars(13, 110, 260)}
      ${glowAt(688, 520, 520, 0.35)}
      <path d="M26 520 Q260 330 520 350 Q700 320 900 340 Q1150 330 ${W} 470 L${W} ${H} L26 ${H} Z" fill="#35263a"/>
      <rect x="290" y="300" width="840" height="110" fill="#43304a"/>
      ${crenels}
      ${tower(330, 40)}${tower(560, 60)}${tower(840, 50)}${tower(1090, 36)}
      <g transform="translate(700 236)">
        <rect x="-26" y="0" width="52" height="30" fill="#4a3548"/>
        <path d="M-30 0 Q-28 -32 0 -44 Q28 -32 30 0 Z" fill="#5a4258"/>
      </g>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${380 + i * 80} 380 L${380 + i * 80} 360 Q${392 + i * 80} 346 ${404 + i * 80} 360 L${404 + i * 80} 380 Z" fill="#f2b35a" opacity="0.75"/>`).join("")}
      ${rampartLamps}
      <path d="M26 620 Q300 540 620 600 Q900 650 ${W} 560 L${W} ${H} L26 ${H} Z" fill="#231a2b"/>
      <path d="${d}" stroke="#6a4f5c" stroke-width="16" fill="none" stroke-linejoin="round" opacity="0.8"/>
      ${pathLamps}
      ${treeLine(H - 20, 9, "#171322", 60)}
    `);
  },

  /* 14: row of diyas along the edge of a pool, reflected in water */
  "bandi-chhor-diwali": () => {
    const horizon = 300;
    let lamps = "";
    let reflections = "";
    for (let i = 0; i < 11; i++) {
      const t = i / 10;
      const x = 120 + t * 1140;
      const y = 560 - t * 150;
      const s = 1.5 - t * 0.7;
      reflections += `<ellipse cx="${x + 22 * s}" cy="${y + 90 - t * 40}" rx="${10 * s}" ry="${60 * s}" fill="#f7b458" opacity="0.28"/>`;
      lamps += diya(x, y, s);
    }
    return svgDoc(`
      <rect width="${W}" height="${horizon}" fill="url(#skyNight)"/>
      ${stars(14, 90, 240)}
      ${treeLine(horizon, 21, "#24203a", 30)}
      <rect x="560" y="${horizon - 40}" width="120" height="40" fill="#caa25a" opacity="0.6"/>
      <path d="M590 ${horizon - 40} Q620 ${horizon - 80} 650 ${horizon - 40} Z" fill="#caa25a" opacity="0.6"/>
      ${glowAt(620, horizon - 30, 120, 0.5)}
      <rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#water)"/>
      ${ripples(15, horizon + 10, H - 40, "#d6d9f2", 0.16, 70)}
      ${reflections}
      <path d="M26 600 L${W} 440 L${W} ${H} L26 ${H} Z" fill="${C.marbleShade}"/>
      <path d="M26 580 L${W} 424 L${W} 444 L26 604 Z" fill="${C.marble}"/>
      ${Array.from({ length: 12 }, (_, i) => `<line x1="${60 + i * 120}" y1="${596 - i * 16.5}" x2="${20 + i * 130}" y2="${H}" stroke="${C.marbleDeep}" stroke-width="2" opacity="0.6"/>`).join("")}
      ${lamps}
    `);
  },

  /* 15: arch framing a row of lamps on a low wall at night */
  "bandi-chhor-english": () => {
    let lamps = "";
    for (let i = 0; i < 9; i++) lamps += diya(420 + i * 64, 520, 1.1);
    return svgDoc(`
      <rect width="${W}" height="${H}" fill="#e7dcc6"/>
      <rect x="26" y="${H - 150}" width="${W}" height="150" fill="#d8caae"/>
      <path d="M340 ${H - 150} L340 300 Q340 110 688 90 Q1036 110 1036 300 L1036 ${H - 150} Z" fill="url(#skyNight)"/>
      <g clip-path="url(#archClip)">${stars(15, 60, 400)}${treeLine(470, 31, "#1c1a33", 50)}</g>
      <rect x="340" y="470" width="696" height="${H - 150 - 470}" fill="#1c1a33"/>
      <path d="M300 ${H - 150} L300 300 Q300 70 688 50 Q1076 70 1076 300 L1076 ${H - 150} L1036 ${H - 150} L1036 300 Q1036 110 688 90 Q340 110 340 300 L340 ${H - 150} Z" fill="${C.marble}" stroke="${C.marbleDeep}" stroke-width="3"/>
      <path d="M300 300 Q300 70 688 50 Q1076 70 1076 300" stroke="${C.gold}" stroke-width="5" fill="none" opacity="0.7"/>
      <rect x="370" y="520" width="636" height="60" fill="${C.marbleShade}"/>
      <rect x="360" y="510" width="656" height="14" fill="${C.marble}"/>
      ${lamps}
      ${glowAt(688, 500, 380, 0.4)}
      <rect x="26" y="${H - 150}" width="${W}" height="8" fill="#c6b594"/>
      ${Array.from({ length: 10 }, (_, i) => `<line x1="${120 + i * 130}" y1="${H - 142}" x2="${40 + i * 150}" y2="${H}" stroke="#c6b594" stroke-width="2"/>`).join("")}
    `, `<clipPath id="archClip"><path d="M340 ${H - 150} L340 300 Q340 110 688 90 Q1036 110 1036 300 L1036 ${H - 150} Z"/></clipPath>`);
  },

  /* 16: white marble gurdwara with gilded dome, corner kiosks, pool */
  "historic-gurdwaras": () => {
    const g = (() => {
      const kiosk = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">
        <rect x="-14" y="-40" width="28" height="40" fill="${C.marble}" stroke="${C.marbleDeep}" stroke-width="2"/>
        <path d="M-7 0 L-7 -24 Q0 -34 7 -24 L7 0 Z" fill="${C.marbleDeep}"/>
        <path d="M-18 -40 Q-18 -66 0 -76 Q18 -66 18 -40 Z" fill="url(#gold)"/>
        <line x1="0" y1="-76" x2="0" y2="-90" stroke="${C.gold}" stroke-width="3"/></g>`;
      let arcade = "";
      for (let i = 0; i < 9; i++) {
        const x = -270 + i * 60;
        arcade += `<path d="M${x} 0 L${x} -60 Q${x + 20} -90 ${x + 40} -60 L${x + 40} 0 Z" fill="#b9ae98"/>`;
      }
      let upper = "";
      for (let i = 0; i < 5; i++) {
        const x = -140 + i * 60;
        upper += `<path d="M${x} -130 L${x} -170 Q${x + 20} -192 ${x + 40} -170 L${x + 40} -130 Z" fill="#b9ae98"/>`;
      }
      return `
        <rect x="-310" y="-110" width="620" height="110" fill="url(#marbleV)" stroke="${C.marbleDeep}" stroke-width="2"/>
        <g transform="translate(0 -6)">${arcade}</g>
        <rect x="-320" y="-120" width="640" height="12" fill="${C.marble}" stroke="${C.marbleDeep}" stroke-width="2"/>
        <rect x="-170" y="-200" width="340" height="82" fill="url(#marbleV)" stroke="${C.marbleDeep}" stroke-width="2"/>
        ${upper}
        <rect x="-178" y="-208" width="356" height="10" fill="${C.marble}" stroke="${C.marbleDeep}" stroke-width="2"/>
        <rect x="-60" y="-236" width="120" height="30" fill="${C.marble}" stroke="${C.marbleDeep}" stroke-width="2"/>
        <path d="M-72 -236 Q-96 -310 0 -350 Q96 -310 72 -236 Z" fill="url(#gold)"/>
        ${[-40, -20, 0, 20, 40].map((o) => `<path d="M${o * 1.6} -236 Q${o * 1.1} -300 0 -348" stroke="${C.goldDark}" stroke-width="2" fill="none" opacity="0.5"/>`).join("")}
        <line x1="0" y1="-350" x2="0" y2="-384" stroke="${C.gold}" stroke-width="4"/>
        <circle cx="0" cy="-372" r="6" fill="${C.goldLight}"/>
        ${kiosk(-300, -120, 1.2)}${kiosk(300, -120, 1.2)}${kiosk(-160, -208, 0.9)}${kiosk(160, -208, 0.9)}
      `;
    })();
    return svgDoc(`
      <rect width="${W}" height="${H}" fill="url(#skyDay)"/>
      <circle cx="1120" cy="150" r="56" fill="#fbe7b8" opacity="0.8"/>
      ${treeLine(470, 41, "#8ea17f", 60)}
      ${treeLine(476, 42, "#6f8a66", 40)}
      <line x1="1010" y1="470" x2="1010" y2="140" stroke="#6b6152" stroke-width="5"/>
      <path d="M1012 142 L1100 170 L1012 196 Z" fill="${C.saffron}"/>
      <g transform="translate(640 470)">${g}</g>
      <rect x="26" y="470" width="${W}" height="30" fill="${C.marble}"/>
      <rect x="120" y="500" width="1136" height="${H}" fill="url(#waterDay)"/>
      <g transform="translate(640 970) scale(1 -1)" opacity="0.25">${g}</g>
      ${ripples(16, 510, H - 30, "#e8eef0", 0.35, 40)}
      <path d="M26 500 L120 500 L120 ${H} L26 ${H} Z" fill="${C.marble}"/>
      <path d="M1256 500 L${W} 500 L${W} ${H} L1256 ${H} Z" fill="${C.marble}"/>
      <rect x="112" y="500" width="8" height="${H}" fill="${C.marbleShade}"/>
      <rect x="1256" y="500" width="8" height="${H}" fill="${C.marbleShade}"/>
    `);
  },

  /* 17: folded head scarves on a rack beside a foot-washing channel */
  "visiting-harmandir-sahib": () => {
    const scarfColors = ["#e8963a", "#d9822c", "#f0a54a", "#e38d34", "#cf7425"];
    let scarves = "";
    for (let shelf = 0; shelf < 3; shelf++) {
      for (let i = 0; i < 3; i++) {
        const x = 138 + i * 96;
        const baseY = 300 + shelf * 110;
        for (let k = 0; k < 4; k++) {
          const y = baseY - k * 12;
          const col = scarfColors[(i + k + shelf) % scarfColors.length];
          // A folded length of cloth: flat band with a folded-over end and a hem line.
          scarves += `<path d="M${x} ${y} L${x} ${y - 11} L${x + 80} ${y - 11} L${x + 84} ${y - 5} L${x + 80} ${y} Z" fill="${col}"/>
            <path d="M${x + 58} ${y - 11} L${x + 80} ${y - 11} L${x + 84} ${y - 5} L${x + 80} ${y} L${x + 58} ${y} Z" fill="#000" opacity="0.08"/>
            <line x1="${x + 3}" y1="${y - 2.5}" x2="${x + 78}" y2="${y - 2.5}" stroke="#fff4dc" stroke-width="1" opacity="0.55"/>`;
        }
      }
    }
    let waterLines = "";
    const r = rng(17);
    for (let i = 0; i < 40; i++) {
      const y = 590 + r() * 90;
      const x = 40 + r() * (W - 80);
      waterLines += `<path d="M${x} ${y} q12 -5 24 0 t24 0" stroke="#e6f1f2" stroke-width="2" fill="none" opacity="0.6"/>`;
    }
    return svgDoc(`
      <rect width="${W}" height="${H}" fill="#e9dcc3"/>
      <rect x="26" y="26" width="${W}" height="520" fill="#e4d4b6"/>
      <path d="M620 546 L620 220 Q620 90 830 80 Q1040 90 1040 220 L1040 546 Z" fill="#f7e6c0"/>
      <path d="M620 546 L620 220 Q620 90 830 80 Q1040 90 1040 220 L1040 546 Z" fill="url(#softLight)"/>
      <path d="M660 546 L660 230 Q660 130 830 120 Q1000 130 1000 230 L1000 546 Z" fill="url(#skyDay)" opacity="0.9"/>
      <path d="M760 546 L760 470 Q760 420 830 410 Q900 420 900 470 L900 546 Z" fill="${C.gold}" opacity="0.55"/>
      <path d="M580 546 L580 210 Q580 50 830 40 Q1080 50 1080 210 L1080 546 L1040 546 L1040 220 Q1040 90 830 80 Q620 90 620 220 L620 546 Z" fill="${C.marble}" stroke="${C.marbleDeep}" stroke-width="3"/>
      <rect x="1140" y="140" width="190" height="406" fill="#dccaa8"/>
      <rect x="110" y="170" width="330" height="380" fill="${C.woodDark}"/>
      <rect x="120" y="180" width="310" height="360" fill="${C.wood}"/>
      ${[0, 1, 2].map((s) => `<rect x="120" y="${304 + s * 110}" width="310" height="10" fill="${C.woodDark}"/>`).join("")}
      ${scarves}
      <rect x="26" y="546" width="${W}" height="${H}" fill="${C.marble}"/>
      <rect x="26" y="580" width="${W}" height="110" fill="${C.teal}"/>
      <rect x="26" y="580" width="${W}" height="110" fill="url(#waterDay)" opacity="0.7"/>
      <rect x="26" y="572" width="${W}" height="10" fill="${C.marbleShade}"/>
      <rect x="26" y="690" width="${W}" height="10" fill="${C.marbleShade}"/>
      ${waterLines}
      ${Array.from({ length: 12 }, (_, i) => `<line x1="${60 + i * 118}" y1="546" x2="${40 + i * 124}" y2="572" stroke="${C.marbleShade}" stroke-width="2"/>`).join("")}
    `);
  },

  /* 18: harmonium and tabla on a white sheet */
  "live-kirtan": () => {
    let keys = "";
    for (let i = 0; i < 24; i++) keys += `<rect x="${-236 + i * 19.6}" y="-8" width="18" height="46" rx="2" fill="#f7f2e6" stroke="#bdb39d" stroke-width="1"/>`;
    const blackIdx = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12, 14, 15, 17, 18, 19, 21, 22];
    let blacks = "";
    blackIdx.forEach((i) => (blacks += `<rect x="${-236 + i * 19.6 + 13}" y="-8" width="11" height="28" rx="2" fill="#222"/>`));
    let stops = "";
    for (let i = 0; i < 7; i++) stops += `<circle cx="${-190 + i * 64}" cy="-78" r="9" fill="${C.goldLight}" stroke="${C.goldDark}" stroke-width="2"/>`;
    const harmonium = `<g transform="translate(560 520)">
      <path d="M-270 -120 L250 -120 L290 -60 L-230 -60 Z" fill="#8a5431"/>
      ${Array.from({ length: 6 }, (_, i) => `<path d="M-262 ${-112 + i * 9} L256 ${-112 + i * 9}" stroke="#5a3520" stroke-width="2"/>`).join("")}
      <rect x="-260" y="-60" width="520" height="68" fill="${C.wood}"/>
      <rect x="-260" y="-100" width="520" height="44" fill="#91593a"/>
      ${stops}
      <rect x="-250" y="-14" width="500" height="58" fill="#4a2b1a"/>
      ${keys}${blacks}
      <rect x="-270" y="40" width="540" height="90" fill="${C.woodDark}"/>
      <rect x="-250" y="56" width="500" height="58" rx="4" fill="${C.wood}"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${-220 + i * 130} 70 q30 16 60 0 q30 -16 60 0" stroke="${C.goldDark}" stroke-width="3" fill="none" opacity="0.8"/>`).join("")}
    </g>`;
    const dayan = `<g transform="translate(1000 560)">
      <path d="M-70 0 L-58 -200 L58 -200 L70 0 Z" fill="#6d3f22"/>
      ${Array.from({ length: 10 }, (_, i) => `<line x1="${-64 + i * 14}" y1="-4" x2="${-54 + i * 12}" y2="-196" stroke="#f0e6d0" stroke-width="2" opacity="0.8"/>`).join("")}
      ${[-60, -8, 44].map((x) => `<rect x="${x}" y="-120" width="16" height="30" rx="4" fill="#5a3218"/>`).join("")}
      <ellipse cx="0" cy="-200" rx="60" ry="18" fill="#e6d5b3"/>
      <ellipse cx="0" cy="-200" rx="24" ry="7" fill="#222"/>
      <ellipse cx="0" cy="0" rx="70" ry="16" fill="#553118"/>
    </g>`;
    const bayan = `<g transform="translate(1180 570)">
      <path d="M-90 -110 Q-110 -20 -40 0 L40 0 Q110 -20 90 -110 Z" fill="#9aa0a6"/>
      <path d="M-90 -110 Q-110 -20 -40 0 L40 0 Q110 -20 90 -110 Z" fill="url(#softLight)"/>
      ${Array.from({ length: 12 }, (_, i) => `<line x1="${-86 + i * 15.6}" y1="-110" x2="${-40 + i * 7.3}" y2="-2" stroke="#e8dcc4" stroke-width="2" opacity="0.7"/>`).join("")}
      <ellipse cx="0" cy="-110" rx="90" ry="22" fill="#e6d5b3"/>
      <ellipse cx="-18" cy="-112" rx="26" ry="8" fill="#222"/>
    </g>`;
    return svgDoc(`
      <rect width="${W}" height="${H}" fill="#b98a5b"/>
      <rect x="26" y="26" width="${W}" height="400" fill="#c89a68"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${90 + i * 260} 400 L${90 + i * 260} 170 Q${170 + i * 260} 80 ${250 + i * 260} 170 L${250 + i * 260} 400 Z" fill="#a8764a"/>`).join("")}
      ${glowAt(688, 200, 520, 0.35)}
      <rect x="26" y="400" width="${W}" height="20" fill="#8f623d"/>
      <path d="M26 470 L${W} 430 L${W} ${H} L26 ${H} Z" fill="#9b6d45"/>
      <path d="M160 480 L1300 450 L1360 ${H} L60 ${H} Z" fill="#f6f1e5"/>
      <path d="M160 480 L1300 450 L1360 ${H} L60 ${H} Z" fill="url(#softLight)"/>
      ${Array.from({ length: 5 }, (_, i) => `<path d="M${200 + i * 240} 500 q60 60 20 250" stroke="#e3dbc8" stroke-width="3" fill="none"/>`).join("")}
      ${harmonium}
      ${dayan}
      ${bayan}
    `);
  },

  /* 19: seasonal wheel of the year */
  "sikh-festivals-guide": () => {
    const cx = 688;
    const cy = 384;
    const r1 = 150;
    const r2 = 270;
    const colors = ["#8fb07a", "#b5c56a", "#e8b04a", "#e8963a", "#d9782e", "#4f8c8c", "#3f6f78", "#6a8f6a", "#b86a3a", "#8a3b2e", "#4b5a86", "#6f7fb0"];
    const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    let segs = "";
    for (let i = 0; i < 12; i++) {
      const a0 = -Math.PI / 2 + (i * Math.PI) / 6 + 0.012;
      const a1 = -Math.PI / 2 + ((i + 1) * Math.PI) / 6 - 0.012;
      const [x0, y0] = pt(r2, a0);
      const [x1, y1] = pt(r2, a1);
      const [x2, y2] = pt(r1, a1);
      const [x3, y3] = pt(r1, a0);
      segs += `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r2} ${r2} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} A${r1} ${r1} 0 0 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z" fill="${colors[i]}"/>`;
    }
    const at = (i) => pt(335, -Math.PI / 2 + ((i + 0.5) * Math.PI) / 6);
    const sym = {
      wheat: ([x, y]) => `<g transform="translate(${x} ${y})" stroke="${C.gold}" stroke-width="3" fill="${C.goldLight}">
        <line x1="0" y1="30" x2="0" y2="-30"/><line x1="-12" y1="30" x2="-6" y2="-22"/><line x1="12" y1="30" x2="6" y2="-22"/>
        ${[-24, -12, 0].map((yy) => `<ellipse cx="-6" cy="${yy}" rx="4" ry="8" transform="rotate(-25 -6 ${yy})"/><ellipse cx="6" cy="${yy}" rx="4" ry="8" transform="rotate(25 6 ${yy})"/>`).join("")}
        <ellipse cx="0" cy="-34" rx="4" ry="8"/></g>`,
      sun: ([x, y]) => `<g transform="translate(${x} ${y})"><circle r="16" fill="${C.amber}"/>${Array.from({ length: 10 }, (_, k) => `<line x1="0" y1="-22" x2="0" y2="-32" stroke="${C.amber}" stroke-width="3" transform="rotate(${k * 36})"/>`).join("")}</g>`,
      rain: ([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-30 0 q0 -24 26 -22 q10 -18 30 -4 q20 0 18 20 Z" fill="#a9c1cc"/>${[-18, 0, 18].map((dx) => `<path d="M${dx} 10 q-4 10 0 14 q4 -4 0 -14" fill="#7fa6b5"/>`).join("")}</g>`,
      diya: ([x, y]) => diya(x - 20, y + 18, 1, true),
      kite: ([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 -30 L24 0 L0 30 L-24 0 Z" fill="${C.maroon}"/><path d="M0 -30 L0 30 M-24 0 L24 0" stroke="#f2e5c8" stroke-width="2"/><path d="M0 30 q10 14 -4 26 q-14 12 4 22" stroke="${C.cream}" stroke-width="2" fill="none"/></g>`,
      fire: ([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-20 20 L20 20" stroke="${C.wood}" stroke-width="6"/><path d="M0 16 Q-22 0 -6 -30 Q0 -12 8 -20 Q22 2 0 16 Z" fill="${C.saffron}"/><path d="M0 14 Q-8 4 0 -10 Q8 4 0 14 Z" fill="#ffd27a"/></g>`,
      drum: ([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-16 -18 L16 -18 L20 18 L-20 18 Z" fill="${C.wood}"/><ellipse cy="-18" rx="16" ry="5" fill="#e6d5b3"/></g>`,
      flower: ([x, y]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-12" rx="7" ry="12" fill="#f3c94f" transform="rotate(${a})"/>`).join("")}<circle r="6" fill="${C.saffron}"/></g>`,
    };
    const placement = [
      ["flower", 11], ["drum", 0], ["wheat", 1], ["sun", 3], ["rain", 5], ["diya", 7], ["fire", 9], ["kite", 10],
    ];
    return svgDoc(`
      <rect width="${W}" height="${H}" fill="${C.indigo}"/>
      ${stars(19, 80, H - 40)}
      <circle cx="${cx}" cy="${cy}" r="380" fill="${C.paper}" opacity="0.06"/>
      <circle cx="${cx}" cy="${cy}" r="${r2 + 18}" fill="${C.paper}"/>
      ${segs}
      <circle cx="${cx}" cy="${cy}" r="${r1 - 12}" fill="${C.paper}"/>
      <circle cx="${cx}" cy="${cy}" r="${r1 - 36}" fill="none" stroke="${C.saffron}" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="${r1 - 60}" fill="none" stroke="#c8b99a" stroke-width="2" stroke-dasharray="4 8"/>
      ${Array.from({ length: 12 }, (_, i) => {
        const [x, y] = pt(r1 - 36, -Math.PI / 2 + (i * Math.PI) / 6);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${C.saffron}"/>`;
      }).join("")}
      <circle cx="${cx}" cy="${cy}" r="18" fill="${C.saffron}"/>
      ${placement.map(([k, i]) => sym[k](at(i))).join("")}
    `);
  },

  /* 20: wall calendar with circled dates above a marigold garland */
  "sikh-dates-guide": () => {
    const cal = { x: 470, y: 120, w: 440, h: 440 };
    let grid = "";
    const circled = new Set([4, 12, 19, 27, 31]);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 7; col++) {
        const i = row * 7 + col;
        const x = cal.x + 30 + col * 56;
        const y = cal.y + 150 + row * 52;
        grid += `<rect x="${x}" y="${y}" width="48" height="44" fill="#faf5ea" stroke="#e0d5bf"/>
          <rect x="${x + 8}" y="${y + 9}" width="${10 + ((i * 7) % 3) * 4}" height="5" rx="2" fill="#8c8474"/>`;
        if (circled.has(i)) grid += `<ellipse cx="${x + 24}" cy="${y + 22}" rx="25" ry="21" fill="none" stroke="${C.maroon}" stroke-width="3" transform="rotate(-6 ${x + 24} ${y + 22})"/>`;
      }
    }
    let garland = "";
    for (let t = 0; t <= 1.0001; t += 1 / 26) {
      const x = 300 + t * 780;
      const y = 640 + Math.sin(t * Math.PI) * 60;
      const col = Math.round(t * 26) % 2 ? "#f0a02e" : "#e0781f";
      garland += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${col}"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${col}" stroke="#c96414" stroke-width="2" stroke-dasharray="3 3"/>`;
    }
    return svgDoc(`
      <rect width="${W}" height="${H}" fill="#eadcc2"/>
      <path d="M1000 26 L1350 26 L1350 600 L1150 600 Z" fill="#f7ecd3" opacity="0.6"/>
      <rect x="1030" y="80" width="260" height="360" fill="#f6e8c6" stroke="#cdb994" stroke-width="10"/>
      <line x1="1160" y1="80" x2="1160" y2="440" stroke="#cdb994" stroke-width="8"/>
      <line x1="1030" y1="260" x2="1290" y2="260" stroke="#cdb994" stroke-width="8"/>
      <circle cx="${cal.x + cal.w / 2}" cy="${cal.y - 50}" r="7" fill="#6b5a45"/>
      <path d="M${cal.x + 80} ${cal.y + 6} L${cal.x + cal.w / 2} ${cal.y - 50} L${cal.x + cal.w - 80} ${cal.y + 6}" stroke="#6b5a45" stroke-width="3" fill="none"/>
      <rect x="${cal.x + 8}" y="${cal.y + 10}" width="${cal.w}" height="${cal.h}" fill="#c9b690" opacity="0.5"/>
      <rect x="${cal.x}" y="${cal.y}" width="${cal.w}" height="${cal.h}" fill="#fbf7ee"/>
      <rect x="${cal.x}" y="${cal.y}" width="${cal.w}" height="112" fill="${C.saffron}"/>
      <rect x="${cal.x + 40}" y="${cal.y + 40}" width="170" height="14" rx="4" fill="#fbe6c4"/>
      <rect x="${cal.x + 40}" y="${cal.y + 66}" width="110" height="10" rx="4" fill="#fbe6c4" opacity="0.8"/>
      ${Array.from({ length: 7 }, (_, c) => `<rect x="${cal.x + 42 + c * 56}" y="${cal.y + 128}" width="24" height="6" rx="2" fill="#a59c8a"/>`).join("")}
      ${grid}
      <rect x="26" y="600" width="${W}" height="${H}" fill="${C.wood}"/>
      <rect x="26" y="600" width="${W}" height="18" fill="#8d5a34"/>
      ${Array.from({ length: 6 }, (_, i) => `<line x1="26" y1="${640 + i * 22}" x2="${W}" y2="${636 + i * 22}" stroke="#6a3f22" stroke-width="2" opacity="0.5"/>`).join("")}
      ${garland}
      <g transform="translate(1160 640)">
        <ellipse cx="0" cy="0" rx="70" ry="18" fill="#b8883a"/>
        <path d="M-70 0 Q-60 50 0 54 Q60 50 70 0 Z" fill="${C.gold}"/>
        <ellipse cx="0" cy="0" rx="58" ry="12" fill="#8a6326"/>
        ${[-30, -8, 16, 36].map((x, i) => `<circle cx="${x}" cy="${-6 - (i % 2) * 6}" r="14" fill="${i % 2 ? "#f0a02e" : "#e0781f"}"/>`).join("")}
      </g>
    `);
  },
};

/* ---------------------------------------------------------- extra assets */

function fallbackSvg() {
  return svgDoc(`
    <rect width="${W}" height="${H}" fill="${C.paper}"/>
    <g transform="translate(624 190) scale(4)">${MARK}</g>
    <text x="688" y="470" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-size="64" font-weight="600" fill="${C.ink}">NanakShahi</text>
    <text x="688" y="520" text-anchor="middle" font-family="'DejaVu Sans', Arial, sans-serif" font-size="22" letter-spacing="4" fill="#77705f">CALENDAR · GURPURAB · HERITAGE</text>
  `);
}

/** Same sunrise mark as app/icon.svg, scaled up. */
const MARK = `<rect width="32" height="32" rx="7" fill="#1d2d4a"/><path d="M8 21a8 8 0 0 1 16 0" fill="#e0781f"/><path d="M5.5 21h21" stroke="#faf7f1" stroke-width="1.6" stroke-linecap="round"/><path d="M9 25h14" stroke="#faf7f1" stroke-width="1.6" stroke-linecap="round" opacity=".55"/><path d="M16 6.5v3M9.3 9.3l2 2M22.7 9.3l-2 2" stroke="#e0781f" stroke-width="1.6" stroke-linecap="round"/>`;

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 32 32">${MARK}</svg>`;
}

/* ------------------------------------------------------------------ main */

async function grainOverlay() {
  const r = rng(99);
  const buf = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const v = Math.floor(110 + r() * 40);
    buf[i * 4] = v;
    buf[i * 4 + 1] = v;
    buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = 26;
  }
  return sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

async function main() {
  const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
  await fs.mkdir(OUT, { recursive: true });
  const grain = await grainOverlay();

  for (const [name, draw] of Object.entries(scenes)) {
    if (only && only !== name) continue;
    const file = path.join(OUT, `${name}.jpg`);
    await sharp(Buffer.from(draw()))
      .composite([{ input: grain, blend: "over" }])
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(file);
    console.log("wrote", path.relative(process.cwd(), file));
  }

  if (!only) {
    await sharp(Buffer.from(fallbackSvg()))
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(process.cwd(), "public", "images", "fallback.jpg"));
    await sharp(Buffer.from(logoSvg())).png().toFile(path.join(process.cwd(), "public", "logo.png"));
    console.log("wrote public/images/fallback.jpg, public/logo.png");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
