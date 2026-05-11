// MapChrome.jsx — TopBar / FilterPanel / ActionBar / PersonDetail / AddPersonModal

const TopBar = ({ title, onSearch }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 64,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 24px",
    background: "rgba(10,26,53,0.55)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--map-border)",
    zIndex: 5,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img src="../../assets/logo-mark.svg" alt="" style={{ width: 32, height: 32 }} />
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, color: "var(--map-fg)", margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative" }}>
        <img src="../../assets/icons/search.svg" alt="" style={{ position: "absolute", left: 10, top: 10, width: 16, height: 16, filter: "brightness(0) invert(1)", opacity: 0.6 }} />
        <input className="input input-on-dark" placeholder="Search" onChange={(e) => onSearch && onSearch(e.target.value)}
          style={{ width: 280, height: 36, paddingLeft: 34, fontSize: 13 }} />
      </div>
      <IconButton icon="bell" label="Notifications" tone="dark" />
      <IconButton icon="settings" label="Settings" tone="dark" />
    </div>
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button onClick={() => onChange(!on)} aria-pressed={on}
    style={{
      width: 36, height: 20, borderRadius: 999, padding: 0,
      background: on ? "var(--green-500)" : "rgba(255,255,255,0.18)",
      border: "none", position: "relative", cursor: "pointer", transition: "background 180ms",
    }}>
    <span style={{
      position: "absolute", top: 2, left: on ? 18 : 2,
      width: 16, height: 16, borderRadius: "50%", background: "white",
      transition: "left 180ms cubic-bezier(0.22,1,0.36,1)",
    }} />
  </button>
);

const FilterRow = ({ label, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--map-fg-muted)" }}>{label}</span>
    {children}
  </div>
);

const Select = ({ value, onChange, options }) => (
  <div style={{ position: "relative" }}>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{
        appearance: "none", WebkitAppearance: "none",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid var(--map-border)",
        borderRadius: 8, color: "var(--map-fg)",
        padding: "8px 30px 8px 12px",
        fontFamily: "var(--font-sans)", fontSize: 13,
        width: "100%", cursor: "pointer",
      }}>
      {options.map(o => <option key={o} value={o} style={{ background: "#15294A" }}>{o}</option>)}
    </select>
    <img src="../../assets/icons/chevron-down.svg" alt=""
      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, filter: "brightness(0) invert(1)", opacity: 0.6, pointerEvents: "none" }} />
  </div>
);

const FilterPanel = ({ filters, setFilters }) => (
  <div className="card-glass" style={{
    position: "absolute", left: 24, top: 88, width: 264, zIndex: 4,
    padding: "18px 18px 22px",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, color: "var(--map-fg)", margin: 0 }}>Filters &amp; controls</h3>
      <img src="../../assets/icons/filter.svg" alt="" style={{ width: 16, height: 16, filter: "brightness(0) invert(1)", opacity: 0.5 }} />
    </div>
    <FilterRow label="Show paths">
      <Toggle on={filters.showPaths} onChange={(v) => setFilters({ ...filters, showPaths: v })} />
    </FilterRow>
    <FilterRow label="Show nuclei">
      <Toggle on={filters.showNuclei} onChange={(v) => setFilters({ ...filters, showNuclei: v })} />
    </FilterRow>
    <FilterRow label="Show labels">
      <Toggle on={filters.showLabels} onChange={(v) => setFilters({ ...filters, showLabels: v })} />
    </FilterRow>
    <div style={{ height: 1, background: "var(--map-border)", margin: "10px -2px" }} />
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="eyebrow" style={{ color: "rgba(246,241,230,0.55)" }}>Activity</span>
      <Select value={filters.activity} onChange={(v) => setFilters({ ...filters, activity: v })}
        options={["All activities", "Study circle", "Children's class", "Junior youth", "Devotional", "Home visit"]} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
      <span className="eyebrow" style={{ color: "rgba(246,241,230,0.55)" }}>Date range</span>
      <Select value={filters.range} onChange={(v) => setFilters({ ...filters, range: v })}
        options={["This cycle", "Last 90 days", "Last year", "All time"]} />
    </div>
  </div>
);

