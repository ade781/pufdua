import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from "react";

/* ===================================================================================
   GALERI • KERAJAAN LAMPION
   - Parallax header bertema istana malam
   - Filter kategori + pencarian
   - Masonry Grid responsif
   - Lightbox: zoom ringan, keyboard nav, slide show
   - Favorit (localStorage)
   - Share / Download tiap foto
   - Aksesibilitas dasar (ARIA, focus trap ringan)
   Catatan:
   - Gambar contoh memakai path relatif; ganti sesuai asetmu.
   - Tailwind-friendly, tapi ada CSS inline biar mandiri.
   =================================================================================== */

/* =========================
   0) ICONS (SVG) selaras tema
   ========================= */
const IconHeart = ({ className = "w-5 h-5", filled }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <path d="M12 21s-6.716-4.534-9.428-7.246C.86 12.042.5 10.95.5 9.8.5 7.149 2.649 5 5.3 5c1.51 0 2.85.697 3.7 1.79C9.85 5.697 11.19 5 12.7 5 15.351 5 17.5 7.149 17.5 9.8c0 1.15-.36 2.242-2.072 3.954C18.716 16.466 12 21 12 21z" />
  </svg>
);
const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="11" cy="11" r="7"></circle>
    <path d="m20 20-3.5-3.5"></path>
  </svg>
);
const IconFilter = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M3 6h18M7 12h10M10 18h4"></path>
  </svg>
);
const IconShare = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"></path>
    <path d="m16 6-4-4-4 4"></path>
    <path d="M12 2v14"></path>
  </svg>
);
const IconDownload = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <path d="M7 10l5 5 5-5"></path>
    <path d="M12 15V3"></path>
  </svg>
);
const IconClose = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
const IconChevronLeft = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19 8 12l7-7" />
  </svg>
);
const IconChevronRight = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
  </svg>
);
const IconPlay = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconLantern = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 2h6a2 2 0 0 1 2 2v1h1.5a.5.5 0 0 1 0 1H17v12h1.5a.5.5 0 0 1 0 1H17v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1H5.5a.5.5 0 1 1 0-1H7V6H5.5a.5.5 0 1 1 0-1H7V4a2 2 0 0 1 2-2Zm1 5h4v3h-4V7Zm0 5h4v1h-4v-1Zm0 3h4v1h-4v-1Z" />
  </svg>
);
const IconCrown = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 3 2.1 6.3H21l-5 3.8 2 6.3-5-3.7-5 3.7 2-6.3-5-3.8h6.9L12 3Z" />
  </svg>
);

/* =========================
   1) GLOBAL THEME STYLES inline
   ========================= */
