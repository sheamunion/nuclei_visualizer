// Screens.jsx — LoginScreen, DashboardScreen, MapScreen

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <div style={{
      minHeight: "100%",
      background: "linear-gradient(180deg, #234266 0%, #1F3A5F 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 24px",
    }}>
      <div style={{
        width: "min(560px, 100%)",
        background: "var(--cream-50)",
        borderRadius: 24,
        padding: "44px 56px 36px",
        boxShadow: "var(--shadow-lg)",
        textAlign: "center",
      }}>
        <img src="../../assets/logo-mark.svg" alt="" style={{ width: 80, height: 80, margin: "0 auto" }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 500, margin: "18px 0 6px" }}>Nucleus Visualizer</h1>
        <p style={{ color: "var(--fg-muted)", fontSize: 14, margin: "0 0 28px" }}>Welcome back. The community is waiting.</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin && onLogin(); }} style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-primary" type="submit" style={{ marginTop: 12, width: "100%", height: 48, fontSize: 15 }}>Log in</button>
        </form>
        <p style={{ marginTop: 22, fontSize: 13, color: "var(--fg-muted)" }}>
          Don't have an account? <a href="#" style={{ color: "var(--green-600)", fontWeight: 600, textDecoration: "none" }}>Register</a>
        </p>
      </div>
    </div>
  );
};


const StatCard = ({ label, value, delta }) => (
  <div className="card" style={{ padding: "18px 20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <span className="eyebrow">{label}</span>
      {delta ? <span style={{ fontSize: 12, color: "var(--green-600)", fontWeight: 600 }}>{delta}</span> : null}
    </div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 42, lineHeight: 1, fontWeight: 500 }}>{value}</div>
  </div>
);

