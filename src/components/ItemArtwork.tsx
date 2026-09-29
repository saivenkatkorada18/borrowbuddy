// src/components/ItemArtwork.tsx — Rich SVG illustrations per category with Indian student essentials
import { motion, MotionConfig } from 'motion/react';
import type { Category } from '../types';

interface ItemArtworkProps {
  category: Category | string;
  seed: number;
  size?: number;
  className?: string;
  float?: boolean;
}

// Colour variants per seed
const getVariant = (seed: number) => {
  const variants = [
    { bg: '#EEF2FF', accent: '#4338CA', highlight: '#A5B4FC', secondary: '#818CF8' },
    { bg: '#F0FDF9', accent: '#0D9488', highlight: '#5EEAD4', secondary: '#2DD4BF' },
    { bg: '#FFF7ED', accent: '#EA580C', highlight: '#FDBA74', secondary: '#FB923C' },
    { bg: '#FFF1F2', accent: '#E11D48', highlight: '#FDA4AF', secondary: '#FB7185' },
    { bg: '#F0FFF4', accent: '#16A34A', highlight: '#86EFAC', secondary: '#4ADE80' },
    { bg: '#FFFBEB', accent: '#D97706', highlight: '#FCD34D', secondary: '#FBBF24' },
    { bg: '#FAF5FF', accent: '#7E22CE', highlight: '#D8B4FE', secondary: '#C084FC' },
    { bg: '#EFF6FF', accent: '#2563EB', highlight: '#93C5FD', secondary: '#60A5FA' },
  ];
  return variants[Math.abs(seed) % variants.length];
};

// 1. Calculators (Casio FX-991EX / Scientific style)
function CalculatorArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  const screenText = seed % 2 === 0 ? '∑(x²) = 420' : 'sin(30°) = 0.5';
  return (
    <g>
      <rect x="28" y="20" width="64" height="82" rx="10" fill={v.accent} />
      <rect x="34" y="25" width="52" height="6" rx="2" fill="#1E1B4B" opacity="0.6" />
      {/* Solar strip */}
      <rect x="62" y="26" width="20" height="4" rx="1" fill="#78350F" />
      {/* LCD Screen */}
      <rect x="34" y="34" width="52" height="18" rx="4" fill="#E2E8F0" />
      <text x="38" y="46" fontSize="6.5" fontFamily="monospace" fill="#0F172A" fontWeight="bold">
        {screenText}
      </text>
      {/* Function keys */}
      <rect x="35" y="56" width="10" height="6" rx="2" fill={v.highlight} />
      <rect x="49" y="56" width="10" height="6" rx="2" fill={v.highlight} />
      <rect x="63" y="56" width="10" height="6" rx="2" fill={v.highlight} />
      <rect x="76" y="56" width="10" height="6" rx="2" fill="#FF6B4A" />
      {/* Number grid */}
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={36 + col * 12.5}
            y={66 + row * 10}
            width="9.5"
            height="7"
            rx="2"
            fill={row === 2 && col === 3 ? '#10B981' : 'white'}
            opacity={row === 2 && col === 3 ? 0.95 : 0.85}
          />
        ))
      )}
    </g>
  );
}

// 2. Lab Coats & Medical (Lab coat, pocket, pen, stethoscope variant)
function LabCoatArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  if (seed % 3 === 0) {
    // Stethoscope
    return (
      <g>
        <path d="M 40 25 C 40 60, 80 60, 80 25" fill="none" stroke={v.accent} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="38" y1="23" x2="42" y2="23" stroke={v.highlight} strokeWidth="3" strokeLinecap="round" />
        <line x1="78" y1="23" x2="82" y2="23" stroke={v.highlight} strokeWidth="3" strokeLinecap="round" />
        <path d="M 60 55 L 60 82" stroke={v.accent} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="60" cy="88" r="14" fill={v.highlight} stroke={v.accent} strokeWidth="3.5" />
        <circle cx="60" cy="88" r="7" fill={v.accent} />
      </g>
    );
  }
  return (
    <g>
      {/* Coat body */}
      <path d="M 28 32 L 45 20 Q 60 30 75 20 L 92 32 L 96 98 L 24 98 Z" fill="white" stroke={v.accent} strokeWidth="3" />
      {/* Collar lapels */}
      <path d="M 45 20 L 60 52 L 75 20" fill="none" stroke={v.accent} strokeWidth="2.5" />
      {/* Pocket */}
      <rect x="34" y="58" width="18" height="20" rx="3" fill={v.highlight} opacity="0.4" stroke={v.accent} strokeWidth="1.5" />
      {/* Pen in pocket */}
      <line x1="44" y1="53" x2="44" y2="65" stroke="#FF6B4A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Buttons */}
      <circle cx="60" cy="60" r="2.5" fill={v.accent} />
      <circle cx="60" cy="73" r="2.5" fill={v.accent} />
      <circle cx="60" cy="86" r="2.5" fill={v.accent} />
    </g>
  );
}

