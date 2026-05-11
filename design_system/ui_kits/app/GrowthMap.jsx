// GrowthMap.jsx
// The cosmic map: nuclei (concentric circles) holding person-nodes,
// with glowing curved connections between related people. All positions
// are stored as data so the layout can be reasoned about.

// ── Data ─────────────────────────────────────────────────────────────
// status: 'engaged' | 'sustaining' | 'invited' | 'not-invited'
const MAP_DATA = {
  nuclei: [
    { id: "n1", label: "Lakeshore",   cx: 320, cy: 280, r: 130 },
    { id: "n2", label: "Riverside",   cx: 560, cy: 220, r: 110 },
    { id: "n3", label: "Heartland",   cx: 460, cy: 440, r: 150 },
    { id: "n4", label: "Forest Park", cx: 240, cy: 520, r: 130 },
    { id: "n5", label: "Eastview",    cx: 720, cy: 480, r: 120 },
  ],
};

// Generate person-nodes around each nucleus center (deterministic — seeded)
function makePeople() {
  const out = [];
  let i = 0;
  function add(nucleus, opts = {}) {
    const count = opts.count || 14;
    const sustainingCount = opts.sustaining || 2;
    const engagedRatio = opts.engagedRatio ?? 0.55;
    const invitedRatio = opts.invitedRatio ?? 0.15;
    for (let k = 0; k < count; k++) {
      const t = k / count;
      const angle = t * Math.PI * 2 + (nucleus.cx * 0.013);
      const ringR = (0.40 + ((k * 7) % 100) / 200) * nucleus.r; // 0.40 .. 0.90
      const x = nucleus.cx + Math.cos(angle) * ringR;
      const y = nucleus.cy + Math.sin(angle) * ringR;
      let status;
      if (k < sustainingCount) status = "sustaining";
      else if (k < sustainingCount + Math.round(count * engagedRatio)) status = "engaged";
      else if (k < sustainingCount + Math.round(count * engagedRatio) + Math.round(count * invitedRatio)) status = "invited";
      else status = "not-invited";
      i += 1;
      out.push({ id: `p${i}`, nucleus: nucleus.id, x, y, status, r: status === "sustaining" ? 7 : 5.5 });
    }
  }
  add(MAP_DATA.nuclei[0], { count: 18, sustaining: 3, engagedRatio: 0.55, invitedRatio: 0.12 });
  add(MAP_DATA.nuclei[1], { count: 14, sustaining: 2, engagedRatio: 0.5,  invitedRatio: 0.2  });
  add(MAP_DATA.nuclei[2], { count: 22, sustaining: 4, engagedRatio: 0.6,  invitedRatio: 0.1  });
  add(MAP_DATA.nuclei[3], { count: 18, sustaining: 2, engagedRatio: 0.45, invitedRatio: 0.18 });
  add(MAP_DATA.nuclei[4], { count: 14, sustaining: 2, engagedRatio: 0.5,  invitedRatio: 0.2  });
  return out;
}
const PEOPLE = makePeople();

// Connections: cross-nucleus + a few intra-nucleus accompaniment lines
function makeConnections() {
  const lines = [];
  // intra: connect each sustaining person to two neighbors
  PEOPLE.forEach((p, idx) => {
    if (p.status === "sustaining") {
      const peers = PEOPLE.filter(q => q.nucleus === p.nucleus && q.id !== p.id);
      for (let j = 0; j < 3 && j < peers.length; j++) {
        const q = peers[(idx * 7 + j * 5) % peers.length];
        lines.push({ a: p.id, b: q.id, kind: "intra" });
      }
    }
  });
  // inter-nucleus bridges between geographically close pairs
  const pairs = [["n1","n2"],["n1","n3"],["n2","n3"],["n3","n4"],["n3","n5"],["n4","n5"]];
  pairs.forEach(([na, nb], pi) => {
    const A = PEOPLE.filter(p => p.nucleus === na && p.status === "sustaining");
    const B = PEOPLE.filter(p => p.nucleus === nb && p.status === "sustaining");
    if (A.length && B.length) {
      lines.push({ a: A[pi % A.length].id, b: B[pi % B.length].id, kind: "inter" });
    }
  });
  return lines;
}
const CONNECTIONS = makeConnections();

