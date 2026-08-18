/**
 * Paper range target used when /assets/target.png is missing.
 * Same 625×858 aspect ratio as the original art.
 */
export function TargetArt() {
  return (
    <svg
      viewBox="0 0 625 858"
      className="block w-full select-none"
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden
    >
      {/* paper */}
      <rect x="8" y="8" width="609" height="842" fill="#e8e2d2" stroke="#0b0b10" strokeWidth="16" />
      <rect x="40" y="40" width="545" height="778" fill="none" stroke="#b9b2a0" strokeWidth="4" />
      {/* silhouette */}
      <circle cx="312" cy="240" r="95" fill="#1c1c24" />
      <path
        d="M150 818 v-330 q0 -110 162 -110 q163 0 163 110 v330 z"
        fill="#1c1c24"
      />
      {/* rings */}
      <circle cx="312" cy="500" r="150" fill="none" stroke="#e8e2d2" strokeWidth="8" />
      <circle cx="312" cy="500" r="100" fill="none" stroke="var(--accent)" strokeWidth="8" />
      <circle cx="312" cy="500" r="52" fill="var(--accent)" />
      <circle cx="312" cy="500" r="18" fill="#e8e2d2" />
      {/* corner marks */}
      <g fill="#1c1c24">
        <rect x="56" y="56" width="40" height="12" />
        <rect x="56" y="56" width="12" height="40" />
        <rect x="529" y="56" width="40" height="12" />
        <rect x="557" y="56" width="12" height="40" />
        <rect x="56" y="790" width="40" height="12" />
        <rect x="56" y="762" width="12" height="40" />
        <rect x="529" y="790" width="40" height="12" />
        <rect x="557" y="762" width="12" height="40" />
      </g>
    </svg>
  );
}
