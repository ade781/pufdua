
import { Link, NavLink } from "react-router-dom";

const Item = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg ${isActive ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-white/70"}`
    }
  >
    {label}
  </NavLink>
);

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <nav className="container-narrow flex items-center justify-between h-14">
        <Link to="/" className="font-extrabold text-xl text-purple-700">🎉 UltahMas</Link>
        <div className="flex gap-2">
          <Item to="/" label="Home" />
          <Item to="/rsvp" label="RSVP" />
          <Item to="/galeri" label="Galeri" />
          <Item to="/ucapan" label="Ucapan" />
        </div>
      </nav>
    </header>
  );
}
