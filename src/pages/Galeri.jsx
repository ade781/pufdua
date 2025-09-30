import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from "react";

/* ===================================================================================
   GALERI — THE FAMILY ARCHIVE (MAFIA/NOIR EDITION)
   - Parallax header: skyline basah hujan, neon, siren sweep
   - Filter + search tetap
   - Masonry grid, tapi item = POLAROID berantakan (no “card” boxy)
   - Lightbox: zoom, keyboard, slideshow
   - Favorit (localStorage), Share/Download
   - Aksesibilitas dasar
   - Tailwind-friendly, semua animasi penting inlined
   - Gambar contoh pakai img6.jpg dst, silakan ganti
   =================================================================================== */

/* =========================
   0) ICONS (NOIR)
   ========================= */
const IconHeart = ({ className = "w-5 h-5", filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path d="M12 21s-6.7-4.5-9.4-7.2C.9 12 .5 10.9.5 9.8.5 7.1 2.6 5 5.3 5c1.5 0 2.8.7 3.7 1.8C9.9 5.7 11.2 5 12.7 5 15.3 5 17.5 7.1 17.5 9.8c0 1.1-.4 2.2-2.1 4C18.7 16.5 12 21 12 21z" />
  </svg>
);
const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>
  </svg>
);
const IconFilter = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M3 6h18M7 12h10M10 18h4"></path>
  </svg>
);
const IconShare = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"></path><path d="m16 6-4-4-4 4"></path><path d="M12 2v14"></path>
  </svg>
);
const IconDownload = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M7 10l5 5 5-5"></path><path d="M12 15V3"></path>
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
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const IconPause = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);

/* =========================
   1) GLOBAL THEME: NOIR
   ========================= */
