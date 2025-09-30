// src/components/CoverPage.jsx
// =====================================================================================
// CoverPage: Halaman pembuka untuk WEBSITE UCAPAN ULANG TAHUN (bukan undangan).
// Konteks: Dibuat oleh pacar, "Arya Ade Wiguna", untuk Fika (Rofiatul Karomah).
//
// Fitur:
// - BUKAN teks undangan. Ini sapaan pembuka + vibe romantis (secukupnya).
// - Animasi partikel, balon melayang, glow orbs, fireflies, bokeh, shimmer.
// - Typewriter sapaan personal untuk tamu (guestName) kalau ada di URL.
// - Tombol "Buka Ucapan" dengan confetti, ripple effect, dan micro-interactions.
// - Tanpa library tambahan; hanya React + Tailwind v4. Semua animasi custom di sini.
// - Fokus ke interaktivitas halus agar pengalaman pertama itu "wow".
//
// Catatan integrasi:
// - Tailwind v4: pakai @import "tailwindcss" di src/index.css.
// - Kelas util .btn, .btn-primary, .btn-ghost sudah didefinisikan di index.css.
// - Anda boleh menambahkan gambar di /public/images/ untuk avatar jika ingin.
// - Komponen ini menerima props:
//     - onOpen: function yang dipanggil saat tombol ditekan untuk "masuk" ke laman utama
//     - guestName: nama tamu (opsional), untuk personalisasi salam
//
// File ini panjang demi estetika dan detail. Edit bagian "CONFIG" untuk personalisasi cepat.
// =====================================================================================

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";

// =====================================================================================
// CONFIG
// =====================================================================================

const CONFIG = {
    title: "Ucapan Ulang Tahun",
    subtitle: "Untuk Fika (Rofiatul Karomah) dari Arya Ade Wiguna",
    highlight: "Hari ini milikmu. Izinkan aku merayakanmu.",
    // Pesan pendek yang diputar untuk typewriter
    typewriterLines: [
        "Selamat ulang tahun, Fika.",
        "Semoga harimu ringan, hatimu lega.",
        "Terima kasih sudah berani tumbuh.",
        "Dari Arya, selalu.",
    ],
    // CTA
    ctaLabel: "Buka Ucapan 🎉",
    // Dekorasi warna
    gradientFrom: "from-pink-500",
    gradientTo: "to-purple-700",
    // balon jumlah
    balloons: 10,
    // partikel jumlah
    particles: 48,
};

// =====================================================================================
// UTIL
// =====================================================================================

