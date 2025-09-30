import React, { useState, useEffect } from "react";

// Komponen kecil untuk setiap satuan waktu (lebih rapi dan reusable)
const TimeUnit = ({ value, label, animate }) => (
  <div className="time-unit">
    <div className="time-value-wrapper">
      <div className="divider"></div>
      <span className={`time-value ${animate ? 'tick' : ''}`}>{String(value).padStart(2, '0')}</span>
    </div>
    <span className="time-label">{label}</span>
  </div>
);

const Countdown = ({ targetDate = "2025-10-08T00:00:00+07:00" }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isTimeUp, setIsTimeUp] = useState(Object.keys(timeLeft).length === 0);

  useEffect(() => {
    // Menggunakan setInterval untuk efisiensi, dan membersihkannya saat komponen di-unmount
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (Object.keys(newTimeLeft).length === 0) {
        setIsTimeUp(true);
        clearInterval(timer); // Hentikan timer jika waktu sudah habis
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Dependensi kosong agar useEffect hanya berjalan sekali saat mount

  return (
    <div className="countdown-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Mono:wght@700&display=swap');

        .countdown-container {
          padding: 1.5rem 2rem;
          border: 2px solid rgba(255, 51, 85, 0.2);
          border-radius: 16px;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(8px);
          font-family: 'Bebas Neue', sans-serif;
          text-align: center;
          box-shadow: 0 0 30px rgba(255, 0, 0, .25), inset 0 0 20px rgba(0, 0, 0, .8);
          position: relative;
          overflow: hidden;
        }

        /* EFEK SCANLINE BARU */
        .countdown-container::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255, 51, 85, 0.7);
          box-shadow: 0 0 10px rgba(255, 51, 85, 1);
          animation: scanline 4s linear infinite;
        }

        @keyframes scanline {
          0% { top: 0; }
          50% { top: calc(100% - 3px); }
          100% { top: 0; }
        }

        .countdown-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          color: #ff3355;
          text-shadow: 0 0 8px rgba(255,51,85,.8);
          letter-spacing: 0.1em;
          font-weight: 400;
        }
        
        .timer-display {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .time-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .time-value-wrapper {
          position: relative;
          background: linear-gradient(180deg, #1a1a1f, #0a0a0f);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
          padding: 0.5rem 0;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }

        .divider {
          position: absolute;
          width: 100%;
          height: 1px;
          background: rgba(0,0,0,0.5);
          top: 50%;
          transform: translateY(-50%);
          box-shadow: 0 1px 0 rgba(255,255,255,0.05);
        }

        .time-value {
          font-size: 3.5rem;
          color: #f6c945;
          text-shadow: 0 0 6px rgba(246,201,69,.6), 0 0 16px rgba(246,201,69,.4);
          line-height: 1;
          position: relative;
          transition: transform 0.2s ease-out;
        }

        /* ANIMASI ANGKA BARU */
        @keyframes tick-animation {
          0% { transform: translateY(0); opacity: 1; }
          40% { transform: translateY(-5px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .time-value.tick {
          animation: tick-animation 0.5s ease-out;
        }


        .time-label {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: rgba(255, 51, 85, 0.8);
          letter-spacing: 0.1em;
        }

        .finished-message {
          font-size: 2.5rem;
          color: #f6c945;
          text-shadow: 0 0 15px #f6c945;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

      `}</style>

      <h3 className="countdown-title">
        🎩 Hitung Mundur Perayaan FIKA 🎩
      </h3>

      {isTimeUp ? (
        <div className="finished-message">
          <span>💥 THE WAIT IS OVER! 💥</span>
        </div>
      ) : (
        <div className="timer-display">
          <TimeUnit value={timeLeft.days} label="Hari" />
          <TimeUnit value={timeLeft.hours} label="Jam" />
          <TimeUnit value={timeLeft.minutes} label="Menit" />
          {/* Tambahkan prop 'animate' hanya pada detik untuk efek tick */}
          <TimeUnit value={timeLeft.seconds} label="Detik" animate={true} />
        </div>
      )}
    </div>
  );
};

export default Countdown;