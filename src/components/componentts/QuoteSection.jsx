"use client";

import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="relative py-28 px-6 flex items-center justify-center text-center overflow-hidden">
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlnssvgjs="http://svgjs.dev/svgjs"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 560"
          className="w-full h-full object-cover"
        >
          <g mask="url(#SvgjsMask1070)" fill="none">
            <rect
              width="1440"
              height="560"
              x="0"
              y="0"
              fill="rgba(144, 27, 32, 1)"
            ></rect>
            <path
              d="M0,424.707C80.041,430.139,166.423,403.397,222.176,345.712C275.272,290.776,248.341,197.206,284.782,130.056C325.552,54.929,451.95,21.244,444.469,-63.905C437.135,-147.385,311.827,-159.437,254.018,-220.108C200.21,-276.58,187.472,-367.988,119.048,-405.439C45.713,-445.578,-48.735,-460.681,-125.646,-427.911C-201.208,-395.715,-238.213,-311.511,-274.422,-237.788C-303.916,-177.736,-304.471,-111.368,-313.662,-45.098C-322.8,20.79,-347.541,86.236,-328.188,149.878C-307.57,217.681,-257.941,271.319,-203.607,316.819C-143.502,367.151,-78.216,419.399,0,424.707"
              fill="#5e1215"
            ></path>
            <path
              d="M1440 1023.698C1526.5720000000001 1031.222 1620.273 994.826 1677.319 929.275 1731.5729999999999 866.933 1696.3229999999999 767.884 1728.769 691.876 1759.933 618.87 1853.4 578.5360000000001 1860.779 499.501 1868.433 417.51800000000003 1829.532 330.389 1767.58 276.15 1707.548 223.59199999999998 1615.594 244.873 1540.181 218.81599999999997 1459.466 190.92700000000002 1395.316 110.543 1310.257 118.13499999999999 1222.375 125.97899999999998 1147.73 190.075 1092.379 258.785 1038.1190000000001 326.14099999999996 993.473 411.65700000000004 1004.7180000000001 497.416 1015.467 579.397 1108.452 620.868 1149.283 692.766 1184.982 755.626 1180.078 835.898 1227.788 890.2080000000001 1284.0819999999999 954.289 1355.024 1016.313 1440 1023.698"
              fill="#c2252b"
            ></path>
          </g>
          <defs>
            <mask id="SvgjsMask1070">
              <rect width="1440" height="560" fill="#ffffff"></rect>
            </mask>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <motion.blockquote
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto text-white text-4xl md:text-5xl font-bold leading-snug tracking-wide"
      >
        "You bring the passion. We bring the tools, the mentors, and the
        support. Let's build something extraordinary — together."
      </motion.blockquote>
    </section>
  );
}
