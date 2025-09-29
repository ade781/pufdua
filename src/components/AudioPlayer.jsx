
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const onInteract = () => {
      if (!ready) {
        el.play().catch(() => {});
        setReady(true);
      }
    };
    window.addEventListener("click", onInteract, { once: true });
    return () => window.removeEventListener("click", onInteract);
  }, [ready]);

  return (
    <audio ref={ref} src="/audio/bgm.mp3" loop className="hidden" />
  );
}
