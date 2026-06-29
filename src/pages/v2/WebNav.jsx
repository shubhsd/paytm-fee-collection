import { Link } from "react-router-dom";
import { useVersion } from "../../hooks/useVersion";

export default function WebNav() {
  const { go } = useVersion();
  return (
    <header className="web-nav">
      <button className="web-nav-brand" onClick={() => go("/")}>
        <img
          className="web-nav-logo"
          src="/punjab-gov.svg"
          alt="Government of Punjab"
        />
        <span className="web-nav-title">Punjab Labour Department</span>
      </button>
      <nav className="web-nav-links">
        <button onClick={() => go("/")}>Home</button>
        <Link to="/">Switch version</Link>
      </nav>
    </header>
  );
}