const ActionBar = ({ onAdd, onAddActivity, onReports }) => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0, height: 72,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 32,
    background: "rgba(10,26,53,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    borderTop: "1px solid var(--map-border)", zIndex: 5,
  }}>
    <button onClick={onAdd} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "var(--map-fg)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
      <img src="../../assets/icons/plus-circle.svg" alt="" style={{ width: 22, height: 22, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
      Add new person
    </button>
    <button onClick={onAddActivity} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "var(--map-fg)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
      <img src="../../assets/icons/plus-circle.svg" alt="" style={{ width: 22, height: 22, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
      Add new activity
    </button>
    <div style={{ flex: 1 }} />
    <button onClick={onReports} style={{ position: "absolute", right: 28, display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "var(--gold-500)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
      <img src="../../assets/icons/chart.svg" alt="" style={{ width: 20, height: 20, filter: "invert(72%) sepia(40%) saturate(620%) hue-rotate(2deg)" }} />
      View reports &amp; insights
    </button>
  </div>
);

const PersonDetail = ({ person, onClose }) => {
  if (!person) return null;
  const names = ["Rúhíyyih M.", "Nabíl A.", "Shoghi V.", "Bahíyyih K.", "Tahirih S.", "Mírzá B.", "Anís D.", "Lua O.", "Hand R.", "Marion J.", "Hooper C.", "Curtis K.", "Selma O.", "Layli K.", "Riaz B."];
  const nucleusLabels = { n1: "Lakeshore", n2: "Riverside", n3: "Heartland", n4: "Forest Park", n5: "Eastview" };
  const seed = parseInt(person.id.replace("p", ""), 10) || 0;
  const name = names[seed % names.length];
  const activities = [
    "Hosting a devotional gathering on Tuesdays",
    "Accompanying three friends through Book 1",
    "Visited Layli K. on May 3",
  ].slice(0, (seed % 3) + 1);
  return (
    <div style={{
      position: "absolute", top: 88, right: 24, width: 340, zIndex: 6,
      background: "rgba(20,38,68,0.85)",
      backdropFilter: "blur(20px) saturate(120%)",
      WebkitBackdropFilter: "blur(20px) saturate(120%)",
      border: "1px solid var(--map-border)", borderRadius: 16,
      color: "var(--map-fg)", padding: 22,
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: person.status === "sustaining" ? "var(--gold-500)" : person.status === "engaged" ? "var(--green-500)" : "var(--cream-100)",
            color: person.status === "invited" ? "var(--indigo-900)" : "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500,
            boxShadow: person.status === "sustaining" ? "0 0 24px rgba(229,169,59,0.5)" : "0 0 16px rgba(155,227,184,0.4)",
          }}>{name.split(" ").map(s => s[0]).join("").slice(0,2)}</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: "var(--map-fg-muted)" }}>{nucleusLabels[person.nucleus]} nucleus</div>
          </div>
        </div>
        <IconButton icon="close" label="Close" tone="dark" onClick={onClose} />
      </div>

      <div style={{ marginTop: 16, marginBottom: 18 }}>
        <StatusChip status={person.status} />
      </div>

      <div style={{ height: 1, background: "var(--map-border)", margin: "0 -4px 14px" }} />

      <span className="eyebrow" style={{ color: "rgba(246,241,230,0.55)" }}>Recent</span>
      <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {activities.map((a, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-300)", marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--map-fg)" }}>{a}</span>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
        <Button variant="primary" style={{ flex: 1 }}>Log a visit</Button>
        <Button variant="secondary" style={{ flex: 1, background: "transparent", color: "var(--map-fg)", borderColor: "var(--map-border)" }}>View profile</Button>
      </div>
    </div>
  );
};

const AddPersonModal = ({ open, onClose, onSubmit }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [nucleus, setNucleus] = React.useState("Lakeshore");
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,18,40,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 440, background: "var(--cream-50)", borderRadius: 20, padding: 28, boxShadow: "var(--shadow-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0, fontWeight: 500 }}>Add a friend</h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </div>
        <p style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 0, marginBottom: 18 }}>
          Add someone you've been accompanying. You can fill in more later.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <TextField label="Name" value={name} onChange={setName} placeholder="e.g. Marion J." />
          <TextField label="Email (optional)" value={email} onChange={setEmail} placeholder="friend@example.org" />
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Nucleus</label>
            <select value={nucleus} onChange={(e) => setNucleus(e.target.value)} className="input" style={{ appearance: "none" }}>
              {["Lakeshore", "Riverside", "Heartland", "Forest Park", "Eastview"].map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 22 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onSubmit && onSubmit({ name, email, nucleus }); onClose(); }}>Add friend</Button>
        </div>
      </div>
    </div>
  );
};

window.TopBar = TopBar;
window.FilterPanel = FilterPanel;
window.ActionBar = ActionBar;
window.PersonDetail = PersonDetail;
window.AddPersonModal = AddPersonModal;
window.Toggle = Toggle;
