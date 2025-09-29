
import { useState } from "react";

const IMAGES = ["/images/img1.jpg","/images/img2.jpg","/images/img3.jpg"];

export default function GalleryGrid() {
  const [active, setActive] = useState(null);
  const open = (src) => setActive(src);
  const close = () => setActive(null);

  return (
    <div className="container-narrow">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {IMAGES.map((src, i) => (
          <button key={i} onClick={()=>open(src)} className="relative group">
            <img src={src} alt={`Foto ${i+1}`} className="w-full aspect-square object-cover rounded-xl shadow group-hover:opacity-90" />
            <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-purple-400 transition"></div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center p-4 z-50" onClick={close}>
          <img src={active} className="max-h-[80vh] rounded-xl shadow-xl" />
        </div>
      )}
    </div>
  );
}