const ThemeStyle = () => (
  <style>{`
    :root {
      --bg-deep: #0b0716;
      --gold: #FBBF24;
      --gold-soft: rgba(251,191,36,.65);
      --glass-1: rgba(16,10,31,.72);
      --glass-2: rgba(16,10,31,.62);
      --purple-3: #A78BFA;
      --purple-4: #8B5CF6;
    }
    .majestic-bg { background-color: var(--bg-deep); }
    .font-serif-regal { font-family: 'Cinzel Decorative', cursive; }
    .font-sans { font-family: 'Jost', sans-serif; }
    .text-shadow-gold {
      text-shadow: 0 0 10px rgba(252, 211, 77, 0.5), 0 0 20px rgba(252, 211, 77, 0.3);
    }
    .card {
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(253, 230, 138, .18);
      backdrop-filter: blur(10px);
      border-radius: 14px;
      box-shadow: 0 10px 34px rgba(0,0,0,.25);
    }
    .chip {
      padding: 6px 10px; border-radius: 999px; font-weight: 600; font-size: .85rem;
      border: 1px solid rgba(253, 230, 138, .30); color: #FDE68A;
      background: rgba(255,255,255,.06);
      transition: background .2s ease, border-color .2s ease, transform .08s ease;
    }
    .chip:hover { background: rgba(253,230,138,.08); border-color: rgba(253,230,138,.55); transform: translateY(-1px); }
    .chip.active { color: #120a26; background: linear-gradient(90deg, #A78BFA, #8B5CF6 40%, #FBBF24); border-color: transparent; }
    .btn-ghost {
      background: rgba(255,255,255,.06); color: #FDE68A; font-weight: 600;
      border: 1px solid rgba(253, 230, 138, .25); border-radius: 10px; padding: 9px 14px;
      transition: background .2s ease, border-color .2s ease;
    }
    .btn-ghost:hover { background: rgba(253, 230, 138, .08); border-color: rgba(253, 230, 138, .5); }
    .btn-solid {
      display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:10px;
      background: linear-gradient(90deg, #A78BFA, #8B5CF6 40%, #FBBF24);
      color:#120a26; font-weight:700; box-shadow:0 6px 18px rgba(139,92,246,.25);
    }
    .btn-solid:hover { filter: brightness(1.05); }
    .focus-ring:focus { outline: 2px solid rgba(251,191,36, .9); outline-offset: 3px; border-radius: 10px; }

    /* Parallax header */
    .bg-night-sky { background: linear-gradient(to bottom, #0a0514, #1a0f36, #3c2a66); }
    .bg-stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.5; }
    .bg-mountains { background: url('https://i.imgur.com/g032M9A.png') repeat-x bottom center; background-size: contain; opacity: 0.28; }
    .bg-castle { background: url('https://i.imgur.com/B435s44.png') repeat-x bottom center; background-size: contain; opacity: 0.38; }

    /* Lantern animation */
    @keyframes float-up {
      0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
    }
    .lantern-bg {
      position:absolute; bottom:-150px; width:80px; height:80px;
      background-image:url('https://i.imgur.com/b9x34S2.png');
      background-size:contain; background-repeat:no-repeat;
      animation: float-up linear infinite;
      filter: drop-shadow(0 0 12px rgba(252,211,77,0.4));
      will-change: transform, opacity;
    }

    /* Lightbox */
    .lb-enter { animation: zoomIn .18s ease-out; }
    @keyframes zoomIn { from { transform: scale(.96); opacity:.2 } to { transform: scale(1); opacity:1 } }
  `}</style>
);

/* =========================
   2) HOOKS
   ========================= */
function useOnScreen(options) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        ob.unobserve(entry.target);
      }
    }, options || { threshold: 0.1 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [options]);
  return [ref, visible];
}

function useKeyDown(handler) {
  useEffect(() => {
    const fn = (e) => handler(e);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handler]);
}

function useLocalStorage(key, initialValue) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal];
}

/* =========================
   3) DATA DUMMY (ganti pakai asetmu)
   ========================= */
const CATEGORIES = ["Semua", "Wisdom Park", "Malam", "Selfie", "Candid", "Outdoor", "Indoor", "Kenangan"];
const TAG_COLORS = {
  Malam: "#a78bfa",
  "Wisdom Park": "#8b5cf6",
  Selfie: "#fde68a",
  Candid: "#fcd34d",
  Outdoor: "#93c5fd",
  Indoor: "#fca5a5",
  Kenangan: "#86efac",
};

function makeItem(i, w = 800, h = 1000, extra = {}) {
  // Contoh path lokal: 'img6.jpg' dsb
  const src = `img${(i % 20) + 6}.jpg`;
  const alt = `Kenangan ${i + 1}`;
  const date = new Date(Date.now() - i * 86400000).toISOString();
  const tagSet = [
    CATEGORIES[1 + (i % (CATEGORIES.length - 1))],
    i % 3 === 0 ? "Malam" : undefined,
    i % 5 === 0 ? "Kenangan" : undefined,
  ].filter(Boolean);
  return {
    id: i + 1,
    src,
    w,
    h,
    alt,
    date,
    tags: tagSet,
    ...extra,
  };
}

const ALL_ITEMS = Array.from({ length: 36 }).map((_, i) =>
  makeItem(i, 800 + ((i * 37) % 200), 800 + ((i * 47) % 320))
);

/* =========================
   4) PARALLAX HEADER + LANTERNS
   ========================= */