// 3. Books & Syllabus Notes
function BooksArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  return (
    <g>
      {/* Bottom book (Grewal / Core) */}
      <rect x="18" y="72" width="84" height="17" rx="3" fill={v.accent} />
      <rect x="18" y="72" width="9" height="17" rx="2" fill="rgba(0,0,0,0.2)" />
      <line x1="32" y1="80" x2="88" y2="80" stroke="white" strokeWidth="2" strokeDasharray="3 2" opacity="0.8" />
      {/* Middle book */}
      <rect x="22" y="52" width="76" height="17" rx="3" fill={v.secondary} />
      <rect x="22" y="52" width="8" height="17" rx="2" fill="rgba(0,0,0,0.2)" />
      <line x1="35" y1="60" x2="85" y2="60" stroke="white" strokeWidth="2" opacity="0.9" />
      {/* Top book */}
      <rect x="26" y="32" width="68" height="17" rx="3" fill={v.highlight} />
      <rect x="26" y="32" width="7" height="17" rx="2" fill={v.accent} opacity="0.4" />
      {/* Bookmark ribbon */}
      <path d="M 68 32 L 68 55 L 73 50 L 78 55 L 78 32 Z" fill="#FF6B4A" />
      {/* Syllabus tag */}
      {seed % 2 === 0 && (
        <text x="38" y="44" fontSize="6" fontWeight="bold" fill={v.accent}>
          EDITION 2025
        </text>
      )}
    </g>
  );
}

