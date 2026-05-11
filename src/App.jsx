import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  deepBlue: "#0a1628",
  midBlue: "#0d2240",
  blue1: "#1a3a5c",
  blue2: "#1e5799",
  teal: "#1a9e7a",
  tealLight: "#2dc9a1",
  gold: "#c8932a",
  goldLight: "#f0b942",
  goldPale: "#fce8b2",
  green: "#2a7a4e",
  greenLight: "#4caf80",
  text: "#e8edf5",
  textMuted: "#7a9ab8",
  textDim: "#3a5a78",
  surface: "rgba(10,25,50,0.7)",
  surfaceAlt: "rgba(15,35,65,0.85)",
  border: "rgba(100,160,220,0.15)",
  borderGold: "rgba(200,147,42,0.3)",
};

const MOCK_PEOPLE = [
  { id: 1, name: "Layla Hassan", cluster: "Naperville North", nucleus: "Nucleus A", path: "service", activities: ["devotional", "study circle", "junior youth"], concentric: 3, notes: "Leading devotionals with 12 regular participants", nextStep: "Support transition to hosting" },
  { id: 2, name: "Marcus Chen", cluster: "Naperville North", nucleus: "Nucleus A", path: "participating", activities: ["study circle"], concentric: 2, notes: "Joined study circle 3 months ago", nextStep: "Invite to devotional gathering" },
  { id: 3, name: "Priya Nair", cluster: "Naperville North", nucleus: "Nucleus A", path: "accompanying", activities: ["children's class", "devotional"], concentric: 3, notes: "Accompanying 2 children's class animators", nextStep: "Reflection meeting next week" },
  { id: 4, name: "David Torres", cluster: "Lisle", nucleus: "Nucleus B", path: "service", activities: ["children's class"], concentric: 2, notes: "Running children's class with 8 children", nextStep: "Connect with neighboring nucleus" },
  { id: 5, name: "Amara Diallo", cluster: "Lisle", nucleus: "Nucleus B", path: "participating", activities: ["devotional", "junior youth"], concentric: 2, notes: "Active in junior youth group", nextStep: "Introduce to study circle" },
  { id: 6, name: "James Kim", cluster: "Naperville North", nucleus: "Nucleus A", path: "conversations", activities: [], concentric: 1, notes: "In ongoing conversations about faith", nextStep: "Invite to devotional" },
  { id: 7, name: "Sofia Reyes", cluster: "Wheaton", nucleus: "Nucleus C", path: "service", activities: ["study circle", "devotional", "children's class"], concentric: 4, notes: "Core facilitator, guiding 3 study circles", nextStep: "Assist with cluster reflection" },
  { id: 8, name: "Ibrahim Osei", cluster: "Wheaton", nucleus: "Nucleus C", path: "service", activities: ["junior youth", "devotional"], concentric: 3, notes: "Energetic animator for junior youth group", nextStep: "Connect with youth camp planning" },
  { id: 9, name: "Elena Vasquez", cluster: "Lisle", nucleus: "Nucleus B", path: "conversations", activities: [], concentric: 1, notes: "Recently started attending devotionals", nextStep: "Continue conversations" },
  { id: 10, name: "Thomas Wright", cluster: "Wheaton", nucleus: "Nucleus C", path: "participating", activities: ["study circle"], concentric: 2, notes: "Completing Book 1", nextStep: "Begin Book 2 with tutor" },
  { id: 11, name: "Aisha Mensah", cluster: "Naperville South", nucleus: "Nucleus D", path: "service", activities: ["devotional", "children's class"], concentric: 3, notes: "Established devotional gatherings in new area", nextStep: "Support nucleus formation" },
  { id: 12, name: "Carlos Patel", cluster: "Naperville South", nucleus: "Nucleus D", path: "accompanying", activities: ["study circle"], concentric: 2, notes: "Accompanying two new participants", nextStep: "Cluster study day" },
];

const NUCLEI = [
  { id: "A", name: "Nucleus A", cluster: "Naperville North", health: 85, cycle: "expansion", activities: 4, inhabitants: 3, completedConcentric: true, lastMeeting: "3 days ago", undertakings: ["Family Festival (Oct)", "Youth Service Project"], x: 280, y: 220 },
  { id: "B", name: "Nucleus B", cluster: "Lisle", health: 62, cycle: "consolidation", activities: 3, inhabitants: 2, completedConcentric: false, lastMeeting: "8 days ago", undertakings: ["Arts Workshop (Nov)"], x: 480, y: 330 },
  { id: "C", name: "Nucleus C", cluster: "Wheaton", health: 91, cycle: "expansion", activities: 5, inhabitants: 4, completedConcentric: true, lastMeeting: "1 day ago", undertakings: ["Junior Youth Camp (Dec)", "Collective Study Initiative", "Service Project"], x: 640, y: 180 },
  { id: "D", name: "Nucleus D", cluster: "Naperville South", health: 44, cycle: "reflection", activities: 2, inhabitants: 1, completedConcentric: false, lastMeeting: "14 days ago", undertakings: [], x: 380, y: 420 },
];

// People are placed ON the ring boundaries
const PATH_RING_RADIUS = { service: 13, accompanying: 30, participating: 52, conversations: 74 };

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Deterministic pseudo-random — stable across renders
function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function computePersonPositions(people, nuclei) {
  const positions = {};
  nuclei.forEach(nucleus => {
    const nucleusPeople = people.filter(p => p.nucleus === nucleus.name);
    ["service", "accompanying", "participating", "conversations"].forEach(path => {
      const group = nucleusPeople.filter(p => p.path === path);
      const r = PATH_RING_RADIUS[path];
      group.forEach((person, idx) => {
        // Each person gets a unique random base angle so they're scattered around the ring
        const baseAngle = seededRandom(person.id * 73.1 + 19.3) * 2 * Math.PI;
        const angle = group.length === 1
          ? baseAngle
          : (2 * Math.PI * idx / group.length) + baseAngle;
        positions[person.id] = {
          x: nucleus.x + r * Math.cos(angle),
          y: nucleus.y + r * Math.sin(angle),
        };
      });
    });
  });
  return positions;
}