function classNames(...args) {
    return args.filter(Boolean).join(" ");
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function useTypewriter(lines = [], speed = 40, pause = 900, loop = true) {
    const [text, setText] = useState("");
    const [lineIndex, setLineIndex] = useState(0);
    const [phase, setPhase] = useState("typing"); // typing | pause | deleting

    useEffect(() => {
        let t;
        if (!lines.length) return;

        const target = lines[lineIndex] || "";

        if (phase === "typing") {
            if (text.length < target.length) {
                t = setTimeout(() => setText(target.slice(0, text.length + 1)), speed);
            } else {
                setPhase("pause");
            }
        } else if (phase === "pause") {
            t = setTimeout(() => setPhase("deleting"), pause);
        } else if (phase === "deleting") {
            if (text.length > 0) {
                t = setTimeout(() => setText(text.slice(0, -1)), speed / 2);
            } else {
                const next = (lineIndex + 1) % lines.length;
                setLineIndex(next);
                if (!loop && next === 0) return;
                setPhase("typing");
            }
        }

        return () => clearTimeout(t);
    }, [text, phase, lineIndex, lines, speed, pause, loop]);

    return text;
}

// confetti sederhana (DOM-based), aman tanpa library
function confettiBurst(duration = 1000) {
    const end = Date.now() + duration;
    const colors = ["#22c55e", "#f97316", "#a855f7", "#06b6d4", "#f43f5e", "#f59e0b"];
    const frame = () => {
        const particle = document.createElement("div");
        const size = random(6, 10);
        particle.style.position = "fixed";
        particle.style.top = "0px";
        particle.style.left = random(0, 100) + "vw";
        particle.style.width = size + "px";
        particle.style.height = size + "px";
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = "0.95";
        particle.style.zIndex = "9999";
        particle.style.borderRadius = "999px";
        document.body.appendChild(particle);

        const fall = window.innerHeight + 60 + "px";
        particle
            .animate(
                [{ transform: "translateY(-20px) rotate(0)" }, { transform: `translateY(${fall}) rotate(540deg)` }],
                { duration: random(900, 1500), easing: "cubic-bezier(.15,.7,.3,1)" }
            )
            .finished.then(() => particle.remove());

        if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
}

// ripple effect untuk tombol
function rippleAt(e, parent) {
    const circle = document.createElement("span");
    const diameter = Math.max(parent.clientWidth, parent.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - (parent.getBoundingClientRect().left + radius)}px`;
    circle.style.top = `${e.clientY - (parent.getBoundingClientRect().top + radius)}px`;
    circle.className =
        "pointer-events-none absolute rounded-full bg-white/40 animate-[ripple_700ms_ease-out_1]";
    parent.appendChild(circle);
    setTimeout(() => circle.remove(), 750);
}

// =====================================================================================
// STYLED KEYFRAMES untuk animasi custom
// =====================================================================================

function DynamicKeyframes() {
    return (
        <style>{`
      @keyframes floaty {
        0%, 100% { transform: translateY(0) }
        50% { transform: translateY(-8px) }
      }
      @keyframes blobPulse {
        0%, 100% { transform: scale(1); opacity: .5 }
        50% { transform: scale(1.08); opacity: .7 }
      }
      @keyframes firefly {
        0% { transform: translate(0,0) scale(.8); opacity: .4 }
        50% { transform: translate(8px,-6px) scale(1); opacity: 1 }
        100% { transform: translate(0,0) scale(.8); opacity: .4 }
      }
      @keyframes rise {
        0% { transform: translateY(20px); opacity: 0 }
        100% { transform: translateY(0px); opacity: 1 }
      }
      @keyframes driftUp {
        0% { transform: translateY(0) translateX(0) rotate(0) }
        100% { transform: translateY(-120vh) translateX(20px) rotate(10deg) }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0 }
        100% { background-position: 200% 0 }
      }
      @keyframes sparkle {
        0% { transform: scale(0); opacity: 0.2 }
        50% { transform: scale(1); opacity: 1 }
        100% { transform: scale(0); opacity: 0 }
      }
      @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 0px rgba(255,255,255,.35)) }
        50% { filter: drop-shadow(0 0 12px rgba(255,255,255,.55)) }
      }
      @keyframes bounceOnce {
        0% { transform: translateY(0) }
        30% { transform: translateY(-10px) }
        60% { transform: translateY(0) }
        100% { transform: translateY(0) }
      }
      @keyframes ripple {
        0% { transform: scale(0); opacity: .5 }
        100% { transform: scale(1.5); opacity: 0 }
      }
    `}</style>
    );
}

// =====================================================================================
// SUB-KOMPONEN DEKORATIF
// =====================================================================================

// Glow blobs (lingkaran besar blur)
function GlowOrbs() {
    return (
        <>
            <div className="pointer-events-none absolute -z-10 inset-0">
                <div className="absolute top-14 left-10 w-52 h-52 rounded-full bg-white/20 blur-3xl animate-[blobPulse_6s_ease-in-out_infinite]" />
                <div className="absolute bottom-16 right-10 w-56 h-56 rounded-full bg-white/25 blur-3xl animate-[blobPulse_5.5s_ease-in-out_infinite]" />
            </div>
        </>
    );
}

// Bokeh sparkles
function Sparkles({ count = 18 }) {
    const dots = new Array(count).fill(0).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 6 + 4,
    }));
    return (
        <div className="pointer-events-none absolute inset-0 -z-10">
            {dots.map((d) => (
                <span
                    key={d.id}
                    className="absolute rounded-full bg-white/50"
                    style={{
                        top: `${d.top}%`,
                        left: `${d.left}%`,
                        width: d.size,
                        height: d.size,
                        animation: `sparkle 2.2s ease-in-out ${d.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}

// Fireflies
function Fireflies({ count = 10 }) {
    const flies = new Array(count).fill(0).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
    }));
    return (
        <div className="pointer-events-none absolute inset-0 -z-10">
            {flies.map((f) => (
                <span
                    key={f.id}
                    className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200"
                    style={{
                        top: `${f.top}%`,
                        left: `${f.left}%`,
                        animation: `firefly 2.6s ease-in-out ${f.delay}s infinite`,
                        filter: "drop-shadow(0 0 6px #fde68a)",
                    }}
                />
            ))}
        </div>
    );
}