// 4. Chargers & Cables
function ChargersArt({ v }: { v: ReturnType<typeof getVariant> }) {
  return (
    <g>
      {/* Power brick */}
      <rect x="36" y="24" width="48" height="42" rx="8" fill={v.accent} />
      {/* Metal prongs */}
      <rect x="47" y="14" width="7" height="10" rx="1.5" fill="#94A3B8" />
      <rect x="66" y="14" width="7" height="10" rx="1.5" fill="#94A3B8" />
      {/* Type C port */}
      <rect x="52" y="54" width="16" height="6" rx="3" fill="#1E1B4B" />
      {/* Fast charging icon */}
      <path d="M 61 32 L 56 42 L 60 42 L 58 48 L 65 38 L 61 38 Z" fill="#FBBF24" />
      {/* Coiled cable loop */}
      <path d="M 60 60 C 60 90, 85 92, 85 76 C 85 62, 35 68, 35 88 C 35 102, 70 102, 80 94" fill="none" stroke={v.highlight} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

// 5. Travel Adapters
function AdaptersArt({ v }: { v: ReturnType<typeof getVariant> }) {
  return (
    <g>
      {/* Adapter Cube */}
      <rect x="32" y="28" width="56" height="56" rx="12" fill={v.accent} />
      <rect x="36" y="32" width="48" height="48" rx="8" fill={v.secondary} opacity="0.3" />
      {/* Multi-socket face */}
      <circle cx="50" cy="46" r="4" fill="#1E1B4B" />
      <circle cx="70" cy="46" r="4" fill="#1E1B4B" />
      <rect x="56" y="54" width="8" height="14" rx="2" fill="#1E1B4B" />
      <circle cx="60" cy="40" r="3.5" fill="#1E1B4B" />
      {/* Slider switches on side */}
      <rect x="89" y="36" width="4" height="10" rx="2" fill={v.highlight} />
      <rect x="89" y="52" width="4" height="10" rx="2" fill={v.highlight} />
      {/* USB ports on bottom */}
      <rect x="42" y="85" width="10" height="5" rx="1" fill="#475569" />
      <rect x="56" y="85" width="10" height="5" rx="1" fill="#475569" />
      <rect x="70" y="85" width="8" height="5" rx="2" fill="#38BDF8" />
    </g>
  );
}

// 6. Power Banks
function PowerBanksArt({ v }: { v: ReturnType<typeof getVariant> }) {
  return (
    <g>
      {/* Power bank body */}
      <rect x="35" y="22" width="50" height="78" rx="10" fill={v.accent} />
      <rect x="39" y="26" width="42" height="70" rx="6" fill={v.highlight} opacity="0.25" />
      {/* 4 LED battery indicator dots */}
      <circle cx="46" cy="36" r="2.5" fill="#34D399" />
      <circle cx="54" cy="36" r="2.5" fill="#34D399" />
      <circle cx="62" cy="36" r="2.5" fill="#34D399" />
      <circle cx="70" cy="36" r="2.5" fill="#94A3B8" opacity="0.6" />
      {/* Capacity label */}
      <text x="60" y="70" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" opacity="0.9" letterSpacing="0.5">
        20000 mAh
      </text>
      {/* USB Output Ports on Top */}
      <rect x="43" y="18" width="12" height="4" rx="1" fill="#1E293B" />
      <rect x="63" y="18" width="12" height="4" rx="1" fill="#1E293B" />
    </g>
  );
}

// 7. Laptops (Open screen + keyboard deck)
function LaptopsArt({ v }: { v: ReturnType<typeof getVariant> }) {
  return (
    <g>
      {/* Display screen */}
      <rect x="26" y="22" width="68" height="46" rx="5" fill="#0F172A" stroke={v.accent} strokeWidth="3" />
      {/* Inner screen content */}
      <rect x="30" y="26" width="60" height="38" rx="2" fill="#1E1B4B" />
      {/* Code syntax lines */}
      <rect x="34" y="32" width="24" height="3" rx="1" fill="#38BDF8" />
      <rect x="34" y="39" width="38" height="3" rx="1" fill={v.highlight} />
      <rect x="40" y="46" width="28" height="3" rx="1" fill="#34D399" />
      <rect x="40" y="53" width="18" height="3" rx="1" fill="#F472B6" />
      {/* Webcam dot */}
      <circle cx="60" cy="24" r="1.2" fill="#64748B" />
      {/* Base keyboard deck */}
      <polygon points="16,86 104,86 96,69 24,69" fill={v.accent} />
      <polygon points="22,83 98,83 92,72 28,72" fill={v.highlight} opacity="0.4" />
      {/* Trackpad */}
      <rect x="50" y="76" width="20" height="7" rx="1.5" fill="white" opacity="0.5" />
    </g>
  );
}

// 8. Headphones (Over-ear or TWS earbuds)
function HeadphonesArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  if (seed % 2 === 0) {
    // TWS earbuds case open with buds
    return (
      <g>
        <rect x="32" y="44" width="56" height="42" rx="16" fill={v.accent} />
        <ellipse cx="60" cy="44" rx="28" ry="12" fill={v.highlight} opacity="0.5" />
        {/* Earbuds resting in slot */}
        <circle cx="48" cy="42" r="7" fill="white" />
        <rect x="46" y="44" width="4" height="14" rx="2" fill="white" />
        <circle cx="72" cy="42" r="7" fill="white" />
        <rect x="70" y="44" width="4" height="14" rx="2" fill="white" />
        {/* Charging LED */}
        <circle cx="60" cy="68" r="2.5" fill="#34D399" />
      </g>
    );
  }
  return (
    <g>
      {/* Headband */}
      <path d="M 28 62 C 28 26, 92 26, 92 62" fill="none" stroke={v.accent} strokeWidth="6" strokeLinecap="round" />
      <path d="M 38 42 C 45 32, 75 32, 82 42" fill="none" stroke={v.highlight} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      {/* Left earcup */}
      <rect x="20" y="54" width="16" height="28" rx="8" fill={v.accent} />
      <rect x="28" y="58" width="6" height="20" rx="3" fill={v.highlight} />
      {/* Right earcup */}
      <rect x="84" y="54" width="16" height="28" rx="8" fill={v.accent} />
      <rect x="86" y="58" width="6" height="20" rx="3" fill={v.highlight} />
      {/* Sound waves subtle */}
      <path d="M 14 62 Q 10 68 14 74" fill="none" stroke={v.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M 106 62 Q 110 68 106 74" fill="none" stroke={v.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

// 9. Electronics (Multimeter, Arduino, Bluetooth Speaker)
function ElectronicsArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  if (seed % 3 === 0) {
    // Arduino Uno Board
    return (
      <g>
        <rect x="24" y="30" width="72" height="58" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
        {/* USB connector */}
        <rect x="18" y="36" width="12" height="14" rx="2" fill="#94A3B8" />
        {/* Microcontroller ATmega chip */}
        <rect x="48" y="48" width="28" height="14" rx="2" fill="#0F172A" />
        {/* Pin headers top & bottom */}
        <rect x="36" y="32" width="52" height="5" rx="1" fill="#1E293B" />
        <rect x="42" y="81" width="46" height="5" rx="1" fill="#1E293B" />
        {/* Reset button */}
        <circle cx="32" cy="40" r="3" fill="#DC2626" />
        {/* Power LED */}
        <circle cx="86" cy="44" r="2" fill="#22C55E" />
      </g>
    );
  }
  // Digital Multimeter
  return (
    <g>
      <rect x="32" y="22" width="56" height="78" rx="10" fill={v.accent} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      {/* LCD screen */}
      <rect x="40" y="30" width="40" height="18" rx="3" fill="#D9F99D" />
      <text x="44" y="43" fontSize="8" fontFamily="monospace" fill="#14532D" fontWeight="bold">
        230.4 V
      </text>
      {/* Rotary dial */}
      <circle cx="60" cy="65" r="14" fill="#1E293B" />
      <line x1="60" y1="65" x2="60" y2="54" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Probe jacks */}
      <circle cx="46" cy="88" r="3.5" fill="#DC2626" />
      <circle cx="60" cy="88" r="3.5" fill="#0F172A" />
      <circle cx="74" cy="88" r="3.5" fill="#F59E0B" />
    </g>
  );
}

// 10. Umbrellas
function UmbrellasArt({ v }: { v: ReturnType<typeof getVariant> }) {
  return (
    <g>
      {/* Canopy */}
      <path d="M 60 25 Q 20 40 20 68 Q 60 70 60 70 Q 100 70 100 68 Q 100 40 60 25 Z" fill={v.accent} />
      {/* Canopy stripes */}
      <path d="M 60 25 Q 40 48 20 68" stroke="white" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M 60 25 Q 80 48 100 68" stroke="white" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M 60 25 L 60 70" stroke="white" strokeWidth="1.5" opacity="0.5" />
      {/* Scallop edge */}
      <path d="M 20 68 Q 30 62 40 68 Q 50 62 60 68 Q 70 62 80 68 Q 90 62 100 68" fill="none" stroke={v.highlight} strokeWidth="2" />
      {/* Shaft & J-handle */}
      <path d="M 60 70 L 60 92 Q 60 102 50 102 Q 42 102 42 94" fill="none" stroke={v.accent} strokeWidth="4" strokeLinecap="round" />
      {/* Ferrule tip */}
      <circle cx="60" cy="25" r="3.5" fill={v.highlight} />
      {/* Rain drops */}
      <circle cx="28" cy="26" r="2" fill="#38BDF8" opacity="0.7" />
      <circle cx="92" cy="30" r="2" fill="#38BDF8" opacity="0.7" />
    </g>
  );
}

// 11. Sports Gear (Cricket bat + ball, Badminton racket, Carrom board, Basketball)
function SportsArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  const mod = seed % 3;
  if (mod === 0) {
    // Kashmir Willow Cricket Bat + Red Leather Ball
    return (
      <g>
        {/* Bat blade */}
        <polygon points="48,34 68,26 84,76 64,84" fill="#D97706" stroke="#92400E" strokeWidth="2" />
        <line x1="58" y1="30" x2="74" y2="80" stroke="#FDE68A" strokeWidth="2" opacity="0.7" />
        {/* Handle with rubber grip */}
        <line x1="48" y1="34" x2="32" y2="18" stroke={v.accent} strokeWidth="6" strokeLinecap="round" />
        <line x1="36" y1="22" x2="34" y2="20" stroke="white" strokeWidth="2" />
        {/* Red seam cricket ball */}
        <circle cx="44" cy="80" r="14" fill="#DC2626" />
        <path d="M 34 76 Q 44 80 54 84" fill="none" stroke="white" strokeWidth="2" strokeDasharray="2 1.5" />
      </g>
    );
  }
  if (mod === 1) {
    // Badminton racket + shuttlecock
    return (
      <g>
        {/* Oval racket head */}
        <ellipse cx="60" cy="40" rx="24" ry="28" fill="none" stroke={v.accent} strokeWidth="3.5" />
        {/* String grid */}
        <line x1="48" y1="20" x2="48" y2="60" stroke={v.highlight} strokeWidth="1" opacity="0.6" />
        <line x1="60" y1="12" x2="60" y2="68" stroke={v.highlight} strokeWidth="1" opacity="0.6" />
        <line x1="72" y1="20" x2="72" y2="60" stroke={v.highlight} strokeWidth="1" opacity="0.6" />
        <line x1="40" y1="34" x2="80" y2="34" stroke={v.highlight} strokeWidth="1" opacity="0.6" />
        <line x1="40" y1="46" x2="80" y2="46" stroke={v.highlight} strokeWidth="1" opacity="0.6" />
        {/* Shaft & Handle */}
        <line x1="60" y1="68" x2="60" y2="105" stroke={v.accent} strokeWidth="4" strokeLinecap="round" />
        <rect x="57" y="88" width="6" height="17" rx="2" fill="#F59E0B" />
        {/* Shuttlecock */}
        <polygon points="90,75 104,65 106,75" fill="white" opacity="0.9" />
        <circle cx="92" cy="74" r="4" fill="#DC2626" />
      </g>
    );
  }
  // Basketball / Volleyball
  return (
    <g>
      <circle cx="60" cy="60" r="38" fill={v.accent} />
      <path d="M 60 22 Q 32 60 60 98" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" />
      <path d="M 60 22 Q 88 60 60 98" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" />
      <line x1="22" y1="60" x2="98" y2="60" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" />
      <ellipse cx="48" cy="42" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-30 48 42)" />
    </g>
  );
}