function ParallaxHeader() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.pageYOffset || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const layers = [
    { className: "bg-night-sky", speed: 0 },
    { className: "bg-stars", speed: 0.15 },
    { className: "bg-mountains", speed: 0.3 },
    { className: "bg-castle", speed: 0.45 },
  ];
  return (
    <div className="relative h-[42vh] sm:h-[50vh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {layers.map((l, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 ${l.className}`}
            style={{ transform: `translateY(${y * l.speed}px)` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10">
        <LanternField count={14} />
      </div>
      <div className="relative h-full grid place-items-center px-6 text-center">
        <div>
          <p className="text-sm sm:text-base text-yellow-300/85">Balairung Kenangan</p>
          <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-serif-regal font-bold text-shadow-gold">
            Galeri Kerajaan
          </h1>
          <p className="mt-3 text-yellow-100/80 max-w-2xl mx-auto">
            Setiap lampion menyimpan cerita. Setiap potret adalah prasasti.
          </p>
        </div>
      </div>
    </div>
  );
}

function LanternField({ count = 12 }) {
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        dur: 18 + Math.random() * 22,
        scale: 0.25 + Math.random() * 0.55,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {seeds.map((s) => (
        <div
          key={s.id}
          className="lantern-bg"
          style={{
            left: `${s.left}%`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            transform: `scale(${s.scale})`,
          }}
        />
      ))}
    </div>
  );
}

/* =========================
   5) FILTER BAR
   ========================= */