const DashboardScreen = ({ onOpenMap }) => {
  return (
    <div style={{ minHeight: "100%", background: "var(--cream-100)" }}>
      {/* top bar */}
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "var(--cream-50)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="../../assets/logo-mark.svg" alt="" style={{ width: 32, height: 32 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500 }}>Nucleus Visualizer</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconButton icon="search" label="Search" />
          <IconButton icon="bell" label="Notifications" />
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gold-500)", color: "var(--indigo-900)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>RB</div>
        </div>
      </div>

      <div style={{ padding: "32px 32px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <span className="eyebrow">Northern Illinois Subregion</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 500, margin: "8px 0 6px", letterSpacing: "-0.01em" }}>A community in motion</h1>
        <p style={{ color: "var(--fg-muted)", fontSize: 16, margin: 0 }}>187 friends. 7 nuclei. The cycle began 23 days ago.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 28 }}>
          <StatCard label="Friends" value="187" delta="+4 this cycle" />
          <StatCard label="Nuclei" value="7" delta="+1 this cycle" />
          <StatCard label="Sustaining" value="13" />
          <StatCard label="Engaged" value="98" delta="+6 this cycle" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginTop: 16 }}>
          {/* map preview */}
          <div className="card" style={{ padding: 0, overflow: "hidden", cursor: "pointer", position: "relative", minHeight: 320 }} onClick={onOpenMap}>
            <div style={{ position: "absolute", inset: 0, background: "url('../../assets/starfield-bg.svg') center/cover, var(--indigo-950)" }} />
            <div style={{ position: "relative", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--map-fg)", margin: 0, fontWeight: 500 }}>Nucleus map</h3>
                <p style={{ fontSize: 13, color: "var(--map-fg-muted)", margin: "4px 0 0" }}>Open the constellation →</p>
              </div>
            </div>
            <svg viewBox="0 0 400 220" style={{ position: "relative", width: "100%", height: 220, display: "block" }}>
              {/* small preview of map */}
              <g>
                <circle cx={120} cy={110} r={60} fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="2 4" />
                <circle cx={260} cy={90} r={48} fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="2 4" />
                <circle cx={300} cy={160} r={42} fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="2 4" />
                {/* connections */}
                <path d="M 160 100 Q 200 80 240 90" fill="none" stroke="rgba(229,169,59,0.4)" />
                <path d="M 260 110 Q 290 130 295 145" fill="none" stroke="rgba(155,227,184,0.4)" />
                {/* nodes */}
                {Array.from({ length: 14 }).map((_, i) => {
                  const a = (i / 14) * Math.PI * 2; const r = 30 + (i % 3) * 14;
                  const x = 120 + Math.cos(a) * r; const y = 110 + Math.sin(a) * r;
                  return <circle key={i} cx={x} cy={y} r={i < 2 ? 5 : 3.5} fill={i < 2 ? "#E5A93B" : i < 8 ? "#6BC18F" : "#F6F1E6"} opacity={i < 8 ? 1 : 0.7} />;
                })}
                {Array.from({ length: 10 }).map((_, i) => {
                  const a = (i / 10) * Math.PI * 2; const r = 22 + (i % 3) * 10;
                  const x = 260 + Math.cos(a) * r; const y = 90 + Math.sin(a) * r;
                  return <circle key={"b"+i} cx={x} cy={y} r={i < 1 ? 5 : 3.5} fill={i < 1 ? "#E5A93B" : i < 6 ? "#6BC18F" : "#F6F1E6"} opacity={0.9} />;
                })}
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i / 8) * Math.PI * 2; const r = 20 + (i % 3) * 8;
                  const x = 300 + Math.cos(a) * r; const y = 160 + Math.sin(a) * r;
                  return <circle key={"c"+i} cx={x} cy={y} r={3.5} fill={i < 5 ? "#6BC18F" : "#F6F1E6"} opacity={0.9} />;
                })}
              </g>
            </svg>
          </div>

          {/* recent activity */}
          <div className="card">
            <h3 style={{ margin: 0, marginBottom: 14 }}>Recent activity</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { who: "Marion J.", what: "joined Lakeshore as engaged", when: "2 hours ago", color: "var(--green-500)" },
                { who: "Layli K.", what: "began hosting a devotional", when: "yesterday", color: "var(--gold-500)" },
                { who: "Riaz B.", what: "completed Book 3", when: "2 days ago", color: "var(--green-500)" },
                { who: "Selma O.", what: "was invited by Curtis K.", when: "3 days ago", color: "var(--neutral-300)" },
                { who: "Eastview", what: "formed as a new nucleus", when: "1 week ago", color: "var(--gold-500)" },
              ].map((r, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, marginTop: 7, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, color: "var(--fg)" }}><strong style={{ fontWeight: 600 }}>{r.who}</strong> {r.what}</span>
                    <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{r.when}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
          <div className="card">
            <h3 style={{ margin: 0, marginBottom: 14 }}>Core activities</h3>
            {[
              ["Devotional gatherings", 22],
              ["Study circles", 12],
              ["Children's classes", 9],
              ["Junior youth groups", 6],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: i ? "1px solid var(--border)" : "0", fontSize: 13 }}>
                <span style={{ color: "var(--fg)" }}>{k}</span>
                <span style={{ color: "var(--fg-muted)", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 style={{ margin: 0, marginBottom: 14 }}>Friends ready to be invited</h3>
            <p style={{ color: "var(--fg-muted)", fontSize: 13, margin: "0 0 14px" }}>Known to the community, not yet engaged in a core activity.</p>
            <Button variant="secondary">See 27 friends →</Button>
          </div>
          <div className="card" style={{ background: "linear-gradient(135deg, #15294A, #0A1A35)", color: "var(--map-fg)", border: "none" }}>
            <span className="eyebrow" style={{ color: "rgba(246,241,230,0.6)" }}>This cycle</span>
            <h3 style={{ color: "var(--map-fg)", marginTop: 6, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500 }}>The light is spreading.</h3>
            <p style={{ fontSize: 13, color: "var(--map-fg-muted)", marginTop: 8, marginBottom: 14 }}>Four new friends have been invited since the cycle began.</p>
            <button onClick={onOpenMap} className="btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "var(--map-fg)" }}>Open the map</button>
          </div>
        </div>
      </div>
    </div>
  );
};


const MapScreen = () => {
  const [filters, setFilters] = React.useState({
    showPaths: true, showNuclei: true, showLabels: true,
    activity: "All activities", range: "This cycle",
  });
  const [selected, setSelected] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: "url('../../assets/starfield-bg.svg') center/cover, var(--indigo-950)",
      overflow: "hidden",
    }}>
      <TopBar title="Northern Illinois Subregion Nucleus Map" />
      <FilterPanel filters={filters} setFilters={setFilters} />

      <div style={{ position: "absolute", inset: "88px 24px 96px 312px" }}>
        <GrowthMap onSelectPerson={(p) => setSelected(p)} selectedId={selected?.id} />
      </div>

      <PersonDetail person={selected} onClose={() => setSelected(null)} />
      <ActionBar onAdd={() => setAddOpen(true)} onAddActivity={() => setAddOpen(true)} onReports={() => {}} />
      <AddPersonModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

window.LoginScreen = LoginScreen;
window.DashboardScreen = DashboardScreen;
window.MapScreen = MapScreen;
