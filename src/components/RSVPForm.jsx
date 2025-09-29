
import { useState } from "react";
import Toast from "./Toast";
import Button from "./Button";
import { storage } from "../utils/storage";

function confettiBurst() {
  // mini confetti tanpa lib, layar penuh sederhana
  const duration = 900;
  const end = Date.now() + duration;
  const colors = ["#22c55e","#f97316","#a855f7","#06b6d4","#f43f5e"];
  const frame = () => {
    const particle = document.createElement("div");
    const size = Math.random()*8 + 4;
    particle.style.position = "fixed";
    particle.style.top = "0px";
    particle.style.left = Math.random()*100 + "vw";
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.background = colors[Math.floor(Math.random()*colors.length)];
    particle.style.opacity = "0.9";
    particle.style.zIndex = "9999";
    particle.style.borderRadius = "999px";
    document.body.appendChild(particle);
    const fall =  (window.innerHeight + 40) + "px";
    particle.animate([
      { transform: "translateY(-20px) rotate(0deg)" },
      { transform: `translateY(${fall}) rotate(360deg)` }
    ], { duration: 1200 + Math.random()*600, easing: "ease-out" })
    .finished.then(()=> particle.remove());
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export default function RSVPForm() {
  const [form, setForm] = useState({ name: "", total: 1, status: "yes", message: "" });
  const [toast, setToast] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "total" ? Math.max(1, Number(value)) : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setToast({ type: "error", message: "Nama wajib diisi." });
      return;
    }
    storage.addRSVP({ ...form, ts: Date.now() });
    setToast({ type: "success", message: "RSVP terkirim. Sampai ketemu." });
    confettiBurst();
    setForm({ name: "", total: 1, status: "yes", message: "" });
  };

  return (
    <div className="card p-6 max-w-xl mx-auto">
      <p className="badge mb-3">Form RSVP</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nama</label>
          <input name="name" value={form.name} onChange={onChange}
            className="w-full rounded-xl border px-3 py-2" placeholder="Nama lengkap" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Kehadiran</label>
            <select name="status" value={form.status} onChange={onChange}
              className="w-full rounded-xl border px-3 py-2">
              <option value="yes">Hadir</option>
              <option value="no">Tidak hadir</option>
              <option value="maybe">Masih mikir</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Jumlah Tamu</label>
            <input name="total" type="number" min="1" value={form.total} onChange={onChange}
              className="w-full rounded-xl border px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Pesan (opsional)</label>
          <textarea name="message" value={form.message} onChange={onChange}
            className="w-full rounded-xl border px-3 py-2" rows="3" placeholder="Contoh: datang jam 7 malam" />
        </div>
        <Button className="btn-primary w-full" type="submit">Kirim RSVP</Button>
      </form>
      {toast && <Toast {...toast} />}
      <div className="mt-6 text-sm text-gray-500">
        Data disimpan lokal di perangkatmu. Tenang, gak ada drama privasi.
      </div>
    </div>
  );
}