function FilterBar({ query, setQuery, category, setCategory, total, onlyFav, setOnlyFav, sort, setSort }) {
  return (
    <div className="container-narrow -mt-8">
      <div className="card p-4 sm:p-5 -mt-8 sm:-mt-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-yellow-400/20">
            <IconSearch className="w-5 h-5 text-yellow-200/80" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul/tag (mis. Malam, Wisdom)..."
              className="bg-transparent outline-none text-yellow-100/90 placeholder-yellow-200/50 w-64 sm:w-80"
              aria-label="Pencarian galeri"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              className={`btn-ghost focus-ring ${onlyFav ? "ring-2 ring-yellow-400/70" : ""}`}
              onClick={() => setOnlyFav((v) => !v)}
              aria-pressed={onlyFav}
              title="Tampilkan Favorit saja"
            >
              <IconHeart className="w-5 h-5 inline-block mr-1" /> Favorit
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="btn-ghost focus-ring pr-8"
                aria-label="Urutkan"
              >
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-yellow-200/70">
                <IconFilter className="w-4 h-4" />
              </span>
            </div>

            <span className="hidden sm:inline text-yellow-200/70 text-sm">
              {total} foto
            </span>
          </div>
        </div>

        {/* Categories chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   6) MASONRY GRID
   ========================= */
function useMasonry(items, columns = 4) {
  return useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    items.forEach((it, i) => {
      cols[i % columns].push(it);
    });
    return cols;
  }, [items, columns]);
}

function GalleryCard({ item, onOpen, isFav, toggleFav }) {
  const [ref, visible] = useOnScreen({ threshold: 0.05 });
  const tiltRef = useRef(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -6;
      const ry = ((x / rect.width) - 0.5) * 8;
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    }
    function reset() {
      el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        ref={tiltRef}
        className={`relative overflow-hidden rounded-lg border border-yellow-400/20 transition-all duration-300 will-change-transform ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
      >
        <button
          onClick={() => onOpen(item)}
          className="block w-full focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
          aria-label={`Buka ${item.alt}`}
        >
          <img
            src={item.src}
            alt={item.alt}
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/800x1000/0a0514/fcd34d?text=${encodeURIComponent(
                item.alt
              )}`;
            }}
          />
        </button>

        {/* top overlay actions */}
        <div className="absolute top-2 left-2 flex gap-2">
          {item.tags?.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(255,255,255,.08)",
                border: `1px solid ${TAG_COLORS[t] || "rgba(253,230,138,.28)"}`,
                color: TAG_COLORS[t] || "#FDE68A",
                backdropFilter: "blur(6px)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={() => toggleFav(item.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/55 transition-colors"
          aria-label={isFav ? "Hapus dari favorit" : "Tambah ke favorit"}
          title={isFav ? "Hapus favorit" : "Tambah favorit"}
        >
          <IconHeart className={`w-5 h-5 ${isFav ? "text-red-400" : "text-yellow-200/90"}`} filled={isFav} />
        </button>

        {/* caption */}
        <div className="p-3 bg-gradient-to-t from-black/40 to-transparent text-yellow-100/90">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{item.alt}</p>
            <p className="text-xs text-yellow-200/60">
              {new Date(item.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   7) LIGHTBOX
   ========================= */
function Lightbox({
  items,
  openIndex,
  setOpenIndex,
  favorites,
  toggleFav,
}) {
  const escClose = useCallback(() => setOpenIndex(-1), [setOpenIndex]);
  const prev = useCallback(
    () => setOpenIndex((i) => (i <= 0 ? items.length - 1 : i - 1)),
    [items.length, setOpenIndex]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i >= items.length - 1 ? 0 : i + 1)),
    [items.length, setOpenIndex]
  );

  useKeyDown((e) => {
    if (openIndex < 0) return;
    if (e.key === "Escape") escClose();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key.toLowerCase() === "f") toggleFav(items[openIndex].id);
  });

  const wrapRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onWheel = (e) => {
    e.preventDefault();
    const z = Math.min(3, Math.max(1, zoom + (e.deltaY < 0 ? 0.1 : -0.1)));
    setZoom(z);
  };

  const onMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    wrapRef.current.dataset.startX = e.clientX - pos.x;
    wrapRef.current.dataset.startY = e.clientY - pos.y;
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const nx = e.clientX - parseFloat(wrapRef.current.dataset.startX || 0);
    const ny = e.clientY - parseFloat(wrapRef.current.dataset.startY || 0);
    setPos({ x: nx, y: ny });
  };
  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    const stop = (e) => {
      if (openIndex >= 0) e.preventDefault();
    };
    document.addEventListener("wheel", stop, { passive: false });
    return () => document.removeEventListener("wheel", stop);
  }, [openIndex]);

  if (openIndex < 0) return null;
  const item = items[openIndex];
  const isFav = favorites.includes(item.id);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.alt, text: item.alt, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Tautan disalin ke papan klip");
      }
    } catch {
      // diam saja
    }
  };
  const download = () => {
    const a = document.createElement("a");
    a.href = item.src;
    a.download = item.alt.replace(/\s+/g, "_") + ".jpg";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 lb-enter">
      <div className="absolute inset-0" />

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-yellow-100">
          <IconLantern className="w-4 h-4 text-yellow-300" />
          <span className="text-sm">{item.alt}</span>
          <span className="text-xs text-yellow-200/70">
            • {new Date(item.date).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFav(item.id)}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            aria-label={isFav ? "Hapus favorit" : "Tambah favorit"}
            title="Favorit (F)"
          >
            <IconHeart className={`w-5 h-5 ${isFav ? "text-red-400" : "text-yellow-200/90"}`} filled={isFav} />
          </button>
          <button onClick={share} className="p-2 rounded-md bg-white/10 hover:bg-white/20" aria-label="Bagikan">
            <IconShare />
          </button>
          <button onClick={download} className="p-2 rounded-md bg-white/10 hover:bg-white/20" aria-label="Unduh">
            <IconDownload />
          </button>
          <button
            onClick={escClose}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20"
            aria-label="Tutup lightbox"
          >
            <IconClose />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        ref={wrapRef}
        className={`relative max-w-6xl w-full px-4 select-none ${dragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"}`}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <img
          src={item.src}
          alt={item.alt}
          className="w-full max-h-[80vh] object-contain mx-auto"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`, transition: dragging ? "none" : "transform .15s ease-out" }}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/1200x800/0a0514/fcd34d?text=${encodeURIComponent(
              item.alt
            )}`;
          }}
        />
      </div>

      {/* Controls bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          className="btn-ghost focus-ring inline-flex items-center gap-2"
          aria-label="Sebelumnya"
          title="Sebelumnya (←)"
        >
          <IconChevronLeft />
          Prev
        </button>
        <ZoomControl zoom={zoom} setZoom={setZoom} />
        <SlideshowButton items={items} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        <button
          onClick={next}
          className="btn-ghost focus-ring inline-flex items-center gap-2"
          aria-label="Berikutnya"
          title="Berikutnya (→)"
        >
          Next
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}

function ZoomControl({ zoom, setZoom }) {
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-yellow-100">
      <button className="btn-ghost" onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}>
        -
      </button>
      <span className="min-w-[3ch] text-center">{zoom.toFixed(2)}x</span>
      <button className="btn-ghost" onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}>
        +
      </button>
      <button className="btn-ghost" onClick={() => setZoom(1)}>
        Reset
      </button>
    </div>
  );
}

function SlideshowButton({ items, openIndex, setOpenIndex, interval = 2200 }) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => {
      setOpenIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
    }, interval);
    return () => clearInterval(id);
  }, [play, items.length, interval, setOpenIndex]);
  return (
    <button
      onClick={() => setPlay((v) => !v)}
      className="btn-solid focus-ring"
      aria-pressed={play}
      title="Putar Slide"
    >
      {play ? <IconPause /> : <IconPlay />}
      {play ? "Pause" : "Play"}
    </button>
  );
}

/* =========================
   8) MAIN GALLERY WRAPPER
   ========================= */
function GallerySection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [onlyFav, setOnlyFav] = useState(false);
  const [sort, setSort] = useState("latest");
  const [favorites, setFavorites] = useLocalStorage("galeri_fav_v1", []);
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFav = (id) => {
    setFavorites((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [id, ...list]
    );
  };

  const filtered = useMemo(() => {
    let data = [...ALL_ITEMS];
    if (category !== "Semua") data = data.filter((d) => d.tags?.includes(category));
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (d) =>
          d.alt.toLowerCase().includes(q) ||
          (d.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (onlyFav) data = data.filter((d) => favorites.includes(d.id));
    switch (sort) {
      case "latest":
        data.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        break;
      case "oldest":
        data.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "az":
        data.sort((a, b) => a.alt.localeCompare(b.alt));
        break;
      case "za":
        data.sort((a, b) => b.alt.localeCompare(a.alt));
        break;
      default:
        break;
    }
    return data;
  }, [category, query, onlyFav, favorites, sort]);

  const columns = useMemo(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (w >= 1280) return 4;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 2;
  }, []);
  const cols = useMasonry(filtered, columns);

  const openByItem = (item) => {
    const idx = filtered.findIndex((x) => x.id === item.id);
    if (idx >= 0) setOpenIndex(idx);
  };

  return (
    <section className="py-10">
      <FilterBar
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        total={filtered.length}
        onlyFav={onlyFav}
        setOnlyFav={setOnlyFav}
        sort={sort}
        setSort={setSort}
      />

      <div className="container-narrow mt-6">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-yellow-100/80">
            Tidak ada foto dengan kriteria tersebut.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
            {cols.map((col, cidx) => (
              <div key={cidx} className="flex flex-col gap-4">
                {col.map((it) => (
                  <GalleryCard
                    key={it.id}
                    item={it}
                    onOpen={openByItem}
                    isFav={favorites.includes(it.id)}
                    toggleFav={toggleFav}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        items={filtered}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        favorites={favorites}
        toggleFav={toggleFav}
      />
    </section>
  );
}

/* =========================
   9) PAGE COMPONENT
   ========================= */
export default function Galeri() {
  return (
    <Fragment>
      {/* Fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Jost:wght@400;600&display=swap"
      />
      <ThemeStyle />
      <div className="majestic-bg text-white font-sans min-h-screen">
        {/* Header Parallax */}
        <ParallaxHeader />

        {/* Body */}
        <div className="relative z-10">
          <div className="container-narrow px-4">
            <div className="mt-6 mb-2 flex items-center gap-2 text-yellow-200/80">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(251,191,36,.18), rgba(251,191,36,0))",
                  boxShadow: "0 0 12px rgba(251,191,36,.35)",
                }}
              >
                <IconCrown className="w-4 h-4 text-yellow-300" />
              </span>
              <span className="text-sm">Balairung Kenangan • Kerajaan Lampion</span>
            </div>
          </div>

          <GallerySection />
        </div>

        {/* Footer mini */}
        <footer className="text-center py-12 px-6 border-t border-yellow-400/10 mt-16">
          <IconLantern className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-200/70 text-lg">
            Semoga lampion-lampion harapan ini menerangi jalanmu,
          </p>
          <p className="text-2xl font-serif-regal font-bold text-white mt-2">
            Galeri Kerajaan
          </p>
          <p className="text-yellow-200/50 mt-4">
            &copy; {new Date().getFullYear()} - Dari Rajamu, ADE7.
          </p>
        </footer>
      </div>
    </Fragment>
  );
}

/* ===================================================================================
   10) Catatan kecil:
   - Ganti src gambar di ALL_ITEMS dengan asetmu sendiri.
   - Jika mau integrasi lazy-loading <img>, bisa tambahkan loading="lazy".
   - Tailwind opsional; kelas dasar tetap jalan dengan CSS inline yang ada.
   - Komponen aman dipakai di route /galeri tanpa dependensi eksternal.
   =================================================================================== */
