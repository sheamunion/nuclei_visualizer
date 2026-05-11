// Button.jsx
const Button = ({ variant = "primary", children, onClick, icon, type = "button", style = {} }) => {
  const cls = `btn btn-${variant}`;
  return (
    <button type={type} className={cls} onClick={onClick} style={style}>
      {icon ? <img src={`../../assets/icons/${icon}.svg`} alt="" style={{ width: 16, height: 16, opacity: 0.9, filter: variant === "primary" ? "brightness(0) invert(1)" : "none" }} /> : null}
      {children}
    </button>
  );
};

const IconButton = ({ icon, label, onClick, tone = "light" }) => {
  const style = {
    width: 36, height: 36, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center",
    border: "1px solid " + (tone === "dark" ? "var(--map-border)" : "var(--border)"),
    background: tone === "dark" ? "rgba(255,255,255,0.04)" : "var(--surface)",
    cursor: "pointer",
  };
  return (
    <button onClick={onClick} aria-label={label} style={style}>
      <img src={`../../assets/icons/${icon}.svg`} alt="" style={{ width: 18, height: 18, filter: tone === "dark" ? "brightness(0) invert(1)" : "none", opacity: 0.85 }} />
    </button>
  );
};

window.Button = Button;
window.IconButton = IconButton;