const ThemeStyle = () => (
  <style>{`
    :root{
      --noir:#09090f; --ink:#0d0d14; --red:#ff2f4f; --gold:#f6c945; --cyan:#45f6da; --glass:rgba(255,255,255,.05);
    }
    .noir-bg{ background: radial-gradient(1200px 700px at 50% -10%, #171421 0%, var(--noir) 55%); }
    .grain::after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.12;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E");mix-blend-mode:soft-light;z-index:2}
    .neon-red{ color:var(--red); text-shadow:0 0 12px rgba(255,47,79,.55), 0 0 28px rgba(255,47,79,.3); }
    .neon-gold{ color:var(--gold); text-shadow:0 0 12px rgba(246,201,69,.55), 0 0 28px rgba(246,201,69,.3); }
    .siren{ animation: siren 2.4s linear infinite; }
    @keyframes siren{0%,49%{box-shadow:0 0 20px rgba(255,0,0,.2)}50%,100%{box-shadow:0 0 20px rgba(0,128,255,.2)}}

    /* Skyline layers (parallax) */
    .layer-a{ background:url('https://images.unsplash.com/photo-1491884662610-dfcd28f30cf5?auto=format&fit=crop&w=1600&q=60') center/cover no-repeat; opacity:.18 }
    .layer-b{ background:url('https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1600&q=60') center/cover no-repeat; opacity:.22 }
    .layer-c{ background:url('https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=60') center/cover no-repeat; opacity:.28 }

    /* Rain */
    @keyframes raindrop { to { transform: translateY(120vh); } }
    .drop{ position:absolute; top:-10vh; width:1px; height:12vh; background:linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.35)); filter:blur(.2px); animation:raindrop linear infinite; opacity:.45; }

    /* Money & chips */
    @keyframes fallCash { 0%{ transform: translateY(-10vh) rotate(0); opacity:0 } 12%{opacity:1} 100%{ transform: translateY(110vh) rotate(360deg); opacity:0 } }
    .bill{ position:fixed; top:-10vh; width:90px; height:42px; background:linear-gradient(135deg,#2b8a3e,#1e5128); border:1px solid rgba(255,255,255,.15); border-radius:4px; box-shadow:0 8px 20px rgba(0,0,0,.5), inset 0 0 0 2px rgba(0,0,0,.2); animation:fallCash linear forwards; z-index:3 }
    .bill::after{ content:"$"; position:absolute; inset:0; display:grid; place-items:center; color:rgba(255,255,255,.9); font-weight:800; font-size:18px; text-shadow:0 0 6px rgba(255,255,255,.6); }

    /* Laser sweep */
    @keyframes sweep { 0%{transform:translateX(-100%)} 100%{transform:translateX(120%)} }
    .sweep { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent); animation:sweep 2.8s linear infinite; }

    /* Polaroid look: no boxy card */
    .polaroid{
      position:relative; background:#111; border-radius:6px;
      box-shadow: 0 20px 40px rgba(0,0,0,.5), 0 2px 0 rgba(255,255,255,.06) inset;
      transform: rotate(var(--rot, 0deg)) translateZ(0); transition: transform .2s ease, box-shadow .2s ease; will-change: transform;
      clip-path: polygon(3% 2%, 97% 0%, 100% 94%, 2% 98%); /* Irregular edges */
    }
    .polaroid:hover{ transform: rotate(var(--rot, 0deg)) translateY(-3px); box-shadow: 0 28px 58px rgba(0,0,0,.6), 0 2px 0 rgba(255,255,255,.1) inset; }
    .edge-tape{
      position:absolute; width:60px; height:18px; background:linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,.3));
      box-shadow:0 8px 14px rgba(0,0,0,.3); transform:rotate(var(--trot, -8deg));
      mix-blend-mode:screen; opacity:.85;
    }
    .edge-tape.tl{ top:-10px; left:16px; --trot:-10deg }
    .edge-tape.tr{ top:-12px; right:18px; --trot:6deg }
    .edge-tape.bl{ bottom:-10px; left:22px; --trot:4deg }
    .edge-tape.br{ bottom:-12px; right:12px; --trot:-6deg }

    .caption{
      position:absolute; left:8px; right:8px; bottom:6px; padding:6px 8px;
      background: linear-gradient(180deg, rgba(0,0,0,.0), rgba(0,0,0,.7));
      color:#f1f1f1; font-weight:600; letter-spacing:.02em; border-radius:6px;
    }
    .tag-chip{
      display:inline-block; margin-right:6px; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:700;
      background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.2); backdrop-filter: blur(6px);
    }

    /* Bullet holes */
    .holes::before, .holes::after { content:""; position:absolute; width:16px; height:16px; border-radius:50%; background:radial-gradient(circle at 40% 40%, #c4c4c4 0%, #222 55%, #000 70%); box-shadow: inset 0 0 12px rgba(255,255,255,.15), 0 0 10px rgba(0,0,0,.6); }
    .holes::before{ top:8%; left:10%; transform:rotate(-12deg)}
    .holes::after{ bottom:10%; right:8%; transform:rotate(8deg)}

    /* Lightbox */
    .lb-enter { animation: zoomIn .18s ease-out; }
    @keyframes zoomIn { from { transform: scale(.96); opacity:.2 } to { transform: scale(1); opacity:1 } }

    /* Redacted bar */
    .redacted{ background:#111; color:transparent; border-radius:2px; padding:0 6px; box-shadow:0 0 0 2px #111; }

    /* Text buttons */
    .btn-ghost{
      background: rgba(255,255,255,.06); color:#fff; font-weight:600;
      border:1px solid rgba(255,255,255,.2); border-radius:10px; padding:9px 14px;
      transition: background .18s ease, border-color .18s ease, transform .08s ease;
    }
    .btn-ghost:hover{ background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.4); transform: translateY(-1px); }
    .btn-solid{
      display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:10px;
      background: linear-gradient(90deg, #ff2f4f, #c62828 45%, #f6c945); color:#120a26; font-weight:800;
      box-shadow:0 6px 18px rgba(255,47,79,.25);
    }
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
   3) DATA DUMMY
   ========================= */
const CATEGORIES = ["Semua", "Malam", "Street", "Candid", "Indoor", "Outdoor", "Kenangan"];
const TAG_COLORS = {
  Malam: "#ff2f4f",
  Street: "#f6c945",
  Candid: "#45f6da",
  Outdoor: "#93c5fd",
  Indoor: "#fca5a5",
  Kenangan: "#86efac",
};
function makeItem(i, w = 800, h = 1000, extra = {}) {
  const src = `img${(i % 20) + 6}.jpg`;
  const alt = `Frame #${i + 1}`;
  const date = new Date(Date.now() - i * 86400000).toISOString();
  const tagSet = [
    CATEGORIES[1 + (i % (CATEGORIES.length - 1))],
    i % 4 === 0 ? "Malam" : undefined,
    i % 5 === 0 ? "Kenangan" : undefined,
  ].filter(Boolean);
  return { id: i + 1, src, w, h, alt, date, tags: tagSet, ...extra };
}
const ALL_ITEMS = Array.from({ length: 36 }).map((_, i) =>
  makeItem(i, 800 + ((i * 37) % 200), 800 + ((i * 47) % 320))
);

/* =========================
   4) PARALLAX HEADER
   ========================= */
function Skyline() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY || window.pageYOffset);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const Rain = useMemo(() =>
    Array.from({ length: 160 }).map((_, i) => ({
      left: Math.random() * 100,
      dur: 0.7 + Math.random() * 0.9,
      delay: Math.random() * -20,
      scale: 0.8 + Math.random() * 1.2,
      id: i,
    })), []);
  return (
    <div className="relative h-[42vh] sm:h-[50vh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 layer-a" style={{ transform: `translateY(${y * 0.05}px)` }} />
        <div className="absolute inset-0 layer-b" style={{ transform: `translateY(${y * 0.1}px)` }} />
        <div className="absolute inset-0 layer-c" style={{ transform: `translateY(${y * 0.15}px)` }} />
      </div>
      <div className="absolute inset-0 -z-5 pointer-events-none">
        {Rain.map(d => <div key={d.id} className="drop" style={{ left: `${d.left}%`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`, transform: `scaleY(${d.scale})` }} />)}
      </div>
      <div className="relative h-full grid place-items-center text-center px-6">
        <div className="siren rounded-xl px-4 py-2 inline-block bg-[rgba(255,255,255,.06)] border border-white/10">
          <span className="text-xs tracking-[0.3em] text-white/70 uppercase">The Family Archive</span>
        </div>
        <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black neon-red">FIKA • BIRTHDAY FILES</h1>
        <p className="mt-2 text-white/80 max-w-2xl mx-auto">Foto-foto disusun seperti dossier. Jaga jarak, tapi nikmati senyumnya.</p>
      </div>
      <div className="sweep" />
    </div>
  );
}

/* =========================
   5) FILTER BAR (no kotak, lebih “strip”)
   ========================= */
function FilterBar({ query, setQuery, category, setCategory, total, onlyFav, setOnlyFav, sort, setSort }) {
  return (
    <div className="container-narrow -mt-8">
      <div className="rounded-xl bg-[rgba(255,255,255,.06)] border border-white/10 px-4 sm:px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10">
            <IconSearch className="w-5 h-5 text-white/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul/tag (Malam, Street, ...)"
              className="bg-transparent outline-none text-white/85 placeholder-white/40 w-64 sm:w-80"
              aria-label="Pencarian galeri"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`btn-ghost ${onlyFav ? "ring-2 ring-red-500/60" : ""}`}
              onClick={() => setOnlyFav(v => !v)}
              aria-pressed={onlyFav}
              title="Favorit"
            >
              <IconHeart className={`w-5 h-5 inline-block mr-1 ${onlyFav ? "text-red-400" : "text-white/80"}`} filled={onlyFav} /> Favorit
            </button>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="btn-ghost pr-8" aria-label="Urutkan">
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70">
                <IconFilter className="w-4 h-4" />
              </span>
            </div>
            <span className="hidden sm:inline text-white/60 text-sm">{total} foto</span>
          </div>
        </div>
        {/* Categories strip */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`px-3 py-1 rounded-full text-xs font-bold border ${category === c ? "bg-red-600 text-white border-red-600" : "bg-black/40 text-white/80 border-white/10"}`}
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
   6) MASONRY UTILS
   ========================= */
function useMasonry(items, columns = 4) {
  return useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    items.forEach((it, i) => cols[i % columns].push(it));
    return cols;
  }, [items, columns]);
}

/* =========================
   7) GALLERY ITEM: POLAROID (no boxes)
   ========================= */
function GalleryPolaroid({ item, onOpen, isFav, toggleFav }) {
  const [ref, visible] = useOnScreen({ threshold: 0.05 });
  const rot = useMemo(() => (Math.random() * 10 - 5).toFixed(2) + "deg", []);
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
      el.style.transform = `rotate(var(--rot)) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function reset() { el.style.transform = `rotate(var(--rot))`; }
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
        className={`polaroid holes ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ "--rot": rot }}
      >
        {/* tapes */}
        <span className="edge-tape tl" />
        <span className="edge-tape tr" />
        {/* image button */}
        <button
          onClick={() => onOpen(item)}
          className="block w-full focus:outline-none"
          aria-label={`Buka ${item.alt}`}
        >
          <img
            src={item.src}
            alt={item.alt}
            className="w-full h-auto object-cover"
            onError={(e) => { e.currentTarget.src = `https://placehold.co/800x1000/0b0a0f/ffffff?text=${encodeURIComponent(item.alt)}`; }}
          />
        </button>
        {/* caption strip */}
        <div className="caption">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{item.alt} <span className="redacted">████</span></p>
            <p className="text-xs text-white/60">{new Date(item.date).toLocaleDateString()}</p>
          </div>
          <div className="mt-1">
            {(item.tags || []).slice(0, 3).map(t => (
              <span key={t} className="tag-chip" style={{ borderColor: TAG_COLORS[t] || "rgba(255,255,255,.25)", color: TAG_COLORS[t] || "#fff" }}>{t}</span>
            ))}
          </div>
        </div>
        {/* fav button floating */}
        <button
          onClick={() => toggleFav(item.id)}
          className="absolute -top-3 -right-3 p-2 rounded-full bg-black/70 hover:bg-black/60 transition-colors"
          aria-label={isFav ? "Hapus favorit" : "Tambah favorit"}
          title={isFav ? "Hapus favorit" : "Tambah favorit"}
        >
          <IconHeart className={`w-5 h-5 ${isFav ? "text-red-400" : "text-white/80"}`} filled={isFav} />
        </button>
        <span className="edge-tape bl" />
        <span className="edge-tape br" />
      </div>
    </div>
  );
}

/* =========================
   8) LIGHTBOX
   ========================= */
function Lightbox({ items, openIndex, setOpenIndex, favorites, toggleFav }) {
  const escClose = useCallback(() => setOpenIndex(-1), [setOpenIndex]);
  const prev = useCallback(() => setOpenIndex(i => (i <= 0 ? items.length - 1 : i - 1)), [items.length, setOpenIndex]);
  const next = useCallback(() => setOpenIndex(i => (i >= items.length - 1 ? 0 : i + 1)), [items.length, setOpenIndex]);

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

  const onWheel = (e) => { e.preventDefault(); const z = Math.min(3, Math.max(1, zoom + (e.deltaY < 0 ? 0.1 : -0.1))); setZoom(z); };
  const onMouseDown = (e) => { if (zoom <= 1) return; setDragging(true); wrapRef.current.dataset.sx = e.clientX - pos.x; wrapRef.current.dataset.sy = e.clientY - pos.y; };
  const onMouseMove = (e) => { if (!dragging) return; const nx = e.clientX - parseFloat(wrapRef.current.dataset.sx || 0); const ny = e.clientY - parseFloat(wrapRef.current.dataset.sy || 0); setPos({ x: nx, y: ny }); };
  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    const stop = (e) => { if (openIndex >= 0) e.preventDefault(); };
    document.addEventListener("wheel", stop, { passive: false });
    return () => document.removeEventListener("wheel", stop);
  }, [openIndex]);

  if (openIndex < 0) return null;
  const item = items[openIndex];
  const isFav = favorites.includes(item.id);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: item.alt, text: item.alt, url });
      else { await navigator.clipboard.writeText(url); alert("Tautan disalin"); }
    } catch { }
  };
  const download = () => { const a = document.createElement("a"); a.href = item.src; a.download = item.alt.replace(/\s+/g, "_") + ".jpg"; a.click(); };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 lb-enter">
      {/* top bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white/90">
          <span className="text-xs tracking-widest uppercase text-white/60">File</span>
          <span className="text-sm">{item.alt}</span>
          <span className="text-xs text-white/50">• {new Date(item.date).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toggleFav(item.id)} className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors" aria-label={isFav ? "Hapus favorit" : "Tambah favorit"} title="Favorit (F)">
            <IconHeart className={`w-5 h-5 ${isFav ? "text-red-400" : "text-white/85"}`} filled={isFav} />
          </button>
          <button onClick={share} className="p-2 rounded-md bg-white/10 hover:bg-white/20" aria-label="Bagikan"><IconShare /></button>
          <button onClick={download} className="p-2 rounded-md bg-white/10 hover:bg-white/20" aria-label="Unduh"><IconDownload /></button>
          <button onClick={escClose} className="p-2 rounded-md bg-white/10 hover:bg-white/20" aria-label="Tutup"><IconClose /></button>
        </div>
      </div>

      {/* image */}
      <div
        ref={wrapRef}
        className={`relative max-w-6xl w-full px-4 select-none ${dragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"}`}
        onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      >
        <img
          src={item.src}
          alt={item.alt}
          className="w-full max-h-[80vh] object-contain mx-auto"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`, transition: dragging ? "none" : "transform .15s ease-out" }}
          onError={(e) => { e.currentTarget.src = `https://placehold.co/1200x800/0b0a0f/ffffff?text=${encodeURIComponent(item.alt)}`; }}
        />
      </div>

      {/* bottom controls */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3">
        <button onClick={prev} className="btn-ghost" aria-label="Sebelumnya" title="Sebelumnya (←)"><IconChevronLeft />Prev</button>
        <ZoomControl zoom={zoom} setZoom={setZoom} />
        <SlideshowButton items={items} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        <button onClick={next} className="btn-ghost" aria-label="Berikutnya" title="Berikutnya (→)">Next<IconChevronRight /></button>
      </div>
    </div>
  );
}
function ZoomControl({ zoom, setZoom }) {
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-white/90">
      <button className="btn-ghost" onClick={() => setZoom(z => Math.max(1, +(z - 0.25).toFixed(2)))}>-</button>
      <span className="min-w-[3ch] text-center">{zoom.toFixed(2)}x</span>
      <button className="btn-ghost" onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))}>+</button>
      <button className="btn-ghost" onClick={() => setZoom(1)}>Reset</button>
    </div>
  );
}
function SlideshowButton({ items, openIndex, setOpenIndex, interval = 2200 }) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => { setOpenIndex(i => (i >= items.length - 1 ? 0 : i + 1)); }, interval);
    return () => clearInterval(id);
  }, [play, items.length, interval, setOpenIndex]);
  return (
    <button onClick={() => setPlay(v => !v)} className="btn-solid" aria-pressed={play} title="Putar Slide">
      {play ? <IconPause /> : <IconPlay />}{play ? "Pause" : "Play"}
    </button>
  );
}

