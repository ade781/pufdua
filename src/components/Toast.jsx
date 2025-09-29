
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", showFor = 2000 }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), showFor);
    return () => clearTimeout(t);
  }, [showFor]);
  if (!visible) return null;
  const color = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 text-white ${color} px-4 py-2 rounded-xl shadow-lg`}>
      {message}
    </div>
  );
}
