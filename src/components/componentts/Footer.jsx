"use client";

export default function Footer() {
  return (
    <footer
      className="text-[var(--background)] p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="560" preserveAspectRatio="none" viewBox="0 0 1440 560">
            <g mask="url(&quot;#SvgjsMask1004&quot;)" fill="none">
                <rect width="1440" height="560" x="0" y="0" fill="rgba(144, 27, 32, 1)"></rect>
                <path d="M0 0L442 0L0 50.47z" fill="rgba(255, 255, 255, .1)"></path>
                <path d="M0 50.47L442 0L667.76 0L0 248.93z" fill="rgba(255, 255, 255, .075)"></path>
                <path d="M0 248.93L667.76 0L1048.55 0L0 438.24z" fill="rgba(255, 255, 255, .05)"></path>
                <path d="M0 438.24L1048.55 0L1127.4299999999998 0L0 493.57z" fill="rgba(255, 255, 255, .025)"></path>
                <path d="M1440 560L967.79 560L1440 488.55z" fill="rgba(0, 0, 0, .1)"></path>
                <path d="M1440 488.55L967.79 560L740.1899999999999 560L1440 227.06z" fill="rgba(0, 0, 0, .075)"></path>
                <path d="M1440 227.06L740.19 560L381.96000000000004 560L1440 203.87z" fill="rgba(0, 0, 0, .05)"></path>
                <path d="M1440 203.87L381.96000000000004 560L175.17000000000004 560L1440 83.64z" fill="rgba(0, 0, 0, .025)"></path>
            </g>
            <defs>
                <mask id="SvgjsMask1004">
                    <rect width="1440" height="560" fill="#ffffff"></rect>
                </mask>
            </defs>
          </svg>`,
        )}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Bottom Bar */}
        <div className="border-t border-[#fafafa]/20 pt-4 text-center text-base font-semibold">
          <p className="drop-shadow-sm">
            &copy; {new Date().getFullYear()} ITI Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
