/**
 * Stylized first-person pistol used when /assets/gun.png is missing.
 * Drawn horizontal (muzzle left) then rotated up-left toward the
 * crosshair; the grip runs off the bottom edge like a held weapon.
 */
export function GunArt() {
  return (
    <svg
      viewBox="0 0 560 430"
      className="pointer-events-none absolute bottom-0 left-0 w-[560px] select-none"
      aria-hidden
    >
      <g transform="rotate(34 430 330)">
        {/* slide */}
        <rect x="30" y="248" width="470" height="62" fill="#23232c" stroke="#000" strokeWidth="5" />
        <rect x="30" y="256" width="36" height="46" fill="var(--accent)" stroke="#000" strokeWidth="4" />
        <rect x="398" y="256" width="9" height="46" fill="#0f0f14" />
        <rect x="416" y="256" width="9" height="46" fill="#0f0f14" />
        <rect x="434" y="256" width="9" height="46" fill="#0f0f14" />
        <rect x="452" y="256" width="9" height="46" fill="#0f0f14" />
        {/* front + rear sights */}
        <rect x="76" y="230" width="20" height="18" fill="#1c1c24" stroke="#000" strokeWidth="4" />
        <rect x="470" y="228" width="24" height="20" fill="#1c1c24" stroke="#000" strokeWidth="4" />
        {/* frame */}
        <rect x="210" y="306" width="290" height="48" fill="#1c1c24" stroke="#000" strokeWidth="5" />
        <rect x="222" y="316" width="110" height="10" fill="var(--accent)" opacity="0.85" />
        {/* trigger guard */}
        <path
          d="M300 354 h70 v16 a42 42 0 0 1 -42 42 h-6 a34 34 0 0 1 -22 -34 z"
          fill="#17171d"
          stroke="#000"
          strokeWidth="5"
        />
        {/* grip (runs off-canvas like a held weapon) */}
        <polygon
          points="396,352 502,352 566,560 460,560"
          fill="#26262f"
          stroke="#000"
          strokeWidth="5"
        />
        <polygon points="424,384 502,384 512,412 432,412" fill="#17171d" />
        <polygon points="436,428 514,428 524,456 444,456" fill="#17171d" />
        {/* hammer */}
        <rect x="500" y="272" width="30" height="30" fill="#1c1c24" stroke="#000" strokeWidth="4" />
      </g>
    </svg>
  );
}