/* =========================
   9) MAIN GALLERY WRAPPER
   ========================= */
function GallerySection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [onlyFav, setOnlyFav] = useState(false);
  const [sort, setSort] = useState("latest");
  const [favorites, setFavorites] = useLocalStorage("galeri_mafia_fav_v1", []);
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFav = (id) => setFavorites((list) => (list.includes(id) ? list.filter((x) => x !== id) : [id, ...list]));

  const filtered = useMemo(() => {
    let data = [...ALL_ITEMS];
    if (category !== "Semua") data = data.filter((d) => d.tags?.includes(category));
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((d) => d.alt.toLowerCase().includes(q) || (d.tags || []).some((t) => t.toLowerCase().includes(q)));
    }
    if (onlyFav) data = data.filter((d) => favorites.includes(d.id));
    switch (sort) {
      case "latest": data.sort((a, b) => +new Date(b.date) - +new Date(a.date)); break;
      case "oldest": data.sort((a, b) => +new Date(a.date) - +new Date(b.date)); break;
      case "az": data.sort((a, b) => a.alt.localeCompare(b.alt)); break;
      case "za": data.sort((a, b) => b.alt.localeCompare(a.alt)); break;
      default: break;
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
        query={query} setQuery={setQuery}
        category={category} setCategory={setCategory}
        total={filtered.length}
        onlyFav={onlyFav} setOnlyFav={setOnlyFav}
        sort={sort} setSort={setSort}
      />

      <div className="container-narrow mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl bg-black/50 border border-white/10 p-8 text-center text-white/80">
            Tidak ada foto sesuai kriteria. Coba longgarkan filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
            {cols.map((col, cidx) => (
              <div key={cidx} className="flex flex-col gap-4">
                {col.map((it) => (
                  <GalleryPolaroid
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
   10) PAGE
   ========================= */
export default function Galeri() {
  // Money rain optional
  const bills = useMemo(() =>
    Array.from({ length: 10 }).map((_, i) => ({
      id: i, left: Math.random() * 100, dur: 6 + Math.random() * 4, delay: Math.random() * 0.8, rot: Math.random() * 60 - 30
    })), []);

  return (
    <Fragment>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;600;700;800&display=swap" />
      <ThemeStyle />
      <div className="noir-bg text-white font-[Manrope] min-h-screen grain relative">
        {/* header */}
        <Skyline />

        {/* subtle money rain */}
        {bills.map(b => (
          <div key={b.id} className="bill" style={{ left: b.left + '%', animationDuration: b.dur + 's', animationDelay: b.delay + 's', transform: `rotate(${b.rot}deg)` }} />
        ))}

        {/* body */}
        <div className="relative z-[1]">
          <div className="container-narrow px-4">
            <div className="mt-6 mb-2 flex items-center gap-2 text-white/80">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/10 border border-white/10">♠️</span>
              <span className="text-sm">Family Files • Keep it quiet</span>
            </div>
          </div>
          <GallerySection />
        </div>

        {/* footer */}
        <footer className="text-center py-10 px-6 border-t border-white/10 mt-12">
          <p className="text-white/70 text-lg">Selamat ulang tahun, FIKA. Simpan foto yang bikin kamu tersenyum. Sisanya biar kota yang bising ini lupa.</p>
          <p className="text-white/50 mt-2">© {new Date().getFullYear()} — Prepared by Arya.</p>
        </footer>
      </div>
    </Fragment>
  );
}

/* ===================================================================================
   Catatan:
   - Ganti `img*.jpg` dengan asetmu.
   - Tidak ada “kotak card”: tiap item adalah polaroid organik dengan tape & tepi tidak rata.
   - Semua fitur dari versi sebelumnya tetap, tapi estetika full mafia/noir.
   =================================================================================== */
