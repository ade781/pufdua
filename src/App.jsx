
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RSVP from "./pages/RSVP";
import Galeri from "./pages/Galeri";
import Ucapan from "./pages/Ucapan";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/ucapan" element={<Ucapan />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