// 12. Tools (Drill, Screwdriver Set, Hammer)
function ToolsArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  if (seed % 2 === 0) {
    // Cordless Drill
    return (
      <g>
        <rect x="25" y="42" width="55" height="26" rx="7" fill={v.accent} />
        <rect x="40" y="60" width="22" height="30" rx="6" fill={v.accent} opacity="0.85" />
        <rect x="36" y="86" width="30" height="12" rx="3" fill="#1E293B" />
        <rect x="78" y="47" width="18" height="16" rx="3" fill={v.highlight} />
        <line x1="96" y1="55" x2="114" y2="55" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="54" cy="68" rx="4" ry="2.5" fill="#F59E0B" />
      </g>
    );
  }
  // Precision Screwdriver Kit
  return (
    <g>
      <rect x="26" y="24" width="68" height="74" rx="8" fill="#1E293B" />
      <rect x="32" y="30" width="56" height="62" rx="5" fill="#334155" />
      {/* Main handle */}
      <rect x="42" y="36" width="10" height="50" rx="3" fill={v.accent} />
      <rect x="45" y="32" width="4" height="6" rx="1" fill="#94A3B8" />
      {/* Rows of bits */}
      {[0, 1, 2].map((col) =>
        [0, 1, 2, 3].map((row) => (
          <circle key={`${col}-${row}`} cx={58 + col * 8} cy={42 + row * 11} r="2.5" fill="#CBD5E1" />
        ))
      )}
    </g>
  );
}

