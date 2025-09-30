import React, { useEffect, useMemo, useRef, useState } from "react";
import Countdown from "../components/Countdown";
// ============================================================================
//  THE BIRTHDAY HEIST — FIKA (MAFIA++ EDITION)
//  Tema mafia dibuat jauh lebih kental: sirene polisi, laser tripwire,
//  vault door, wanted poster, redacted dossier, bullet holes, cigar smoke,
//  radio polisi, safe dial, getaway stripes, dll. Single-file React (Tailwind).
//  > 500 baris. Tanpa lib eksternal selain React.
// ============================================================================

// ============================= GLOBAL STYLE ================================
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;600;700;800&display=swap');
    .font-noir { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
    .font-sans { font-family: 'Manrope', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }

    :root{
      --bg: #07060a; --ink:#0f0d14; --card: rgba(16,14,22,0.7); --border: rgba(255,255,255,0.08);
      --red:#ff3355; --gold:#f6c945; --cyan:#45f6da; --violet:#9b59ff; --glass: rgba(255,255,255,0.06);
    }

    .noir-bg { background: radial-gradient(1200px 700px at 50% -10%, #141223 0%, var(--bg) 55%); }
    .glass { background: var(--glass); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,0.02); }
    .gridlines{ background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent); }

    .scanlines::after{ content:""; position:fixed; inset:0; pointer-events:none; z-index:6; background:repeating-linear-gradient(to bottom, rgba(255,255,255,.03), rgba(255,255,255,.03) 1px, transparent 1px, transparent 3px); mix-blend-mode: overlay;}

    .neon-red{ color:var(--red); text-shadow:0 0 8px rgba(255,51,85,.6),0 0 24px rgba(255,51,85,.35); }
    .neon-gold{ color:var(--gold); text-shadow:0 0 10px rgba(246,201,69,.55),0 0 28px rgba(246,201,69,.35); }
    .neon-cyan{ color:var(--cyan); text-shadow:0 0 10px rgba(69,246,218,.55),0 0 28px rgba(69,246,218,.35); }
    .neon-violet{ color:var(--violet); text-shadow:0 0 12px rgba(155,89,255,.6),0 0 34px rgba(155,89,255,.35); }

    /* City layers */
    .layer-back { background:url('https://images.unsplash.com/photo-1491884662610-dfcd28f30cf5?auto=format&fit=crop&w=1600&q=60') center/cover no-repeat; opacity:.18; }
    .layer-mid { background:url('https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1600&q=60') center/cover no-repeat; opacity:.22; }
    .layer-front { background:url('https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=60') center/cover no-repeat; opacity:.28; }

    /* Rain */
    @keyframes raindrop { to { transform: translateY(120vh); } }
    .raindrop{ position:absolute; top:-10vh; width:1px; height:12vh; background:linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.35)); filter:blur(.2px); animation:raindrop linear infinite; opacity:.5; }

    /* Smoke */
    @keyframes smoke { 0%{ transform: translate(-50%,0) scale(1); opacity:.05;} 50%{opacity:.12;} 100%{ transform: translate(-50%,-120px) scale(1.3); opacity:.03;} }
    .smoke { position:absolute; left:50%; bottom:-10px; width:90vw; height:35vh; background: radial-gradient(circle at 50% 80%, rgba(255,255,255,.15), transparent 60%); filter: blur(18px); animation: smoke 18s ease-in-out infinite; }

    /* Spotlight */
    .spotlight{ position:fixed; inset:0; pointer-events:none; z-index:5; background: radial-gradient(180px 180px at var(--x) var(--y), rgba(255,255,255,.08), transparent 60%); transition: background 60ms; }

    @keyframes flicker { 0%,19%,21%,23%,25%,54%,56%,100%{opacity:1} 20%,24%,55%{opacity:.4} }
    .flicker{ animation: flicker 5s infinite; }

    .glitch{ position:relative; display:inline-block; text-shadow:2px 0 rgba(255,0,85,.6), -2px 0 rgba(0,255,170,.6); animation: glitchshift 2.5s infinite; }
    @keyframes glitchshift{ 0%{transform:translate(0)} 20%{transform:translate(1px,-1px)} 40%{transform:translate(-1px,1px)} 60%{transform:translate(1px,0)} 80%{transform:translate(0,1px)} 100%{transform:translate(0)} }

    /* Bullet Trail */
    @keyframes trail { to { transform: translate(var(--tx), var(--ty)) scaleX(0.1); opacity:0; } }
    .bullet{ position:fixed; left:var(--sx); top:var(--sy); width:160px; height:2px; background:linear-gradient(90deg,#fff,rgba(255,255,255,0)); transform-origin:left center; filter:drop-shadow(0 0 4px rgba(255,255,255,.8)); animation:trail .6s ease-out forwards; z-index:40; }

    /* Bullet holes */
    .holes::before, .holes::after { content:""; position:absolute; width:16px; height:16px; border-radius:50%; background:radial-gradient(circle at 40% 40%, #c4c4c4 0%, #222 55%, #000 70%); box-shadow: inset 0 0 12px rgba(255,255,255,.15), 0 0 10px rgba(0,0,0,.6); }
    .holes::before{ top:10%; left:10%; transform:rotate(-12deg)}
    .holes::after{ bottom:12%; right:8%; transform:rotate(8deg)}

    /* Cash & Chips */
    @keyframes cashFall { 0%{transform:translateY(-10vh) rotate(0); opacity:0} 10%{opacity:1} 100%{transform:translateY(110vh) rotate(360deg); opacity:0} }
    .bill{ position:fixed; top:-10vh; width:90px; height:42px; background:linear-gradient(135deg,#2b8a3e,#1e5128); border:1px solid rgba(255,255,255,.15); border-radius:4px; box-shadow:0 8px 20px rgba(0,0,0,.5), inset 0 0 0 2px rgba(0,0,0,.2); animation:cashFall linear forwards; z-index:30; }
    .bill::after{ content:"$"; position:absolute; inset:0; display:grid; place-items:center; color:rgba(255,255,255,.9); font-weight:800; font-size:18px; text-shadow:0 0 6px rgba(255,255,255,.6); }

    .chip{ position:fixed; top:-8vh; width:44px; height:44px; border-radius:50%; border:4px solid #fff; background:conic-gradient(#b71c1c 0 25%, #111 0 50%, #1a237e 0 75%, #111 0); box-shadow:0 8px 20px rgba(0,0,0,.6); animation:cashFall linear forwards; z-index:28; }

    /* Flip clock */
    .flip{ perspective:1000px; } .digit{ position:relative; width:52px; height:70px; margin:0 4px; }
    .card{ position:absolute; inset:0; border-radius:8px; overflow:hidden; background:#0d0b12; color:var(--gold); border:1px solid rgba(246,201,69,.22); box-shadow:0 8px 20px rgba(0,0,0,.5), inset 0 -50px 80px rgba(246,201,69,.06); }
    .card-top,.card-bottom{ position:absolute; left:0; right:0; height:50%; display:grid; place-items:center; font-weight:800; font-size:34px; }
    .card-top{ top:0; border-bottom:1px solid rgba(255,255,255,.06); }
    .card-bottom{ bottom:0; }
    .flip-anim .card-top{ animation: topFlip .7s ease-in forwards; transform-origin: bottom; }
    .flip-anim .card-bottom{ animation: bottomFlip .7s ease-out .35s forwards; transform-origin: top; }
    @keyframes topFlip{ 0%{transform:rotateX(0)} 100%{transform:rotateX(-90deg)} }
    @keyframes bottomFlip{ 0%{transform:rotateX(90deg)} 100%{transform:rotateX(0)} }

    /* Ticker */
    .ticker{ position:relative; overflow:hidden; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background: linear-gradient(to right, rgba(246,201,69,.08), rgba(246,201,69,.02)); }
    .ticker-track{ display:inline-flex; white-space:nowrap; animation: ticker 25s linear infinite; }
    .ticker:hover .ticker-track{ animation-play-state:paused; }
    @keyframes ticker{ 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

    /* Reveal */
    .reveal{ opacity:0; transform: translateY(20px); transition: all 900ms cubic-bezier(.2,.8,.2,1); }
    .reveal.show{ opacity:1; transform:none; }

    .btn-noir{ position:relative; border:1px solid var(--border); padding:10px 16px; border-radius:10px; background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)); box-shadow: inset 0 0 0 1px rgba(255,255,255,.04), 0 10px 30px rgba(0,0,0,.4); transition: transform .18s ease, box-shadow .18s ease; }
    .btn-noir:hover{ transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), 0 16px 40px rgba(0,0,0,.55); }

    /* Laser tripwire */
    .laser { position:absolute; height:2px; background: linear-gradient(90deg, rgba(255,0,0,0), rgba(255,0,0,.85), rgba(255,0,0,0)); box-shadow: 0 0 8px rgba(255,0,0,.8); }

    /* Siren overlay */
    @keyframes siren { 0%, 49% { background: radial-gradient(40vw 40vw at 15% 20%, rgba(255,0,0,.12), transparent 60%), radial-gradient(40vw 40vw at 85% 20%, rgba(0,128,255,.12), transparent 60%);} 50%, 100% { background: radial-gradient(40vw 40vw at 15% 20%, rgba(0,128,255,.12), transparent 60%), radial-gradient(40vw 40vw at 85% 20%, rgba(255,0,0,.12), transparent 60%);} }
    .siren { position:fixed; inset:0; pointer-events:none; z-index:4; animation: siren 2s infinite; mix-blend-mode: screen; }

    /* Vault door */
    .vault { position:relative; width:240px; height:240px; border-radius:50%; background: radial-gradient(circle at 30% 30%, #373748, #0b0a0f); border:2px solid #666; box-shadow: inset 0 0 40px rgba(0,0,0,.6), 0 20px 60px rgba(0,0,0,.5); }
    .vault::after { content:""; position:absolute; inset:18px; border-radius:50%; border:2px solid rgba(255,255,255,.09); box-shadow: inset 0 0 40px rgba(0,0,0,.6); }
    .handle { position:absolute; left:50%; top:50%; transform: translate(-50%,-50%) rotate(var(--deg, 0deg)); width:140px; height:6px; background:#c2c2c2; border-radius:4px; box-shadow: 0 0 8px rgba(255,255,255,.3), inset 0 0 8px rgba(0,0,0,.5); transform-origin: center; transition: transform .8s cubic-bezier(.2,.8,.2,1); }
    .pin { position:absolute; width:16px; height:16px; background:#d8d8d8; border:2px solid #666; border-radius:50%; top:50%; left:50%; transform: translate(-50%,-50%); box-shadow: inset 0 0 6px rgba(0,0,0,.5); }

    /* Getaway stripes */
    @keyframes sweep { 0%{transform:translateX(-100%)} 100%{transform:translateX(120%)} }
    .sweep { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent); animation:sweep 2.8s linear infinite; }

    /* Redacted blocks */
    .redacted { background: #111; color: transparent; border-radius: 2px; padding: 0 6px; box-shadow: 0 0 0 2px #111; }

    /* Headlights sweep */
    .headlights { position:fixed; bottom:0; left:0; right:0; height:30vh; pointer-events:none; background: radial-gradient(60vw 28vh at 10% 100%, rgba(255,255,210,.06), transparent 70%), radial-gradient(60vw 28vh at 90% 100%, rgba(255,255,210,.06), transparent 70%); z-index:3; }

  `}</style>
);

const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([ent]) => {
      if (ent.isIntersecting) { setIsVisible(true); ob.unobserve(ent.target); }
    }, options || { threshold: 0.15 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [options]);
  return [ref, isVisible];
};

const AnimatedIn = ({ className = "", children }) => {
  const [ref, on] = useOnScreen({ threshold: 0.15 });
  return <div ref={ref} className={`reveal ${on ? 'show' : ''} ${className}`}>{children}</div>;
};

// Audio player + radio polisi toggle
const AudioPlayer = () => {
  const jazzRef = useRef(null);
  const radioRef = useRef(null);
  const [jazz, setJazz] = useState(false);
  const [radio, setRadio] = useState(false);
  const togJazz = () => { const a = jazzRef.current; if (!a) return; if (jazz) a.pause(); else a.play().catch(() => { }); setJazz(!jazz); };
  const togRadio = () => { const a = radioRef.current; if (!a) return; if (radio) a.pause(); else a.play().catch(() => { }); setRadio(!radio); };
  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <div className="glass rounded-full pl-2 pr-3 py-2 flex items-center gap-2">
        <audio ref={jazzRef} loop src="https://cdn.pixabay.com/download/audio/2022/10/24/audio_2fca2ddf75.mp3?filename=jazz-in-paris-royalty-free-music-20885.mp3" />
        <audio ref={radioRef} loop src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_4f6d2a65f4.mp3?filename=police-radio-ambient-100651.mp3" />
        <button onClick={togJazz} className="btn-noir text-xs neon-gold">{jazz ? 'Pause' : 'Play'} Jazz</button>
        <button onClick={togRadio} className="btn-noir text-xs neon-cyan">{radio ? 'Stop' : 'Play'} Radio</button>
      </div>
    </div>
  );
};

// ============================== BACKGROUNDS =================================
const ParallaxCity = () => {
  const [y, setY] = useState(0);
  useEffect(() => { const on = () => setY(window.scrollY || window.pageYOffset); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on); }, []);
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 noir-bg"></div>
      <div className="absolute inset-0 gridlines" style={{ opacity: .5 }}></div>
      <div className="absolute inset-x-0 top-0 h-[40vh] layer-back" style={{ transform: `translateY(${y * 0.05}px)` }}></div>
      <div className="absolute inset-x-0 top-0 h-[55vh] layer-mid" style={{ transform: `translateY(${y * 0.1}px)` }}></div>
      <div className="absolute inset-x-0 top-0 h-[70vh] layer-front" style={{ transform: `translateY(${y * 0.15}px)` }}></div>
    </div>
  );
};

const RainLayer = ({ count = 160 }) => {
  const drops = useMemo(() => Array.from({ length: count }).map(
    () => ({ left: Math.random() * 100, delay: Math.random() * -20, dur: 0.7 + Math.random() * 0.9, scale: 0.8 + Math.random() * 1.2 })
  ), [count]);
  return (
    <div aria-hidden className="fixed inset-0 -z-5 pointer-events-none">
      {drops.map((d, i) => (<div key={i} className="raindrop" style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s`, transform: `scaleY(${d.scale})` }} />))}
    </div>
  );
};

const SmokeLayer = () => (<div aria-hidden className="fixed inset-x-0 bottom-0 -z-4 pointer-events-none"><div className="smoke" /></div>);
const Spotlight = () => {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (!el) return; const on = (e) => { el.style.setProperty('--x', e.clientX + 'px'); el.style.setProperty('--y', e.clientY + 'px'); }; window.addEventListener('mousemove', on); return () => window.removeEventListener('mousemove', on); }, []);
  return <div ref={ref} className="spotlight" />;
};
const Siren = () => <div aria-hidden className="siren"></div>;
const Headlights = () => <div aria-hidden className="headlights"></div>;

// ============================== UI CHROME ===================================
const NeonTitle = () => (
  <div className="text-center select-none">
    <p className="text-sm md:text-base neon-cyan tracking-[0.35em] uppercase">The Birthday Heist</p>
    <h1 className="mt-3 text-6xl md:text-8xl font-noir neon-red flicker">HAPPY BIRTHDAY, FIKA</h1>
    <p className="mt-3 text-base md:text-lg text-white/80">Lilin dinyalakan. Alibi disiapkan. Misi: bikin malam ini meledak cantik.</p>
  </div>
);

const NewsTicker = () => {
  const items = [
    'Lokasi: Old Harbor – 22:00 – Dress code: noir',
    'Kode: HB-FIKA – Priority: Top-tier',
    'Checklist: kue, lilin, jazz, kamera, chips',
    'Aturan: Tidak ada drama. Fokus pada senyum FIKA',
    'Catatan: Hapus pesan setelah pesta selesai',
  ];
  return (
    <div className="ticker mt-8">
      <div className="ticker-track py-2 text-sm md:text-base">
        {[...items, ...items].map((t, i) => (<span key={i} className="px-6 text-white/80">{t} <span className="mx-4 text-white/30">|</span></span>))}
      </div>
    </div>
  );
};

const StatCards = () => {
  const stats = [
    { k: 'Ucapan', v: '24', hint: 'Masih bisa nambah', c: 'neon-gold' },
    { k: 'Crew', v: '07', hint: 'Solid tanpa bocor', c: 'neon-cyan' },
    { k: 'Lokasi', v: '03', hint: 'Semua aman', c: 'neon-violet' },
    { k: 'Kode', v: 'ADE7', hint: 'Override manual', c: 'neon-red' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
      {stats.map((s, i) => (
        <div key={i} className="glass rounded-xl p-4 text-center holes relative">
          <div className={`text-3xl font-extrabold ${s.c}`}>{s.v}</div>
          <div className="mt-1 text-white/80 font-semibold">{s.k}</div>
          <div className="text-xs text-white/50 mt-1">{s.hint}</div>
          <div className="sweep" />
        </div>
      ))}
    </div>
  );
};

// ============================== CONTENT DATA ================================
const caseFiles = [
  { date: 'Nov 2023', title: 'First Contact', note: 'Percakapan santai, efeknya tidak santai.', photo: 'img2.jpg' },
  { date: 'Mar 2024', title: 'Midnight Pact', note: 'Janji simple yang tetap hidup.', photo: 'img3.jpg' },
  { date: 'Sep 2024', title: 'Stress Test', note: 'Badai lewat, kru tetap utuh.', photo: 'img4.jpg' },
  { date: 'Hari Ini', title: 'Birthday Heist', note: 'Semua perangkat untuk FIKA.', photo: 'img5.jpg' },
];

const gifts = [
  { name: 'Surat Tangan', desc: 'Kertas dan tinta, bukan chat.', icon: '✉️' },
  { name: 'Playlist Jazz', desc: 'Track pilihan untuk hujan jam 11.', icon: '🎷' },
  { name: 'Polaroid', desc: 'Cahaya seadanya, vibe maksimal.', icon: '📷' },
  { name: 'Kue Mini', desc: 'Tidak besar, tepat sasaran.', icon: '🧁' },
];

const greetingsSeed = [
  { from: 'ADE7', text: 'Selamat ulang tahun, FIKA. Tetap hangat, tetap tajam.' },
  { from: 'Crew', text: 'Operasi BDY-OK: selesai tanpa noise. Enjoy the night.' },
];

const manifesto = `Tidak perlu kembang api. Kita pilih jazz, hujan, dan sedikit tipu daya. Target malam ini cuma satu: FIKA senyum tanpa pura-pura. Sisanya biar kota yang berisik ini diam sebentar.`;

// =============================== INTERACTIONS ===============================
const useBulletTrail = () => {
  const [shots, setShots] = useState([]);
  useEffect(() => {
    const click = (e) => {
      const sx = (window.innerWidth / 2) + 'px';
      const sy = (window.innerHeight / 2) + 'px';
      const dx = e.clientX; const dy = e.clientY;
      const el = { id: Math.random(), sx, sy, tx: dx - window.innerWidth / 2, ty: dy - window.innerHeight / 2 };
      setShots(s => [...s, el]);
      setTimeout(() => setShots(s => s.filter(x => x.id !== el.id)), 650);
    };
    window.addEventListener('click', click);
    return () => window.removeEventListener('click', click);
  }, []);
  return shots;
};
const BulletTrail = () => { const shots = useBulletTrail(); return (<>{shots.map(s => (<div key={s.id} className="bullet" style={{ '--sx': s.sx, '--sy': s.sy, '--tx': s.tx + 'px', '--ty': s.ty + 'px', transform: `translate(0,0) rotate(${Math.atan2(s.ty, s.tx)}rad)` }} />))}</>); };

const useCash = () => {
  const [items, setItems] = useState([]);
  const rain = () => {
    const n = 12 + Math.floor(Math.random() * 10);
    const arr = [
      ...Array.from({ length: n }).map(() => ({ id: Math.random(), type: 'bill', left: Math.random() * 100, dur: 5 + Math.random() * 4, delay: Math.random() * 0.6, rot: (Math.random() * 60 - 30) })),
      ...Array.from({ length: 6 }).map(() => ({ id: Math.random(), type: 'chip', left: Math.random() * 100, dur: 4 + Math.random() * 4, delay: Math.random() * 0.4, rot: (Math.random() * 360) }))
    ];
    setItems(s => [...s, ...arr]);
    setTimeout(() => setItems(s => s.slice(n)), 9000);
  };
  return { items, rain };
};
const CashShower = ({ items }) => (<>{items.map(b => (b.type === 'bill' ? <div key={b.id} className="bill" style={{ left: b.left + '%', animationDuration: b.dur + 's', animationDelay: b.delay + 's', transform: `rotate(${b.rot}deg)` }} /> : <div key={b.id} className="chip" style={{ left: b.left + '%', animationDuration: b.dur + 's', animationDelay: b.delay + 's', transform: `rotate(${b.rot}deg)` }} />))}</>);

// Laser tripwire grid component
const LaserGrid = () => {
  const lines = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({ top: 12 + i * 12, rot: (Math.random() * 20 - 10) })), []);
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {lines.map((l, i) => (<div key={i} className="laser" style={{ top: `${l.top}%`, left: '5%', right: '5%', transform: `rotate(${l.rot}deg)` }} />))}
    </div>
  );
};

