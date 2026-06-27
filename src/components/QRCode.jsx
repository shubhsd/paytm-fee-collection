// A lightweight decorative "QR code" — not a real encoder, just a
// deterministic pseudo-random module grid so each merchant gets a distinct,
// realistic-looking QR on the scan screen.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function FinderPattern({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" fill="#0f2747" />
      <rect x="1" y="1" width="5" height="5" fill="#fff" />
      <rect x="2" y="2" width="3" height="3" fill="#0f2747" />
    </g>
  );
}

export default function QRCode({ seed = "qr", size = 124 }) {
  const modules = 25;
  let state = hash(seed);
  const rand = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };

  // is this cell part of a finder pattern region (corners)?
  const inFinder = (r, c) =>
    (r < 8 && c < 8) || (r < 8 && c > modules - 9) || (r > modules - 9 && c < 8);

  const cells = [];
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (inFinder(r, c)) continue;
      if (rand() > 0.5) cells.push([r, c]);
    }
  }

  return (
    <svg
      className="qr-img"
      viewBox={`0 0 ${modules} ${modules}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code"
    >
      <rect width={modules} height={modules} fill="#fff" />
      {cells.map(([r, c]) => (
        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0f2747" />
      ))}
      <FinderPattern x={0} y={0} />
      <FinderPattern x={modules - 7} y={0} />
      <FinderPattern x={0} y={modules - 7} />
    </svg>
  );
}
