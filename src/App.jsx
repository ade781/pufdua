import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RSVP from "./pages/RSVP";
import Galeri from "./pages/Galeri";
import Ucapan from "./pages/Ucapan";
import CoverPage from "./components/CoverPage";
import { useUrlParam } from "./utils/hooks";

// Komponen Pembungkus untuk mengelola state CoverPage dan URL Param
function MainContent() {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const guestName = useUrlParam("to");

  // Jika user langsung mengakses path selain root, paksa buka cover
  useEffect(() => {
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      setIsCoverOpen(true);
    }
  }, []);

  const handleOpen = () => {
    setIsCoverOpen(true);
  };

  if (!isCoverOpen) {
    // Tampilkan CoverPage jika belum dibuka
    return <CoverPage onOpen={handleOpen} guestName={guestName} />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Melewatkan guestName ke Home */}
        <Route path="/" element={<Home guestName={guestName} />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/ucapan" element={<Ucapan />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Menggunakan MainContent sebagai pembungkus aplikasi */}
      <MainContent />
    </BrowserRouter>
  );
}