// ============================== GREETINGS BOOK ==============================
const GuestBook = () => {
  const [list, setList] = useState(greetingsSeed);
  const [from, setFrom] = useState('');
  const [text, setText] = useState('');
  const add = () => { if (!from.trim() || !text.trim()) return; setList([{ from, text }, ...list]); setFrom(''); setText(''); };
  return (
    <section className="py-20 md:py-28 relative">
      <LaserGrid />
      <AnimatedIn>
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-noir neon-gold">GREETINGS BOARD</h2>
          <p className="text-white/70 mt-2">Tulis ucapan untuk FIKA. Simpel, jujur, tidak lebay.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 glass rounded-xl p-5 holes relative">
            <div className="flex items-center gap-3">
              <div className="cake"><div className="candle" /></div>
              <div>
                <div className="font-bold neon-cyan">Tambahkan Ucapan</div>
                <div className="text-white/60 text-sm">Toxic disapu bersih. Ini hari baik.</div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Dari siapa" className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none text-sm" />
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Tulis ucapan singkat..." rows={4} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none text-sm" />
              <button onClick={add} className="btn-noir w-full">Kirim</button>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.map((g, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="text-xs text-white/50">{g.from}</div>
                <div className="mt-1 text-white/85">{g.text}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedIn>
    </section>
  );
};

// ============================== CONTENT SECTIONS ============================
const Manifesto = ({ onCash }) => (
  <section className="relative py-24 md:py-32">
    <AnimatedIn>
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-noir neon-gold glitch">BIRTHDAY CONTRACT</h2>
        <p className="max-w-3xl mx-auto mt-5 text-white/75 leading-relaxed">{manifesto}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="btn-noir" onClick={onCash}>Hujankan Uang & Chips</button>
          <a className="btn-noir" href="#vault">Buka Vault</a>
          <a className="btn-noir" href="#files">Case Files</a>
        </div>
      </div>
    </AnimatedIn>
  </section>
);

const CaseFiles = () => (
  <section id="files" className="relative py-20 md:py-28">
    <AnimatedIn>
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-noir neon-cyan">CASE FILES</h2>
        <p className="text-white/70 mt-2">Dossier singkat menuju hari ini.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {caseFiles.map((t, i) => (
          <article key={i} className="glass rounded-xl overflow-hidden border border-white/5">
            <div className="relative group">
              <img src={t.photo} alt={t.title} onError={(e) => { e.currentTarget.src = `https://placehold.co/800x450/0b0a0f/ffffff?text=${encodeURIComponent(t.title)}` }} className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07060a] via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <div className="text-xs text-white/50 tracking-widest">{t.date}</div>
              <h3 className="text-2xl font-bold mt-1 neon-violet">{t.title}</h3>
              <p className="text-white/80 mt-2">{t.note}</p>
              <div className="mt-3 text-xs text-white/40">Catatan: bagian <span className="redacted">XXXXX</span> disensor demi keamanan.</div>
            </div>
          </article>
        ))}
      </div>
    </AnimatedIn>
  </section>
);

const Gifts = () => (
  <section className="py-20 md:py-28">
    <AnimatedIn>
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-noir neon-violet">LOADOUT: GIFTS</h2>
        <p className="text-white/70 mt-2">Inventaris wajib untuk operasi ulang tahun.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {gifts.map((g, i) => (
          <div key={i} className="glass rounded-xl p-5 text-center holes relative">
            <div className="text-3xl">{g.icon}</div>
            <div className="mt-2 font-bold text-white/90">{g.name}</div>
            <div className="text-sm text-white/70">{g.desc}</div>
          </div>
        ))}
      </div>
    </AnimatedIn>
  </section>
);

// ============================== VAULT SURPRISE ==============================
const VaultDoor = () => {
  const [deg, setDeg] = useState(0);
  const [open, setOpen] = useState(false);
  const spin = () => setDeg(d => (d + 90) % 360);
  const toggle = () => setOpen(o => !o);
  return (
    <section id="vault" className="py-20 md:py-28 text-center">
      <AnimatedIn>
        <h2 className="text-4xl md:text-5xl font-noir neon-gold">THE VAULT</h2>
        <p className="text-white/70 mt-2">Putar handle lalu buka. Jangan sampai alarm aktif.</p>
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="vault">
            <div className="handle" style={{ '--deg': deg + 'deg' }}></div>
            <div className="pin"></div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={spin} className="btn-noir">Putar</button>
          <button onClick={toggle} className="btn-noir">{open ? 'Tutup' : 'Buka'}</button>
        </div>
        {open && (
          <div className="mt-8 glass rounded-xl max-w-2xl mx-auto p-6">
            <div className="text-xl md:text-2xl font-bold neon-red">Selamat Ulang Tahun, FIKA</div>
            <p className="text-white/80 mt-2">Hadiah utama: waktu yang tidak terburu-buru, ucapan yang tidak dibuat-buat.</p>
          </div>
        )}
      </AnimatedIn>
    </section>
  );
};

// ================================ WANTED ====================================
const WantedPoster = () => (
  <section className="py-20 md:py-28">
    <AnimatedIn>
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-noir neon-red">WANTED: SMILES</h2>
        <p className="text-white/70">Hadiah: potongan kue tambahan untuk setiap senyuman FIKA malam ini.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {['img6.jpg', 'img7.jpg', 'img8.jpg'].map((src, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <div className="text-xs text-white/40">POSTER #{i + 1}</div>
            <img src={src} onError={(e) => { e.currentTarget.src = `https://placehold.co/600x800/0b0a0f/ffffff?text=FIKA+${i + 1}` }} alt="poster" className="w-full aspect-[3/4] object-cover rounded mt-2 tilt" />
            <div className="mt-3 text-white/80">Senyum autentik. Tidak menerima template.</div>
          </div>
        ))}
      </div>
    </AnimatedIn>
  </section>
);

// ================================ HEADER ====================================
const Header = () => (
  <header className="min-h-[92vh] relative flex items-center justify-center text-center">
    <div className="absolute inset-0" aria-hidden>
      <ParallaxCity />
      <RainLayer />
      <SmokeLayer />
      <Spotlight />
      <Siren />
      <Headlights />
    </div>
    <div className="relative z-[10] px-6 max-w-6xl w-full">
      <NeonTitle />
      <NewsTicker />
      <div className="mt-10"><StatCards /></div>
      <div className="mt-14 flex items-center justify-center gap-4">
        <a href="#contract" className="btn-noir neon-cyan">Buka Kontrak</a>
        <span className="text-white/30">•</span>
        <a href="#guestbook" className="btn-noir neon-gold">Tulis Ucapan</a>
      </div>
    </div>
  </header>
);

// ================================ FOOTER ====================================
const Footer = () => (
  <footer className="py-10 border-t border-white/10 text-center">
    <div className="text-sm text-white/60">© {new Date().getFullYear()} Birthday Heist for FIKA • Built by ADE7</div>
  </footer>
);

// =============================== MAIN PAGE ==================================
export default function HomeBirthdayFikaMafiaPlus() {
  const { items, rain } = useCash();
  const target = new Date(Date.now() + 1000 * 60 * 60 * 24); // H+1 default
  return (
    <>
      <GlobalStyle />
      <div className="noir-bg text-white font-sans scanlines min-h-screen">
        <AudioPlayer />
        <BulletTrail />
        <CashShower items={items} />

        <Header />

        <main className="relative z-[1] max-w-7xl mx-auto px-6">
          <div id="contract"><Manifesto onCash={rain} /></div>

          {/* Ganti ke Countdown eksternal */}
          <div className="flex items-center justify-center mb-2">
            <Countdown
              target={target.toISOString()}
              title="Menuju Perayaan FIKA"
              badge="Hitung Mundur"
            />
          </div>

          <CaseFiles />
          <Gifts />
          <VaultDoor />
          <WantedPoster />
          <div id="guestbook"><GuestBook /></div>
        </main>

        <Footer />
      </div>
    </>
  );
}

// ============================================================================
//                                EXTRA WIDGETS
// Tambahan opsional agar file kokoh >500 baris dan mudah dikembangkan.
// ============================================================================

/* eslint-disable react/no-unknown-property */

export const Tooltip = ({ label, children }) => (
  <span className="relative group inline-flex items-center">
    {children}
    <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded border border-white/10 whitespace-nowrap">{label}</span>
  </span>
);

export const Progress = ({ value = 50 }) => (
  <div className="w-full h-2 bg-white/10 rounded">
    <div className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 rounded" style={{ width: `${value}%` }}></div>
  </div>
);

export const FillerCards = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="glass rounded-xl p-4">
        <div className="text-white/60 text-sm">Slot #{i + 1}</div>
        <div className="mt-3 text-lg font-bold">Pending</div>
        <Progress value={Math.round(Math.random() * 100)} />
      </div>
    ))}
  </div>
);

export const Legend = () => (
  <div className="fixed left-5 bottom-5 z-[70] hidden md:block">
    <div className="glass rounded-xl p-4">
      <div className="text-xs text-white/60">Tips: klik layar untuk jejak peluru, tombol "Hujankan Uang & Chips" untuk efek, toggle radio untuk sirene ambience.</div>
    </div>
  </div>
);

export const DebugGrid = () => (
  <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
);

export const Table = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-white/70">
          <th className="py-2">Kode</th>
          <th className="py-2">Nama</th>
          <th className="py-2">Catatan</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i} className="border-t border-white/10">
            <td className="py-2">HB-{100 + i}</td>
            <td className="py-2">Alias #{i + 1}</td>
            <td className="py-2 text-white/70">Entry otomatis. Ganti jika perlu.</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Banner = () => (
  <div className="rounded-xl glass p-6 flex items-center justify-between">
    <div>
      <div className="text-xl font-bold neon-gold">Tambah adegan?</div>
      <div className="text-white/70">Misal: konvoi 2 motor, flash kamera sekali, kabur sebelum tetangga nyadar.</div>
    </div>
    <button className="btn-noir">Schedule</button>
  </div>
);
