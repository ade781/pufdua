import React, { useEffect, useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";

/* =========================
   Ikon kecil biar selaras tema
   ========================= */
const LanternIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 2h6a2 2 0 0 1 2 2v1h1.5a.5.5 0 0 1 0 1H17v12h1.5a.5.5 0 0 1 0 1H17v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1H5.5a.5.5 0 1 1 0-1H7V6H5.5a.5.5 0 1 1 0-1H7V4a2 2 0 0 1 2-2Zm1 5h4v3h-4V7Zm0 5h4v1h-4v-1Zm0 3h4v1h-4v-1Z" />
  </svg>
);

const CrownIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 3 2.1 6.3H21l-5 3.8 2 6.3-5-3.7-5 3.7 2-6.3-5-3.8h6.9L12 3Z" />
  </svg>
);

/* =========================
   Progress scroll warna emas
   ========================= */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      const total = d.scrollHeight - d.clientHeight;
      const p = total > 0 ? (window.scrollY / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="absolute inset-x-0 top-0 h-[3px] bg-transparent">
      <div
        className="h-full transition-[width] duration-150"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #A78BFA 0%, #8B5CF6 30%, #FBBF24 100%)",
          boxShadow: "0 0 8px rgba(251,191,36,.6)",
        }}
      />
    </div>
  );
};

/* =========================
   Item nav dengan underline berpendar
   ========================= */
const Item = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "group relative px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-yellow-400/70",
        isActive
          ? "text-yellow-300"
          : "text-white/80 hover:text-white",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        <span className="inline-flex items-center gap-1">
          {isActive ? <CrownIcon className="w-3.5 h-3.5" /> : <LanternIcon className="w-3.5 h-3.5" />}
          {label}
        </span>

        {/* underline glow */}
        <span
          className={[
            "pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[3px] h-[2px] rounded-full transition-all duration-300",
            isActive ? "w-8" : "w-0 group-hover:w-8",
          ].join(" ")}
          style={{
            background:
              "radial-gradient(6px 6px at 50% 50%, rgba(251,191,36,.9), rgba(251,191,36,0))",
            boxShadow: isActive ? "0 0 10px rgba(251,191,36,.8)" : "none",
          }}
        />
      </>
    )}
  </NavLink>
);

/* =========================
   Navbar bertema Kerajaan Lampion
   ========================= */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [elev, setElev] = useState(false);

  useEffect(() => {
    const onScroll = () => setElev(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  // shimmer garis tipis emas-ungu
  const hairline = useMemo(
    () => ({
      background:
        "linear-gradient(90deg, rgba(167,139,250,.35), rgba(139,92,246,.35), rgba(251,191,36,.45))",
    }),
    []
  );

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-300",
        // kaca berembun ungu malam + noise halus
        "backdrop-blur-md",
        "border-b border-white/10",
      ].join(" ")}
      style={{
        // layer kaca ungu gelap agar senapas sama halaman utama
        background:
          "linear-gradient(180deg, rgba(16,10,31,.72), rgba(16,10,31,.62))",
        boxShadow: elev
          ? "0 6px 24px rgba(139,92,246,.20), inset 0 0 0 1px rgba(255,255,255,.06)"
          : "inset 0 0 0 1px rgba(255,255,255,.04)",
      }}
    >
      <ScrollProgress />
      <div className="h-[1px] w-full" style={hairline} />

      <nav className="mx-auto max-w-6xl px-3 sm:px-4">
        <div className={["flex items-center justify-between", elev ? "h-12" : "h-14"].join(" ")}>
          {/* Brand dengan glow tipis emas */}
          <Link
            to="/"
            className="font-extrabold text-lg sm:text-xl tracking-tight inline-flex items-center gap-2 text-white"
            aria-label="Beranda UltahFika"
            style={{ textShadow: "0 0 12px rgba(251,191,36,.35)" }}
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md"
              style={{
                background: "radial-gradient(50% 50% at 50% 50%, rgba(251,191,36,.18), rgba(251,191,36,0))",
                boxShadow: "0 0 12px rgba(251,191,36,.35)",
              }}
            >
              <LanternIcon className="w-4.5 h-4.5 text-yellow-300" />
            </span>
            <span className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #E9D5FF 0%, #C4B5FD 35%, #FDE68A 100%)",
              }}
            >
              UltahFika
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            <Item to="/" label="Home" />
            <Item to="/galeri" label="Galeri" />
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-yellow-300 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/70"
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        <div
          id="mobile-nav"
          className={[
            "sm:hidden overflow-hidden transition-[max-height] duration-300",
            open ? "max-h-40" : "max-h-0",
          ].join(" ")}
        >
          <div className="pb-3 pt-1 flex flex-col gap-1">
            <Item to="/" label="Home" onClick={closeMenu} />
            <Item to="/galeri" label="Galeri" onClick={closeMenu} />
          </div>
        </div>
      </nav>

      {/* Tambahan CSS kecil biar sesuai tema tanpa plugin extra */}
      <style>{`
        /* Container util kalau kamu belum punya .container-narrow */
        .container-narrow { max-width: 72rem; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }

        /* Subtle grain biar tekstur kaca hidup */
        header::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 3px 3px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,.45), rgba(0,0,0,0.1));
        }
      `}</style>
    </header>
  );
}
