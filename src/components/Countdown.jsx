
import { useEffect, useMemo, useState } from "react";
import { diffToTarget, formatDateID } from "../utils/date";

const TARGET = "2025-12-31T19:00:00+07:00"; // ubah sesuai kebutuhan

function Part({ value, label }) {
  return (
    <div className="flex flex-col items-center px-3">
      <div className="text-3xl md:text-4xl font-extrabold tabular-nums">{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}

export default function Countdown() {
  const [state, setState] = useState(diffToTarget(TARGET));
  const targetLabel = useMemo(() => formatDateID(TARGET), []);

  useEffect(() => {
    const t = setInterval(() => setState(diffToTarget(TARGET)), 1000);
    return () => clearInterval(t);
  }, []);

  const over = state.distance <= 0;

  return (
    <div className="card p-6 text-center">
      <p className="badge mb-2">Hitung Mundur</p>
      <h3 className="text-xl font-bold mb-1">Menuju Perayaan</h3>
      <p className="text-sm text-gray-600 mb-4">Waktu acara: {targetLabel}</p>
      {over ? (
        <p className="text-emerald-600 font-semibold">Acara dimulai. Jangan telat lagi.</p>
      ) : (
        <div className="flex justify-center gap-2">
          <Part value={state.days} label="Hari" />
          <Part value={state.hours} label="Jam" />
          <Part value={state.minutes} label="Menit" />
          <Part value={state.seconds} label="Detik" />
        </div>
      )}
    </div>
  );
}
