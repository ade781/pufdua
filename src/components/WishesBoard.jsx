
import { useEffect, useState } from "react";
import Button from "./Button";
import Toast from "./Toast";
import { storage } from "../utils/storage";

export default function WishesBoard() {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setWishes(storage.getWishes());
  }, []);

  const add = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setToast({ type: "error", message: "Isi nama dan ucapan." });
      return;
    }
    const item = { name, text, likes: 0, ts: Date.now() };
    const cur = storage.addWish(item);
    setWishes(cur);
    setName(""); setText("");
    setToast({ type: "success", message: "Ucapan terkirim. Manis sekali." });
  };

  const like = (i) => {
    const cur = storage.likeWish(i);
    setWishes(cur);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-xl mx-auto">
        <p className="badge mb-3">Kirim Ucapan</p>
        <form onSubmit={add} className="space-y-3">
          <input className="w-full rounded-xl border px-3 py-2" placeholder="Namamu"
            value={name} onChange={(e)=>setName(e.target.value)} />
          <textarea className="w-full rounded-xl border px-3 py-2" rows="3" placeholder="Tulis ucapan terbaikmu..."
            value={text} onChange={(e)=>setText(e.target.value)} />
          <Button className="btn-primary w-full" type="submit">Kirim</Button>
        </form>
      </div>

      <div className="container-narrow">
        <h3 className="font-bold mb-3">Ucapan Terbaru</h3>
        <div className="grid gap-3">
          {wishes.length === 0 && <p className="text-gray-500">Belum ada ucapan. Jangan pelit kata-kata.</p>}
          {wishes.map((w, i) => (
            <div key={i} className="card p-4 flex justify-between items-start">
              <div>
                <div className="font-semibold">{w.name}</div>
                <div className="text-gray-600 text-sm">{new Date(w.ts).toLocaleString("id-ID")}</div>
                <p className="mt-2">{w.text}</p>
              </div>
              <Button className="btn-ghost" onClick={()=>like(i)}>❤️ {w.likes || 0}</Button>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast {...toast} />}
    </div>
  );
}
