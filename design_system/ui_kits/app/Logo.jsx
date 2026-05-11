// Logo.jsx — brand mark with size + tone variants
const Logo = ({ size = 64, tone = "dark", showWordmark = false }) => {
  const lockup = tone === "light" ? "../../assets/logo-lockup-light.svg" : "../../assets/logo-lockup.svg";
  const mark = "../../assets/logo-mark.svg";
  if (showWordmark) {
    return <img src={lockup} alt="Nucleus Visualizer" style={{ height: size }} />;
  }
  return <img src={mark} alt="Nucleus Visualizer" style={{ width: size, height: size }} />;
};

window.Logo = Logo;