// 13. Kitchen (Induction stove, Electric Kettle, Mixer Grinder)
function KitchenArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  if (seed % 2 === 0) {
    // Stainless Steel Electric Kettle
    return (
      <g>
        {/* Kettle body */}
        <path d="M 38 42 L 44 84 L 78 84 L 84 42 Z" fill={v.accent} stroke="#0F172A" strokeWidth="2" />
        <ellipse cx="61" cy="42" rx="23" ry="8" fill={v.highlight} />
        {/* Lid handle */}
        <circle cx="61" cy="34" r="4" fill="#0F172A" />
        {/* Base heater plate */}
        <ellipse cx="61" cy="88" rx="26" ry="6" fill="#1E293B" />
        {/* Spout */}
        <polygon points="38,46 24,52 39,58" fill={v.accent} />
        {/* Side handle */}
        <path d="M 82 46 C 104 50, 104 76, 76 80" fill="none" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
        {/* Power switch indicator */}
        <circle cx="61" cy="78" r="2.5" fill="#EF4444" />
      </g>
    );
  }
  // Induction Cooktop
  return (
    <g>
      <rect x="22" y="32" width="76" height="60" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="3" />
      {/* Heating coil circle */}
      <circle cx="54" cy="60" r="22" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 3" />
      <circle cx="54" cy="60" r="14" fill="none" stroke="#F97316" strokeWidth="2" />
      <circle cx="54" cy="60" r="6" fill="#F59E0B" />
      {/* Touch buttons panel on right */}
      <rect x="82" y="42" width="10" height="38" rx="3" fill="#1E293B" />
      <circle cx="87" cy="48" r="2" fill="#22C55E" />
      <circle cx="87" cy="56" r="2" fill="white" opacity="0.8" />
      <circle cx="87" cy="64" r="2" fill="white" opacity="0.8" />
      <circle cx="87" cy="72" r="2" fill="#EF4444" />
    </g>
  );
}

