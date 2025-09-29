
import Countdown from "../components/Countdown";
import AudioPlayer from "../components/AudioPlayer";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="container-narrow pt-10 pb-8 text-center">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1 card p-6 animate-floaty">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Ulang Tahun Mas</h1>
            <p className="text-gray-600 mb-4">Kamu diundang. Jangan pura-pura lupa.</p>
            <div className="flex gap-2 justify-center">
              <Link to="/rsvp" className="btn-primary">Isi RSVP</Link>
              <Link to="/galeri" className="btn-ghost">Lihat Galeri</Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img src="/images/cover.jpg" alt="Sampul" className="w-full rounded-2xl shadow-xl" />
          </div>
        </div>

        <div className="container-narrow my-6 p-6 card">
          <div className="text-3xl font-extrabold text-purple-600">Tailwind v4 hidup 🎉</div>
          <p className="mt-2 text-gray-600">Kalau ini ungu dan kotaknya rounded + shadow, kamu berhasil.</p>
          <button className="btn-primary mt-4">Tombol Tes</button>
        </div>

      </section>

      <section className="container-narrow">
        <Countdown />
      </section>

      <AudioPlayer />
    </div>
  );
}