// ── Components ────────────────────────────────────────────────────────

const NucleusRing = ({ n, hovered, onClick }) => (
  <g style={{ cursor: "pointer" }} onClick={onClick}>
    <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.18)" strokeWidth={1} strokeDasharray="2 4" />
    {hovered ? (
      <circle cx={n.cx} cy={n.cy} r={n.r + 4} fill="none" stroke="rgba(229,169,59,0.5)" strokeWidth={1.2} />
    ) : null}
    <text x={n.cx - n.r + 4} y={n.cy - n.r - 8} fontFamily="Manrope, sans-serif" fontSize={11} fontWeight={600} fill="rgba(246,241,230,0.65)" letterSpacing="0.08em" style={{ textTransform: "uppercase" }}>
      {n.label}
    </text>
  </g>
);

const PersonNode = ({ p, onClick, isSelected }) => {
  const fill = {
    engaged: "var(--green-400)",
    sustaining: "var(--gold-500)",
    invited: "var(--cream-100)",
    "not-invited": "rgba(246,241,230,0.30)",
  }[p.status];
  const glow = {
    engaged: "0 0 8px rgba(155,227,184,0.55)",
    sustaining: "0 0 14px rgba(229,169,59,0.65)",
    invited: "0 0 4px rgba(246,241,230,0.30)",
    "not-invited": "none",
  }[p.status];
  // SVG <circle> doesn't take box-shadow; we use a filter
  const filterId = `glow-${p.status}`;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick} className={p.status === "sustaining" ? "pulse" : ""} >
      {p.status !== "not-invited" ? (
        <circle cx={p.x} cy={p.y} r={p.r * 2.2} fill={p.status === "sustaining" ? "rgba(229,169,59,0.18)" : "rgba(155,227,184,0.14)"} />
      ) : null}
      <circle cx={p.x} cy={p.y} r={p.r} fill={fill} stroke={isSelected ? "#fff" : "rgba(255,255,255,0.4)"} strokeWidth={isSelected ? 1.5 : 0.6} />
    </g>
  );
};

const ConnectionLayer = ({ people, connections }) => {
  const byId = Object.fromEntries(people.map(p => [p.id, p]));
  return (
    <g>
      {connections.map((c, i) => {
        const a = byId[c.a], b = byId[c.b];
        if (!a || !b) return null;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len, ny = dx / len;
        const curve = c.kind === "inter" ? 24 : 10;
        const cx = mx + nx * curve, cy = my + ny * curve;
        return (
          <path
            key={i}
            d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={c.kind === "inter" ? "rgba(229,169,59,0.35)" : "rgba(155,227,184,0.30)"}
            strokeWidth={c.kind === "inter" ? 0.8 : 0.5}
          />
        );
      })}
    </g>
  );
};

const GrowthMap = ({ width = 960, height = 720, onSelectPerson, selectedId }) => {
  const [hovered, setHovered] = React.useState(null);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      <defs>
        {/* a soft "drift" gradient for the inter-nucleus lines */}
      </defs>
      {/* nuclei rings */}
      {MAP_DATA.nuclei.map(n => (
        <NucleusRing key={n.id} n={n} hovered={hovered === n.id} onClick={() => setHovered(h => h === n.id ? null : n.id)} />
      ))}
      <ConnectionLayer people={PEOPLE} connections={CONNECTIONS} />
      {PEOPLE.map(p => (
        <PersonNode key={p.id} p={p} isSelected={selectedId === p.id} onClick={() => onSelectPerson && onSelectPerson(p)} />
      ))}
    </svg>
  );
};

window.GrowthMap = GrowthMap;
window.MAP_DATA = MAP_DATA;
window.PEOPLE = PEOPLE;
