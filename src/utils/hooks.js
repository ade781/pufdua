// src/utils/hooks.js
import { useMemo } from "react";

export function useUrlParam(key) {
    // Mengambil parameter dari URL
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
    const param = urlParams.get(key);
    // Mengembalikan parameter yang sudah dibersihkan (misalnya: Budi)
    return param;
}