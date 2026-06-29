import { useLocation, useNavigate } from "react-router-dom";

// Both UI versions live under /v1 (mobile preview) or /v2 (full web app).
// This hook resolves the current version base from the URL and builds
// version-scoped navigation, so pages don't hardcode the prefix.
export function useVersion() {
  const { pathname } = useLocation();
  const base = pathname.split("/")[1] === "v2" ? "/v2" : "/v1";
  const navigate = useNavigate();

  const go = (to, opts) => {
    if (typeof to === "number") return navigate(to); // e.g. go(-1)
    return navigate(`${base}${to === "/" ? "" : to}`, opts);
  };

  return { base, go };
}