const pathColor = (p) => ({
  service: COLORS.goldLight,
  accompanying: COLORS.tealLight,
  participating: COLORS.greenLight,
  conversations: COLORS.textMuted,
}[p] || COLORS.textMuted);

const cycleColor = (c) => ({
  expansion: COLORS.greenLight,
  consolidation: COLORS.goldLight,
  reflection: COLORS.teal,
}[c] || COLORS.textMuted);

function StarField() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.5 + 0.1,
    delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: s.x + "%", top: s.y + "%",
          width: s.size, height: s.size, borderRadius: "50%",
          background: "#fff", opacity: s.opacity,
          animation: `twinkle ${2 + s.delay}s ease-in-out infinite alternate`,
          animationDelay: s.delay + "s",
        }} />
      ))}
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 50% 30%, ${COLORS.blue1} 0%, ${COLORS.midBlue} 40%, ${COLORS.deepBlue} 100%)`,
      padding: 24, position: "relative", overflow: "hidden"
    }}>
      <StarField />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 420,
        background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
        borderRadius: 24, padding: "48px 40px", backdropFilter: "blur(20px)",
        boxShadow: `0 0 80px rgba(26,158,122,0.08), 0 40px 80px rgba(0,0,0,0.4)`,
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ position: "relative", width: 64, height: 64 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                position: "absolute", inset: i * 10, borderRadius: "50%",
                border: `1px solid ${i === 0 ? COLORS.gold : i === 1 ? COLORS.teal : COLORS.blue2}`,
                opacity: 1 - i * 0.2,
              }} />
            ))}
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.goldLight,
                boxShadow: `0 0 12px ${COLORS.goldLight}` }} />
            </div>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 28, fontWeight: 400,
          color: COLORS.text, textAlign: "center", margin: "0 0 6px", letterSpacing: "0.02em" }}>
          Community Visualizer
        </h1>
        <p style={{ color: COLORS.textMuted, textAlign: "center", fontSize: 14, margin: "0 0 36px",
          fontStyle: "italic" }}>Northern Illinois Subregion</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted,
              marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`,
                borderRadius: 10, padding: "12px 16px", color: COLORS.text, fontSize: 15,
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
              }} placeholder="your@email.com" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted,
              marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`,
                borderRadius: 10, padding: "12px 16px", color: COLORS.text, fontSize: 15,
                outline: "none", boxSizing: "border-box",
              }} placeholder="••••••••" />
          </div>
          <button onClick={handleSubmit}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            disabled={loading}
            style={{
              marginTop: 8, padding: "14px", borderRadius: 12,
              background: hovered ? `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blue2})` : `linear-gradient(135deg, ${COLORS.blue2}, ${COLORS.teal})`,
              border: "none", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer",
              transition: "all 0.3s", letterSpacing: "0.03em",
              boxShadow: hovered ? `0 8px 30px rgba(26,158,122,0.4)` : `0 4px 16px rgba(26,158,122,0.2)`,
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? "Entering…" : "Enter the Space"}
          </button>
        </div>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: COLORS.textDim }}>
          A space for friends walking a path of service
        </p>
      </div>
    </div>
  );
}

function GraphNode({ person, pos, isSelected, onClick, viewScale }) {
  const [hovered, setHovered] = useState(false);
  const color = pathColor(person.path);
  const size = 7;
  const clipId = `pc-${person.id}`;
  const showLabel = viewScale > 2.2;

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Glow halos */}
      <circle cx={pos.x} cy={pos.y} r={size + 16} fill={color} fillOpacity={0.04} />
      <circle cx={pos.x} cy={pos.y} r={size + 9}  fill={color} fillOpacity={0.08} />
      <circle cx={pos.x} cy={pos.y} r={size + 4}  fill={color} fillOpacity={0.15} />
      {(hovered || isSelected) && (
        <circle cx={pos.x} cy={pos.y} r={size + 24} fill={color} fillOpacity={0.05} />
      )}
      {/* Main circle */}
      <circle cx={pos.x} cy={pos.y} r={size}
        fill={color} fillOpacity={isSelected ? 1 : 0.9}
        filter="url(#nodeGlow)" />
      {isSelected && (
        <circle cx={pos.x} cy={pos.y} r={size + 2}
          fill="none" stroke="#fff" strokeWidth={1.5} strokeOpacity={0.8} />
      )}
      {/* Person silhouette clipped to circle */}
      <clipPath id={clipId}>
        <circle cx={pos.x} cy={pos.y} r={size} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <circle cx={pos.x} cy={pos.y - size * 0.22} r={size * 0.3} fill="rgba(255,255,255,0.88)" />
        <ellipse cx={pos.x} cy={pos.y + size * 0.62} rx={size * 0.5} ry={size * 0.38} fill="rgba(255,255,255,0.72)" />
      </g>
      {/* Name label — always when selected, or when zoomed in enough */}
      {(isSelected || showLabel) && (
        <text x={pos.x} y={pos.y - size - 5} textAnchor="middle" fill="#fff" fontSize={9}
          fontFamily="system-ui" style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.95))", pointerEvents: "none" }}>
          {person.name.split(" ")[0]}
        </text>
      )}
    </g>
  );
}

function NucleusRing({ nucleus, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const healthColor = nucleus.health > 75 ? COLORS.greenLight : nucleus.health > 50 ? COLORS.goldLight : COLORS.textMuted;
  const ringColor = isSelected ? COLORS.gold : COLORS.border;
  const ringWidth = isSelected ? 1.5 : 0.8;

  return (
    <g style={{ cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      {/* Nebula atmosphere — soft volumetric glow */}
      <circle cx={nucleus.x} cy={nucleus.y} r={130} fill={healthColor} fillOpacity={0.010} />
      <circle cx={nucleus.x} cy={nucleus.y} r={100} fill={healthColor} fillOpacity={0.018} />
      <circle cx={nucleus.x} cy={nucleus.y} r={75}  fill={healthColor} fillOpacity={0.030} />
      <circle cx={nucleus.x} cy={nucleus.y} r={50}  fill={healthColor} fillOpacity={0.040} />

      {/* Micro-stars scattered around the nucleus */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = seededRandom(nucleus.x * 3.7 + i * 137.5) * 2 * Math.PI;
        const r = 55 + seededRandom(nucleus.y * 2.9 + i * 93.3) * 55;
        const sz = 0.5 + seededRandom(i * 41.1 + nucleus.x) * 0.9;
        return (
          <circle key={i}
            cx={nucleus.x + r * Math.cos(angle)}
            cy={nucleus.y + r * Math.sin(angle)}
            r={sz} fill={healthColor} fillOpacity={0.35 + seededRandom(i * 17.3) * 0.45} />
        );
      })}

      {/* Large transparent hit area */}
      <circle cx={nucleus.x} cy={nucleus.y} r={82} fill="transparent" onClick={onClick} />

      {/* Concentric ring boundaries — match PATH_RING_RADIUS */}
      {/* Outermost: conversations zone (r≈74) */}
      <circle cx={nucleus.x} cy={nucleus.y} r={76}
        fill={isSelected ? `${COLORS.gold}08` : "none"}
        stroke={ringColor} strokeWidth={ringWidth} strokeDasharray={isSelected ? "none" : "4 4"} />
      {/* Middle: participating zone (r≈52) */}
      <circle cx={nucleus.x} cy={nucleus.y} r={54}
        fill="none" stroke={ringColor} strokeWidth={ringWidth * 0.7} strokeDasharray="3 5"
        strokeOpacity={0.6} />
      {/* Inner: accompanying zone (r≈30) */}
      <circle cx={nucleus.x} cy={nucleus.y} r={32}
        fill="none" stroke={ringColor} strokeWidth={ringWidth * 0.7} strokeDasharray="2 4"
        strokeOpacity={0.5} />

      {/* Center glow halos */}
      <circle cx={nucleus.x} cy={nucleus.y} r={16} fill={healthColor} fillOpacity={0.07} />
      <circle cx={nucleus.x} cy={nucleus.y} r={9}  fill={healthColor} fillOpacity={0.14} />
      {/* Center dot */}
      <circle cx={nucleus.x} cy={nucleus.y} r={4}
        fill={healthColor} fillOpacity={hovered || isSelected ? 1 : 0.8}
        filter="url(#nodeGlow)" onClick={onClick} />

      <text x={nucleus.x} y={nucleus.y + 90} textAnchor="middle" fill={COLORS.textMuted}
        fontSize={10} fontFamily="system-ui">{nucleus.name}</text>
    </g>
  );
}

const BASE_W = 800, BASE_H = 520;

const LEGEND_ITEMS = [
  ["service",       COLORS.goldLight,  "Path of Service"],
  ["accompanying",  COLORS.tealLight,  "Accompanying"],
  ["participating", COLORS.greenLight, "Participating"],
  ["conversations", COLORS.textMuted,  "In Conversations"],
];

function GraphMap({ people, nuclei, selectedPerson, selectedNucleus, onSelectPerson, onSelectNucleus, filters, isFullscreen, onToggleFullscreen }) {
  const containerRef = useRef(null);
  const [transform, setTransformState] = useState({ dx: 0, dy: 0, scale: 1 });
  const transformRef = useRef({ dx: 0, dy: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(window.innerWidth < 600);

  const gestureRef = useRef({ isPanning: false, lastX: 0, lastY: 0, lastDist: null });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const lastMoveTimeRef = useRef(0);
  const inertiaRef = useRef(null);

  // Keep transformRef in sync so velocity calculations can read latest scale
  const setTransform = useCallback((updater) => {
    setTransformState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      transformRef.current = next;
      return next;
    });
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRef.current) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
  }, []);

  const startInertia = useCallback(() => {
    stopInertia();
    let lastFrameTime = performance.now();
    const frame = (now) => {
      const dt = Math.min(now - lastFrameTime, 50);
      lastFrameTime = now;
      const { vx, vy } = velocityRef.current;
      if (Math.abs(vx) < 0.003 && Math.abs(vy) < 0.003) {
        inertiaRef.current = null;
        return;
      }
      // Half-life ~380ms — feels like a smooth galaxy glide
      const decay = Math.pow(0.5, dt / 380);
      velocityRef.current = { vx: vx * decay, vy: vy * decay };
      setTransform(t => ({
        ...t,
        dx: clamp(t.dx - vx * dt, -500, 1000),
        dy: clamp(t.dy - vy * dt, -300, 700),
      }));
      inertiaRef.current = requestAnimationFrame(frame);
    };
    inertiaRef.current = requestAnimationFrame(frame);
  }, [stopInertia, setTransform]);

  const viewBox = `${transform.dx} ${transform.dy} ${BASE_W / transform.scale} ${BASE_H / transform.scale}`;

  // ── Mouse pan (desktop) ─────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    stopInertia();
    velocityRef.current = { vx: 0, vy: 0 };
    gestureRef.current.isPanning = true;
    gestureRef.current.lastX = e.clientX;
    gestureRef.current.lastY = e.clientY;
    lastMoveTimeRef.current = performance.now();
    setIsDragging(true);
  }, [stopInertia]);

  const onMouseMove = useCallback((e) => {
    const g = gestureRef.current;
    if (!g.isPanning) return;
    const cx = e.clientX, cy = e.clientY;
    const lx = g.lastX, ly = g.lastY;
    g.lastX = cx; g.lastY = cy;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    lastMoveTimeRef.current = now;
    const currentScale = transformRef.current.scale;
    const svgDx = (cx - lx) * (BASE_W / rect.width) / currentScale;
    const svgDy = (cy - ly) * (BASE_H / rect.height) / currentScale;
    if (dt > 0 && dt < 80) {
      velocityRef.current = { vx: svgDx / dt, vy: svgDy / dt };
    }
    setTransform(t => ({
      ...t,
      dx: clamp(t.dx - svgDx, -500, 1000),
      dy: clamp(t.dy - svgDy, -300, 700),
    }));
  }, [setTransform]);

  const onMouseUp = useCallback(() => {
    gestureRef.current.isPanning = false;
    setIsDragging(false);
    startInertia();
  }, [startInertia]);

  // ── Touch handlers ──────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    stopInertia();
    velocityRef.current = { vx: 0, vy: 0 };
    if (e.touches.length === 1) {
      gestureRef.current.isPanning = true;
      gestureRef.current.lastX = e.touches[0].clientX;
      gestureRef.current.lastY = e.touches[0].clientY;
      gestureRef.current.lastDist = null;
      lastMoveTimeRef.current = performance.now();
    } else if (e.touches.length === 2) {
      gestureRef.current.isPanning = false;
      gestureRef.current.lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
  }, [stopInertia]);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    const g = gestureRef.current;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (e.touches.length === 1 && g.isPanning) {
      const cx = e.touches[0].clientX, cy = e.touches[0].clientY;
      const lx = g.lastX, ly = g.lastY;
      g.lastX = cx; g.lastY = cy;
      const now = performance.now();
      const dt = now - lastMoveTimeRef.current;
      lastMoveTimeRef.current = now;
      const currentScale = transformRef.current.scale;
      const svgDx = (cx - lx) * (BASE_W / rect.width) / currentScale;
      const svgDy = (cy - ly) * (BASE_H / rect.height) / currentScale;
      if (dt > 0 && dt < 80) {
        velocityRef.current = { vx: svgDx / dt, vy: svgDy / dt };
      }
      setTransform(t => ({
        ...t,
        dx: clamp(t.dx - svgDx, -500, 1000),
        dy: clamp(t.dy - svgDy, -300, 700),
      }));
    } else if (e.touches.length === 2 && g.lastDist !== null) {
      const t0 = e.touches[0], t1 = e.touches[1];
      const newDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      const ratio = newDist / g.lastDist;
      g.lastDist = newDist;
      const fx = ((t0.clientX + t1.clientX) / 2 - rect.left) / rect.width;
      const fy = ((t0.clientY + t1.clientY) / 2 - rect.top)  / rect.height;
      setTransform(t => {
        const newScale = clamp(t.scale * ratio, 0.3, 9);
        const svgX = t.dx + fx * (BASE_W / t.scale);
        const svgY = t.dy + fy * (BASE_H / t.scale);
        return {
          scale: newScale,
          dx: clamp(svgX - fx * (BASE_W / newScale), -500, 1000),
          dy: clamp(svgY - fy * (BASE_H / newScale), -300, 700),
        };
      });
    }
  }, [setTransform]);

  const onTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      gestureRef.current.isPanning = false;
      gestureRef.current.lastDist = null;
      startInertia();
    } else if (e.touches.length === 1) {
      gestureRef.current.lastDist = null;
      gestureRef.current.isPanning = true;
      gestureRef.current.lastX = e.touches[0].clientX;
      gestureRef.current.lastY = e.touches[0].clientY;
      lastMoveTimeRef.current = performance.now();
    }
  }, [startInertia]);

  // ── Wheel zoom at cursor (desktop) ──────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    stopInertia();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = e.deltaY < 0 ? 1.12 : 0.9;
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top)  / rect.height;
    setTransform(t => {
      const newScale = clamp(t.scale * ratio, 0.3, 9);
      const svgX = t.dx + fx * (BASE_W / t.scale);
      const svgY = t.dy + fy * (BASE_H / t.scale);
      return {
        scale: newScale,
        dx: clamp(svgX - fx * (BASE_W / newScale), -500, 1000),
        dy: clamp(svgY - fy * (BASE_H / newScale), -300, 700),
      };
    });
  }, [stopInertia, setTransform]);

  // Non-passive event listeners
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("wheel",     onWheel,     { passive: false });
    return () => {
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel",     onWheel);
    };
  }, [onTouchMove, onWheel]);

  // Window-level mouse listeners so drag continues outside SVG bounds
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // Cancel inertia on unmount
  useEffect(() => () => stopInertia(), [stopInertia]);

  const personPositions = computePersonPositions(people, nuclei);

  const filteredPeople = people.filter(p => {
    if (filters.path    && p.path    !== filters.path)    return false;
    if (filters.cluster && p.cluster !== filters.cluster) return false;
    if (filters.search  && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const connections = filteredPeople.flatMap(p =>
    filteredPeople.filter(q => q.id !== p.id && q.nucleus === p.nucleus && p.id < q.id)
      .map(q => ({ from: personPositions[p.id], to: personPositions[q.id] }))
  );

  const viewScale = transform.scale;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        ref={containerRef}
        viewBox={viewBox}
        style={{ width: "100%", height: "100%", display: "block", touchAction: "none",
          cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <defs>
          <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connections.map((c, i) => (
          <line key={i} x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
            stroke={COLORS.teal} strokeWidth={0.5} strokeOpacity={0.2} />
        ))}
        <line x1={280} y1={220} x2={480} y2={330} stroke={COLORS.border} strokeWidth={0.5} strokeDasharray="6 6" />
        <line x1={480} y1={330} x2={380} y2={420} stroke={COLORS.border} strokeWidth={0.5} strokeDasharray="6 6" />
        <line x1={280} y1={220} x2={640} y2={180} stroke={COLORS.border} strokeWidth={0.5} strokeDasharray="6 6" />
        {nuclei.map(n => (
          <NucleusRing key={n.id} nucleus={n}
            isSelected={selectedNucleus?.id === n.id}
            onClick={() => onSelectNucleus(n)} />
        ))}
        {filteredPeople.map(p => (
          <GraphNode key={p.id} person={p} pos={personPositions[p.id]}
            isSelected={selectedPerson?.id === p.id}
            onClick={() => onSelectPerson(p)}
            viewScale={viewScale} />
        ))}
      </svg>

      {/* Collapsible legend */}
      <div style={{
        position: "absolute", bottom: 16, left: 16,
        background: "rgba(8,18,38,0.88)", backdropFilter: "blur(12px)",
        border: `1px solid ${COLORS.border}`, borderRadius: 12,
        overflow: "hidden",
      }}>
        <button
          onClick={() => setLegendCollapsed(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            width: "100%", padding: "8px 12px",
            background: "none", border: "none", cursor: "pointer",
            color: COLORS.textMuted, fontSize: 11, fontFamily: "system-ui",
          }}
        >
          <span style={{ fontSize: 13 }}>◉</span>
          <span style={{ whiteSpace: "nowrap" }}>Legend</span>
          <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.7 }}>{legendCollapsed ? "▲" : "▼"}</span>
        </button>
        {!legendCollapsed && (
          <div style={{ padding: "4px 12px 10px", display: "flex", flexDirection: "column", gap: 7 }}>
            {LEGEND_ITEMS.map(([key, color, label]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 9, pointerEvents: "none" }}>
                <svg width={14} height={14} style={{ flexShrink: 0 }}>
                  <circle cx={7} cy={7} r={6} fill={color} fillOpacity={0.88} />
                  <circle cx={7} cy={4.5} r={1.8} fill="rgba(255,255,255,0.85)" />
                  <ellipse cx={7} cy={10.5} rx={3.2} ry={2.4} fill="rgba(255,255,255,0.72)" />
                </svg>
                <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "system-ui", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 4, borderTop: `1px solid ${COLORS.border}`, paddingTop: 6, display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "system-ui" }}>Rings (outer → inner)</div>
              {[["Conversations", COLORS.textMuted], ["Participating", COLORS.greenLight], ["Accompanying", COLORS.tealLight], ["Service", COLORS.goldLight]].map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 7, pointerEvents: "none" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", border: `1.5px solid ${c}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "system-ui" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen toggle button */}
      <button
        onClick={onToggleFullscreen}
        style={{
          position: "absolute", bottom: 16, right: 16,
          background: "rgba(8,18,38,0.88)", backdropFilter: "blur(12px)",
          border: `1px solid ${COLORS.border}`, borderRadius: 10,
          padding: "8px 12px", color: COLORS.textMuted,
          cursor: "pointer", fontSize: 16, lineHeight: 1,
        }}
        title={isFullscreen ? "Exit fullscreen" : "Expand map"}
      >
        {isFullscreen ? "⤡" : "⤢"}
      </button>
    </div>
  );
}

