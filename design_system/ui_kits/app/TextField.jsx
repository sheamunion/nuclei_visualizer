// TextField.jsx
const TextField = ({ label, type = "text", value, onChange, placeholder, hint, error, onDark = false }) => {
  const inputStyle = onDark ? { background: "rgba(255,255,255,0.06)", borderColor: "var(--map-border)", color: "var(--map-fg)" } : {};
  const labelColor = onDark ? "var(--map-fg)" : "var(--fg)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label ? <label style={{ fontSize: 12, fontWeight: 600, color: labelColor }}>{label}</label> : null}
      <input
        className={"input" + (onDark ? " input-on-dark" : "")}
        type={type}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, borderColor: error ? "var(--terracotta-500)" : undefined }}
      />
      {error ? <span style={{ fontSize: 11, color: "var(--terracotta-500)" }}>{error}</span>
        : hint ? <span style={{ fontSize: 11, color: onDark ? "var(--map-fg-muted)" : "var(--fg-muted)" }}>{hint}</span>
        : null}
    </div>
  );
};

window.TextField = TextField;