// Floating balloons
function Balloons({ count = 10 }) {
    const balloons = new Array(count).fill(0).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 30 + 30,
        duration: Math.random() * 8 + 12,
        delay: Math.random() * 5,
        color:
            Math.random() > 0.5
                ? "bg-pink-300"
                : Math.random() > 0.5
                    ? "bg-purple-300"
                    : "bg-rose-300",
    }));
    return (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {balloons.map((b) => (
                <div
                    key={b.id}
                    className={classNames("absolute bottom-[-120px] rounded-full opacity-70", b.color)}
                    style={{
                        left: `${b.left}%`,
                        width: `${b.size}px`,
                        height: `${b.size * 1.2}px`,
                        animation: `driftUp ${b.duration}s ease-in ${b.delay}s infinite`,
                        filter: "blur(0.5px)",
                    }}
                />
            ))}
        </div>
    );
}

// Particles halus (bintang-bintang mini)
function Particles({ count = 48 }) {
    const dots = new Array(count).fill(0).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        scale: Math.random() * 0.6 + 0.7,
        delay: Math.random() * 1.5,
    }));
    return (
        <div className="pointer-events-none absolute inset-0 -z-10">
            {dots.map((d) => (
                <span
                    key={d.id}
                    className="absolute w-[2px] h-[2px] rounded-full bg-white"
                    style={{
                        top: `${d.top}%`,
                        left: `${d.left}%`,
                        transform: `scale(${d.scale})`,
                        animation: `glow 2.4s ease-in-out ${d.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}

// Decorative Divider
function FancyDivider() {
    return (
        <div className="relative w-40 h-1 my-6 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white to-white/40 rounded-full" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/90 shadow" />
        </div>
    );
}

// =====================================================================================
// CORE UI: TitleBlock, SubtitleBlock, TypewriterBlock, CTAButton
// =====================================================================================

function TitleBlock({ nameDisplay }) {
    return (
        <div className="animate-[rise_.6s_ease-out_1]">
            <p className="text-xl font-light mb-1 opacity-90">Untuk</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg">{nameDisplay}</h1>
        </div>
    );
}

function SubtitleBlock() {
    return (
        <div className="mt-4 text-white/90 animate-[rise_.8s_ease-out_1]">
            <p className="text-lg">
                {CONFIG.title} <span className="opacity-80">—</span> {CONFIG.subtitle}
            </p>
            <p className="mt-2 italic">{CONFIG.highlight}</p>
        </div>
    );
}

function TypewriterBlock() {
    const typed = useTypewriter(CONFIG.typewriterLines, 36, 900, true);
    return (
        <div className="mt-6 min-h-[2.5rem] animate-[rise_1s_ease-out_1]">
            <p className="text-2xl font-semibold drop-shadow">{typed}</p>
        </div>
    );
}

function CTAButton({ onOpen }) {
    const ref = useRef(null);

    const handleClick = (e) => {
        const node = ref.current;
        if (!node) return;
        rippleAt(e, node);
        confettiBurst(800);
        onOpen?.();
    };

    return (
        <div className="mt-8 animate-[bounceOnce_900ms_ease-out_1]">
            <div className="relative inline-block" ref={ref}>
                <Button
                    onClick={handleClick}
                    className={classNames(
                        "relative overflow-hidden px-8 py-3 text-lg shadow-xl",
                        "bg-white text-purple-700 hover:bg-white/90"
                    )}
                    aria-label="Buka ucapan ulang tahun"
                >
                    {CONFIG.ctaLabel}
                </Button>
                {/* shimmer overlay */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    style={{
                        background:
                            "linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.8s ease-in-out infinite",
                        mixBlendMode: "screen",
                    }}
                />
            </div>
        </div>
    );
}

// =====================================================================================
// BACKGROUND LAYER UTAMA
// =====================================================================================

function BackgroundLayer() {
    return (
        <>
            <DynamicKeyframes />
            <GlowOrbs />
            <Fireflies count={12} />
            <Sparkles count={20} />
            <Balloons count={CONFIG.balloons} />
            <Particles count={CONFIG.particles} />
        </>
    );
}

// =====================================================================================
// COVER CONTENT WRAPPER (card central + dekor)
// =====================================================================================

function CoverCard({ children }) {
    return (
        <div
            className={classNames(
                "text-center max-w-xl w-[92%] md:w-auto",
                "card p-8 border border-white/40 bg-white/10 text-white",
                "backdrop-blur-xl shadow-2xl"
            )}
            style={{
                boxShadow: "0 20px 50px rgba(0,0,0,.25)",
            }}
        >
            {children}
        </div>
    );
}

// =====================================================================================
// FOOTER MINI DI COVER
// =====================================================================================

function CoverFooterMini() {
    return (
        <div className="mt-6 text-xs text-white/80">
            <p>
                Dari Arya Ade Wiguna untuk Fika. Bukan RSVP, bukan undangan. Ini murni ucapan.
            </p>
        </div>
    );
}

// =====================================================================================
// KOMBINASI: Header kecil di atas card (mis. lencana tanggal)
// =====================================================================================

function HeaderChips() {
    return (
        <div className="mb-3 flex items-center justify-center gap-2">
            <span className="px-2 py-1 rounded-full bg-white/20 text-xs backdrop-blur">
                #HappyBirthday
            </span>
            <span className="px-2 py-1 rounded-full bg-white/20 text-xs backdrop-blur">
                #FromAryaWithCare
            </span>
            <span className="px-2 py-1 rounded-full bg-white/20 text-xs backdrop-blur">
                #ForFika
            </span>
        </div>
    );
}

// =====================================================================================
// KOMPONEN UTAMA: CoverPage
// =====================================================================================

export default function CoverPage({ onOpen, guestName }) {
    // Nama target: default "Kamu"
    const targetName = guestName || "Kamu";
    const nameDisplay = useMemo(() => targetName.toUpperCase(), [targetName]);

    // background gradient inline agar mudah diganti via CONFIG
    const gradient = classNames("bg-gradient-to-br", CONFIG.gradientFrom, CONFIG.gradientTo);

    // fokus ring ketika mount (aksesibilitas)
    const btnAutoFocusRef = useRef(null);
    useEffect(() => {
        const node = btnAutoFocusRef.current;
        if (node) {
            // sedikit delay agar tidak kasar
            const t = setTimeout(() => node.focus(), 350);
            return () => clearTimeout(t);
        }
    }, []);

    return (
        <div
            className={classNames(
                "fixed inset-0 flex flex-col items-center justify-center p-6 sm:p-8 text-white z-50",
                gradient
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Halaman pembuka ucapan ulang tahun"
        >
            {/* background decorations */}
            <BackgroundLayer />

            {/* wrapper card */}
            <div className="relative w-full flex items-center justify-center">
                <CoverCard>
                    <HeaderChips />

                    <TitleBlock nameDisplay={nameDisplay} />

                    <FancyDivider />

                    <SubtitleBlock />

                    <TypewriterBlock />

                    <CTAButton
                        onOpen={(e) => {
                            onOpen?.(e);
                        }}
                    />

                    <CoverFooterMini />
                </CoverCard>

                {/* decorative corners */}
                <div className="pointer-events-none">
                    <CornerDecor position="top-left" />
                    <CornerDecor position="bottom-right" />
                </div>
            </div>

            {/* tombol skip untuk aksesibilitas, kalau butuh */}
            <div className="sr-only">
                <button ref={btnAutoFocusRef} onClick={() => onOpen?.()} aria-label="Masuk ke halaman ucapan">
                    Masuk
                </button>
            </div>
        </div>
    );
}

// =====================================================================================
// CORNER DECOR
// =====================================================================================

function CornerDecor({ position = "top-left" }) {
    const isTL = position === "top-left";
    const isBR = position === "bottom-right";

    const base = "absolute w-28 h-28 opacity-60";
    const cornerClass = isTL
        ? "top-2 left-2 rotate-0"
        : isBR
            ? "bottom-2 right-2 rotate-180"
            : "top-2 right-2";

    return (
        <svg
            className={classNames(base, cornerClass)}
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="100" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,.7)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,.2)" />
                </linearGradient>
            </defs>
            <path d="M0 0 L100 0 L100 10 Q70 12 60 20 T40 40 T10 60 L0 60 Z" fill="url(#grad)" />
        </svg>
    );
}

// =====================================================================================
// Catatan tambahan:
// - Kalau mau menampilkan avatar/ikon kecil Arya atau Fika, taruh img di atas TitleBlock.
// - Jika ingin menambahkan tombol "Matikan animasi" untuk device lemah,
//   Anda bisa menambahkan state global yang mematikan komponen dekor seperti Balloons/Particles.
// - Kontras teks sudah cukup tinggi. Jika gradient diganti lebih gelap, pertimbangkan text-white/90.
// - Komponen ini DIARAHKAN untuk mood "ceria + hangat". Silakan tweak warna agar sesuai selera.
// =====================================================================================