function PersonPanel({ person, onClose }) {
  if (!person) return null;
  const color = pathColor(person.path);

  return (
    <div style={{
      background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
      borderRadius: 20, padding: 28, backdropFilter: "blur(20px)",
      animation: "slideIn 0.25s ease-out",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}33, ${color}55)`,
            border: `1.5px solid ${color}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color,
          }}>
            {person.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 17 }}>{person.name}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{person.nucleus} · {person.cluster}</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20, padding: 4
        }}>×</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{
          background: `${color}22`, border: `1px solid ${color}44`,
          borderRadius: 20, padding: "4px 12px", fontSize: 12, color,
        }}>
          {person.path}
        </div>
        <div style={{
          background: `${COLORS.blue2}33`, border: `1px solid ${COLORS.blue2}44`,
          borderRadius: 20, padding: "4px 12px", fontSize: 12, color: COLORS.textMuted,
        }}>
          Concentric circle {person.concentric}
        </div>
      </div>

      {/* Concentric circles visualizer */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <svg viewBox="0 0 120 120" width={100} height={100}>
          {[1,2,3,4].map(i => (
            <circle key={i} cx={60} cy={60} r={i * 22}
              fill={i <= person.concentric ? `${color}${i === person.concentric ? "30" : "15"}` : "none"}
              stroke={i <= person.concentric ? color : COLORS.textDim}
              strokeWidth={0.5} />
          ))}
          <circle cx={60} cy={60} r={4} fill={color} />
        </svg>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 8 }}>Activities</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {person.activities.length > 0 ? person.activities.map(a => (
            <div key={a} style={{
              background: `${COLORS.teal}22`, border: `1px solid ${COLORS.teal}33`,
              borderRadius: 16, padding: "3px 10px", fontSize: 12, color: COLORS.tealLight,
            }}>{a}</div>
          )) : <div style={{ color: COLORS.textDim, fontSize: 13 }}>No core activities yet</div>}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 6 }}>Notes</div>
        <p style={{ color: COLORS.text, fontSize: 14, margin: 0, lineHeight: 1.6 }}>{person.notes}</p>
      </div>

      <div style={{
        background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}33`,
        borderRadius: 12, padding: "12px 14px",
      }}>
        <div style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 4 }}>Next step</div>
        <p style={{ color: COLORS.goldPale, fontSize: 14, margin: 0 }}>{person.nextStep}</p>
      </div>
    </div>
  );
}

function NucleusPanel({ nucleus, people, onClose }) {
  if (!nucleus) return null;
  const nucleusPeople = people.filter(p => p.nucleus === nucleus.name);
  const healthColor = nucleus.health > 75 ? COLORS.greenLight : nucleus.health > 50 ? COLORS.goldLight : COLORS.textMuted;
  const cycleCol = cycleColor(nucleus.cycle);

  return (
    <div style={{
      background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
      borderRadius: 20, padding: 28, backdropFilter: "blur(20px)",
      animation: "slideIn 0.25s ease-out",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 18 }}>{nucleus.name}</div>
          <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{nucleus.cluster}</div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20, padding: 4
        }}>×</button>
      </div>

      {/* Health indicator */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Community Health</span>
          <span style={{ fontSize: 14, color: healthColor, fontWeight: 600 }}>{nucleus.health}%</span>
        </div>
        <div style={{ height: 6, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: nucleus.health + "%", borderRadius: 4,
            background: `linear-gradient(90deg, ${healthColor}88, ${healthColor})`,
            transition: "width 1s ease",
          }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Activities", value: nucleus.activities, color: COLORS.tealLight },
          { label: "On Service Path", value: nucleus.inhabitants, color: COLORS.goldLight },
          { label: "Last meeting", value: nucleus.lastMeeting, color: COLORS.textMuted },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: `rgba(255,255,255,0.03)`, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: "10px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, color }}>{value}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Cycle indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: cycleCol,
          boxShadow: `0 0 8px ${cycleCol}` }} />
        <span style={{ fontSize: 13, color: cycleCol, textTransform: "capitalize" }}>
          {nucleus.cycle} phase
        </span>
        <div style={{ marginLeft: "auto", fontSize: 12, color: COLORS.textMuted }}>
          Concentric circles: {nucleus.completedConcentric ? "✓ Complete" : "In progress"}
        </div>
      </div>

      {/* Community undertakings */}
      {nucleus.undertakings.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase",
            letterSpacing: "0.08em", marginBottom: 8 }}>Community Undertakings</div>
          {nucleus.undertakings.map(u => (
            <div key={u} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.teal }} />
              <span style={{ fontSize: 13, color: COLORS.text }}>{u}</span>
            </div>
          ))}
        </div>
      )}

      {/* People in nucleus */}
      <div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 8 }}>Participants ({nucleusPeople.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {nucleusPeople.map(p => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 10px", background: "rgba(255,255,255,0.02)",
              borderRadius: 10, border: `1px solid ${COLORS.border}`,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: pathColor(p.path) + "33",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: pathColor(p.path), fontWeight: 600,
              }}>{p.name.split(" ").map(n => n[0]).join("")}</div>
              <span style={{ fontSize: 13, color: COLORS.text, flex: 1 }}>{p.name}</span>
              <span style={{ fontSize: 11, color: pathColor(p.path) }}>{p.path}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardStats({ people }) {
  const stats = [
    { label: "On Path of Service", value: people.filter(p => p.path === "service").length, color: COLORS.goldLight },
    { label: "Accompanying Others", value: people.filter(p => p.path === "accompanying").length, color: COLORS.tealLight },
    { label: "Participating", value: people.filter(p => p.path === "participating").length, color: COLORS.greenLight },
    { label: "In Conversations", value: people.filter(p => p.path === "conversations").length, color: COLORS.textMuted },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>      {stats.map(s => (
        <div key={s.label} style={{
          background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
          borderRadius: 16, padding: "16px 18px", backdropFilter: "blur(12px)",
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function FilterBar({ filters, setFilters }) {
  const clusters = ["Naperville North", "Naperville South", "Lisle", "Wheaton"];
  const paths = ["service", "accompanying", "participating", "conversations"];

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
      <input
        placeholder="🔍  Search people…"
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        style={{
          background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "8px 14px", color: COLORS.text, fontSize: 14,
          outline: "none", minWidth: 200, backdropFilter: "blur(12px)",
        }}
      />
      <select value={filters.cluster} onChange={e => setFilters(f => ({ ...f, cluster: e.target.value }))}
        style={{
          background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "8px 14px", color: filters.cluster ? COLORS.text : COLORS.textMuted,
          fontSize: 14, outline: "none", backdropFilter: "blur(12px)",
        }}>
        <option value="">All Clusters</option>
        {clusters.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.path} onChange={e => setFilters(f => ({ ...f, path: e.target.value }))}
        style={{
          background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "8px 14px", color: filters.path ? COLORS.text : COLORS.textMuted,
          fontSize: 14, outline: "none", backdropFilter: "blur(12px)",
        }}>
        <option value="">All Paths</option>
        {paths.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {(filters.search || filters.cluster || filters.path) && (
        <button onClick={() => setFilters({ search: "", cluster: "", path: "" })}
          style={{
            background: "none", border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: "8px 14px", color: COLORS.textMuted,
            fontSize: 13, cursor: "pointer",
          }}>Clear</button>
      )}
    </div>
  );
}

function PeopleList({ people, filters, onSelect, selectedPerson }) {
  const filtered = people.filter(p => {
    if (filters.path && p.path !== filters.path) return false;
    if (filters.cluster && p.cluster !== filters.cluster) return false;
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 480, overflowY: "auto" }}>
      {filtered.map(p => {
        const color = pathColor(p.path);
        const selected = selectedPerson?.id === p.id;
        return (
          <div key={p.id} onClick={() => onSelect(p)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", background: selected ? `${color}15` : "rgba(255,255,255,0.02)",
              border: `1px solid ${selected ? color + "44" : COLORS.border}`,
              borderRadius: 12, cursor: "pointer", transition: "all 0.15s",
            }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `${color}25`, border: `1px solid ${color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color, fontWeight: 600, flexShrink: 0,
            }}>{p.name.split(" ").map(n => n[0]).join("")}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>{p.name}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{p.nucleus} · {p.cluster}</div>
            </div>
            <div style={{
              fontSize: 11, color, background: `${color}20`,
              borderRadius: 12, padding: "2px 8px", flexShrink: 0,
            }}>{p.path}</div>
          </div>
        );
      })}
    </div>
  );
}

function AddPersonModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", cluster: "Naperville North", nucleus: "Nucleus A", path: "conversations", notes: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, id: Date.now(), activities: [], concentric: 1, nextStep: "Initial conversation" });
    onClose();
  };

  const field = (label, key, type = "text", options = null) => (
    <div key={key}>
      <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted,
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</label>
      {options ? (
        <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
      )}
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5,12,25,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
        borderRadius: 24, padding: 32, width: "90%", maxWidth: 440,
        animation: "slideIn 0.2s ease-out",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ color: COLORS.text, margin: 0, fontSize: 18, fontWeight: 500 }}>Add a Friend</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {field("Name", "name")}
          {field("Cluster", "cluster", "select", ["Naperville North", "Naperville South", "Lisle", "Wheaton"])}
          {field("Nucleus", "nucleus", "select", ["Nucleus A", "Nucleus B", "Nucleus C", "Nucleus D"])}
          {field("Path", "path", "select", ["conversations", "participating", "accompanying", "service"])}
          {field("Notes", "notes")}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: 12, background: "none",
            border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, cursor: "pointer", fontSize: 14,
          }}>Cancel</button>
          <button onClick={handleAdd} style={{
            flex: 1, padding: "11px", borderRadius: 12,
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blue2})`,
            border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500,
          }}>Add Friend</button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      padding: "8px 16px", background: active ? `${COLORS.teal}22` : "none",
      border: `1px solid ${active ? COLORS.teal + "44" : "transparent"}`,
      borderRadius: 12, cursor: "pointer", color: active ? COLORS.tealLight : COLORS.textMuted,
      fontSize: 12, transition: "all 0.2s", minWidth: 64,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState("map");
  const [people, setPeople] = useState(MOCK_PEOPLE);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedNucleus, setSelectedNucleus] = useState(null);
  const [filters, setFilters] = useState({ search: "", cluster: "", path: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);

  if (!authed) return <AuthScreen onLogin={() => setAuthed(true)} />;

  const handleSelectPerson = (p) => {
    setSelectedPerson(p);
    setSelectedNucleus(null);
  };
  const handleSelectNucleus = (n) => {
    setSelectedNucleus(n);
    setSelectedPerson(null);
  };

  return (
    <div style={{
      minHeight: "100vh", background: `radial-gradient(ellipse at 40% 20%, ${COLORS.blue1} 0%, ${COLORS.midBlue} 50%, ${COLORS.deepBlue} 100%)`,
      fontFamily: "system-ui, -apple-system, sans-serif", color: COLORS.text,
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes twinkle { from{opacity:.1} to{opacity:.6} }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
        select option { background: #0d2240; color: #e8edf5; }
      `}</style>
      <StarField />

      {/* Top bar */}
      <div style={{
        position: "relative", zIndex: 10, display: "flex", alignItems: "center",
        padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}`,
        background: "rgba(10,22,40,0.6)", backdropFilter: "blur(16px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{ position: "relative", width: 32, height: 32 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                position: "absolute", inset: i * 5, borderRadius: "50%",
                border: `1px solid ${i === 0 ? COLORS.gold : i === 1 ? COLORS.teal : COLORS.blue2}`,
                opacity: 1 - i * 0.25,
              }} />
            ))}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.goldLight }} />
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 17, fontWeight: 400, letterSpacing: "0.02em" }}>
              Community Visualizer
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>Northern Illinois Subregion</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <NavItem label="Map" icon="◉" active={view === "map"} onClick={() => setView("map")} />
          <NavItem label="People" icon="◎" active={view === "people"} onClick={() => setView("people")} />
          <NavItem label="Nuclei" icon="⊙" active={view === "nuclei"} onClick={() => setView("nuclei")} />
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setShowAddModal(true)} style={{
            background: `linear-gradient(135deg, ${COLORS.teal}88, ${COLORS.blue2}88)`,
            border: `1px solid ${COLORS.teal}44`, borderRadius: 12,
            padding: "8px 18px", color: COLORS.tealLight, cursor: "pointer", fontSize: 13,
            backdropFilter: "blur(8px)",
          }}>+ Add Friend</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* Map view */}
        {view === "map" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
            {!mapFullscreen && (
              <div style={{ padding: "16px 24px 0" }}>
                <DashboardStats people={people} />
                <FilterBar filters={filters} setFilters={setFilters} />
              </div>
            )}
            <div style={{
              flex: 1, display: "flex", overflow: "hidden",
              padding: mapFullscreen ? 0 : "0 24px 24px", gap: mapFullscreen ? 0 : 20,
              ...(mapFullscreen ? { position: "fixed", inset: 0, zIndex: 40, background: COLORS.deepBlue } : {}),
            }}>
              <div style={{
                flex: 1, background: "rgba(5,15,35,0.4)", border: mapFullscreen ? "none" : `1px solid ${COLORS.border}`,
                borderRadius: mapFullscreen ? 0 : 20, overflow: "hidden", backdropFilter: "blur(8px)",
              }}>
                <GraphMap
                  people={people} nuclei={NUCLEI}
                  selectedPerson={selectedPerson} selectedNucleus={selectedNucleus}
                  onSelectPerson={handleSelectPerson} onSelectNucleus={handleSelectNucleus}
                  filters={filters}
                  isFullscreen={mapFullscreen}
                  onToggleFullscreen={() => setMapFullscreen(v => !v)}
                />
              </div>
              {!mapFullscreen && (selectedPerson || selectedNucleus) && (
                <div style={{ width: 320, overflowY: "auto" }}>
                  {selectedPerson && (
                    <PersonPanel person={selectedPerson} onClose={() => setSelectedPerson(null)} />
                  )}
                  {selectedNucleus && (
                    <NucleusPanel nucleus={selectedNucleus} people={people} onClose={() => setSelectedNucleus(null)} />
                  )}
                </div>
              )}
            </div>
            {/* Slide-up panel when fullscreen and something is selected */}
            {mapFullscreen && (selectedPerson || selectedNucleus) && (
              <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
                maxHeight: "55vh", overflowY: "auto",
                background: COLORS.surfaceAlt, borderTop: `1px solid ${COLORS.border}`,
                backdropFilter: "blur(20px)", borderRadius: "20px 20px 0 0",
                padding: "20px 20px 32px",
              }}>
                {selectedPerson && (
                  <PersonPanel person={selectedPerson} onClose={() => setSelectedPerson(null)} />
                )}
                {selectedNucleus && (
                  <NucleusPanel nucleus={selectedNucleus} people={people} onClose={() => setSelectedNucleus(null)} />
                )}
              </div>
            )}
          </div>
        )}

        {/* People view */}
        {view === "people" && (
          <div style={{ flex: 1, display: "flex", gap: 20, padding: 24, overflow: "hidden" }}>
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 400,
                  fontFamily: "'Crimson Pro', Georgia, serif" }}>Friends & Participants</h2>
                <p style={{ margin: 0, color: COLORS.textMuted, fontSize: 14 }}>{people.length} people in the subregion</p>
              </div>
              <FilterBar filters={filters} setFilters={setFilters} />
              <div style={{ flex: 1, overflowY: "auto" }}>
                <PeopleList people={people} filters={filters}
                  onSelect={handleSelectPerson} selectedPerson={selectedPerson} />
              </div>
            </div>
            {selectedPerson && (
              <div style={{ width: 340, overflowY: "auto" }}>
                <PersonPanel person={selectedPerson} onClose={() => setSelectedPerson(null)} />
              </div>
            )}
          </div>
        )}

        {/* Nuclei view */}
        {view === "nuclei" && (
          <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 400,
                fontFamily: "'Crimson Pro', Georgia, serif" }}>Neighborhood Nuclei</h2>
              <p style={{ margin: 0, color: COLORS.textMuted, fontSize: 14 }}>{NUCLEI.length} nuclei across the subregion</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {NUCLEI.map(n => {
                const healthColor = n.health > 75 ? COLORS.greenLight : n.health > 50 ? COLORS.goldLight : COLORS.textMuted;
                const cycleCol = cycleColor(n.cycle);
                return (
                  <div key={n.id} onClick={() => { setSelectedNucleus(n); setView("map"); }}
                    style={{
                      background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
                      borderRadius: 20, padding: 24, cursor: "pointer",
                      backdropFilter: "blur(12px)", transition: "all 0.2s",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 3 }}>{n.name}</div>
                        <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{n.cluster}</div>
                      </div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: `${cycleCol}20`, border: `1px solid ${cycleCol}33`,
                        borderRadius: 16, padding: "4px 12px", height: "fit-content",
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: cycleCol }} />
                        <span style={{ fontSize: 12, color: cycleCol, textTransform: "capitalize" }}>{n.cycle}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: COLORS.textMuted }}>Community health</span>
                        <span style={{ fontSize: 13, color: healthColor, fontWeight: 600 }}>{n.health}%</span>
                      </div>
                      <div style={{ height: 4, background: COLORS.border, borderRadius: 4 }}>
                        <div style={{
                          height: "100%", width: n.health + "%", borderRadius: 4,
                          background: `linear-gradient(90deg, ${healthColor}88, ${healthColor})`,
                        }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
                      <span style={{ color: COLORS.tealLight }}>{n.activities} activities</span>
                      <span style={{ color: COLORS.textDim }}>·</span>
                      <span style={{ color: COLORS.goldLight }}>{n.inhabitants} on service path</span>
                      <span style={{ color: COLORS.textDim }}>·</span>
                      <span style={{ color: COLORS.textMuted }}>{n.undertakings.length} undertakings</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddPersonModal
          onClose={() => setShowAddModal(false)}
          onAdd={(p) => setPeople(prev => [...prev, p])}
        />
      )}
    </div>
  );
}
