import { useNavigate } from "react-router-dom";

const VERSIONS = [
  {
    id: "v1",
    badge: "Version 1",
    title: "Mobile preview",
    desc: "The finalised app shown in a phone frame — the mobile-first experience.",
    icon: "📱",
    to: "/v1",
  },
  {
    id: "v2",
    badge: "Version 2",
    title: "Full web experience",
    desc: "The same flow redesigned as a full-width desktop web app.",
    icon: "🖥️",
    to: "/v2",
  },
];

export default function VersionLanding() {
  const navigate = useNavigate();

  return (
    <div className="vl-shell">
      <div className="vl-head">
        <img className="vl-logo" src="/punjab-gov.svg" alt="Government of Punjab" />
        <h1 className="vl-title">Punjab Labour Department</h1>
        <p className="vl-sub">Payment Portal · choose a version to preview</p>
      </div>

      <div className="vl-grid">
        {VERSIONS.map((v) => (
          <button key={v.id} className="vl-card" onClick={() => navigate(v.to)}>
            <span className="vl-card-icon">{v.icon}</span>
            <span className="vl-badge">{v.badge}</span>
            <span className="vl-card-title">{v.title}</span>
            <span className="vl-card-desc">{v.desc}</span>
            <span className="vl-card-cta">Open {v.badge} →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