// 14. Stationery (Mini-drafter, Geometry box, Drawing board)
function StationeryArt({ v }: { v: ReturnType<typeof getVariant> }) {
  return (
    <g>
      {/* Drawing board base */}
      <rect x="22" y="24" width="76" height="64" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
      {/* Set square triangle */}
      <polygon points="34,76 74,76 34,36" fill={v.accent} opacity="0.8" />
      <polygon points="40,70 62,70 40,48" fill="white" opacity="0.9" />
      {/* Compass / Protractor */}
      <path d="M 55 42 A 18 18 0 0 1 85 42 Z" fill={v.highlight} opacity="0.85" />
      {/* Technical Pen */}
      <line x1="30" y1="20" x2="88" y2="78" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
      <line x1="88" y1="78" x2="94" y2="84" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

// 15. Hostel Essentials (Heavy Dry Iron Box, Flexible Study Lamp, Table Fan)
function HostelEssentialsArt({ v, seed }: { v: ReturnType<typeof getVariant>; seed: number }) {
  if (seed % 2 === 0) {
    // Heavy Dry Iron Box
    return (
      <g>
        {/* Soleplate */}
        <polygon points="26,82 88,82 102,74 26,74" fill="#94A3B8" />
        {/* Iron body */}
        <path d="M 28 74 L 84 74 Q 96 68 86 52 L 40 52 Z" fill={v.accent} />
        {/* Top Handle */}
        <path d="M 32 52 L 32 36 Q 32 30 40 30 L 76 30 Q 84 30 84 42 L 84 52" fill="none" stroke="#1E1B4B" strokeWidth="7" strokeLinecap="round" />
        {/* Temperature Fabric Dial */}
        <circle cx="62" cy="62" r="8" fill="#F59E0B" />
        <circle cx="62" cy="62" r="4" fill="#1E1B4B" />
      </g>
    );
  }
  // Flexible Study Table Lamp
  return (
    <g>
      {/* Base */}
      <ellipse cx="60" cy="88" rx="24" ry="7" fill={v.accent} />
      <circle cx="60" cy="88" r="3" fill="#F59E0B" />
      {/* Gooseneck arm */}
      <path d="M 60 85 C 60 55, 30 50, 48 30" fill="none" stroke="#1E1B4B" strokeWidth="5" strokeLinecap="round" />
      {/* Lamp cone shade */}
      <polygon points="42,24 64,16 68,36 46,44" fill={v.accent} />
      {/* Light cone beam */}
      <polygon points="46,44 68,36 88,82 30,82" fill="#FEF08A" opacity="0.35" />
    </g>
  );
}

// 16. Cameras (DSLR Canon EOS / Action Cam)
function CamerasArt({ v }: { v: ReturnType<typeof getVariant> }) {
  return (
    <g>
      {/* Camera Body */}
      <rect x="24" y="34" width="72" height="52" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      {/* Grip on right */}
      <rect x="80" y="38" width="12" height="44" rx="4" fill="#334155" />
      {/* Flash viewfinder bump on top */}
      <polygon points="46,34 54,24 66,24 74,34" fill="#0F172A" />
      {/* Shutter button */}
      <rect x="82" y="28" width="8" height="6" rx="2" fill="#EF4444" />
      {/* Mode dial */}
      <rect x="32" y="28" width="8" height="6" rx="1.5" fill="#94A3B8" />
      {/* Lens housing */}
      <circle cx="54" cy="62" r="22" fill="#0F172A" stroke={v.accent} strokeWidth="3" />
      <circle cx="54" cy="62" r="16" fill="#1E293B" />
      <circle cx="54" cy="62" r="10" fill="#38BDF8" opacity="0.8" />
      <ellipse cx="50" cy="58" rx="4" ry="2.5" fill="white" opacity="0.6" transform="rotate(-30 50 58)" />
    </g>
  );
}

const ARTWORK_MAP: Record<string, React.ComponentType<{ v: ReturnType<typeof getVariant>; seed: number }>> = {
  calculators: CalculatorArt,
  'lab-coats': LabCoatArt,
  books: BooksArt,
  chargers: ChargersArt,
  adapters: AdaptersArt,
  'power-banks': PowerBanksArt,
  laptops: LaptopsArt,
  headphones: HeadphonesArt,
  electronics: ElectronicsArt,
  umbrellas: UmbrellasArt,
  sports: SportsArt,
  tools: ToolsArt,
  kitchen: KitchenArt,
  stationery: StationeryArt,
  'hostel-essentials': HostelEssentialsArt,
  cameras: CamerasArt,
  // Fallbacks for legacy/generic keys
  Electronics: ElectronicsArt,
  Books: BooksArt,
  Tools: ToolsArt,
  Sports: SportsArt,
  Clothing: LabCoatArt,
  Kitchen: KitchenArt,
  Study: CalculatorArt,
  Music: HeadphonesArt,
  Other: UmbrellasArt,
};

export function ItemArtwork({ category, seed, size = 120, className, float = true }: ItemArtworkProps) {
  const v = getVariant(seed);
  const normalizedCategory = String(category).toLowerCase();
  const ArtComponent = ARTWORK_MAP[category] || ARTWORK_MAP[normalizedCategory] || UmbrellasArt;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        animate={float ? { y: [0, -5, 0] } : {}}
        transition={float ? { duration: 3.5 + (seed % 3), repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' } : {}}
        whileHover={{ scale: 1.05, rotate: seed % 2 === 0 ? 1.5 : -1.5 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          role="img"
          aria-label={`${category} item illustration`}
        >
          {/* Background card with gentle radius */}
          <rect width="120" height="120" rx="20" fill={v.bg} />
          {/* Subtle dot pattern */}
          <pattern id={`dots-${seed}-${category}`} patternUnits="userSpaceOnUse" width="8" height="8">
            <circle cx="4" cy="4" r="0.8" fill={v.accent} opacity="0.1" />
          </pattern>
          <rect width="120" height="120" rx="20" fill={`url(#dots-${seed}-${category})`} />
          {/* Item illustration */}
          <ArtComponent v={v} seed={seed} />
        </svg>
      </motion.div>
    </MotionConfig>
  );
}
