// Chips.jsx — status pill + activity tag
const StatusChip = ({ status }) => {
  const map = {
    engaged:     { bg: "rgba(79,176,122,0.14)",  fg: "var(--green-700)",      dot: "var(--green-500)", label: "Engaged" },
    sustaining:  { bg: "rgba(229,169,59,0.16)",  fg: "var(--gold-700)",       dot: "var(--gold-500)",  label: "Sustaining" },
    invited:     { bg: "var(--neutral-100)",     fg: "var(--fg-muted)",        dot: "var(--neutral-400)", label: "Invited" },
    "not-invited": { bg: "var(--neutral-100)",   fg: "var(--fg-subtle)",       dot: "var(--neutral-300)", label: "Not yet invited" },
  };
  const s = map[status] || map.invited;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 22, padding: "0 8px", borderRadius: 999, background: s.bg, color: s.fg, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
};

const ActivityChip = ({ children }) => (
  <span className="chip">{children}</span>
);

window.StatusChip = StatusChip;
window.ActivityChip = ActivityChip;
