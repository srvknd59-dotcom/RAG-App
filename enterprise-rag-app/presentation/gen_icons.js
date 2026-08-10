// Render react-icons to PNG at multiple colors for use in the deck.
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Fa = require("react-icons/fa6");

const OUT = path.join(__dirname, "assets");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// icon name -> react-icons component
const ICONS = {
  brain: Fa.FaBrain,
  robot: Fa.FaRobot,
  search: Fa.FaMagnifyingGlass,
  database: Fa.FaDatabase,
  file: Fa.FaFileLines,
  filepdf: Fa.FaFilePdf,
  layers: Fa.FaLayerGroup,
  vector: Fa.FaDiagramProject,
  quote: Fa.FaQuoteRight,
  shield: Fa.FaShieldHalved,
  bolt: Fa.FaBolt,
  warning: Fa.FaTriangleExclamation,
  users: Fa.FaUsers,
  server: Fa.FaServer,
  code: Fa.FaCode,
  gears: Fa.FaGears,
  rocket: Fa.FaRocket,
  building: Fa.FaBuilding,
  table: Fa.FaTable,
  image: Fa.FaImage,
  chat: Fa.FaComments,
  check: Fa.FaCircleCheck,
  arrowright: Fa.FaArrowRightLong,
  plug: Fa.FaPlug,
  lock: Fa.FaLock,
  chart: Fa.FaChartLine,
  cloud: Fa.FaCloud,
  key: Fa.FaKey,
  bookmark: Fa.FaBookOpen,
  gauge: Fa.FaGaugeHigh,
  moneybill: Fa.FaMoneyBillTrendUp,
  headset: Fa.FaHeadset,
  scale: Fa.FaScaleBalanced,
  eye: Fa.FaEye,
  sitemap: Fa.FaSitemap,
  wandsparkles: Fa.FaWandMagicSparkles,
  boxesstacked: Fa.FaBoxesStacked,
  circlenodes: Fa.FaCircleNodes,
};

const COLORS = {
  white: "FFFFFF",
  navy: "1B2559",
  indigo: "4C5BD4",
  green: "16A34A",
  purple: "8B5CF6",
  cyan: "0EA5E9",
  amber: "F59E0B",
  slate: "64748B",
  rose: "E11D48",
};

async function render(name, Comp, colorName, hex) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { color: "#" + hex, size: 256 })
  );
  const buf = Buffer.from(svg);
  await sharp(buf, { density: 384 })
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT, `${name}_${colorName}.png`));
}

(async () => {
  const jobs = [];
  for (const [name, Comp] of Object.entries(ICONS)) {
    for (const [cName, hex] of Object.entries(COLORS)) {
      jobs.push(render(name, Comp, cName, hex));
    }
  }
  await Promise.all(jobs);
  console.log(`Rendered ${jobs.length} icon PNGs to ${OUT}`);
})();
