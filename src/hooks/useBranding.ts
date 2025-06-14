
import { useState, useEffect } from "react";

export type BrandingConfig = {
  appName: string;
  primaryColor: string; // tailwind color string, e.g. "#0066ff"
};

const DEFAULTS: BrandingConfig = {
  appName: "Hi-Tech Soluções",
  primaryColor: "#2563eb", // azul padrão do tailwind: blue-600
};

export function useBranding() {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULTS);

  useEffect(() => {
    const raw = localStorage.getItem("brandingConfig");
    if (raw) {
      try {
        setBranding({ ...DEFAULTS, ...JSON.parse(raw) });
      } catch {
        setBranding(DEFAULTS);
      }
    }
  }, []);

  const saveBranding = (data: BrandingConfig) => {
    setBranding(data);
    localStorage.setItem("brandingConfig", JSON.stringify(data));
    // atualiza css variable
    document.documentElement.style.setProperty('--primary', hexToHsl(data.primaryColor));
  };

  // Atualiza sempre que muda
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', hexToHsl(branding.primaryColor));
  }, [branding.primaryColor]);

  return {
    branding,
    saveBranding,
  };
}

// Converte hex para hsl string — Tailwind espera string "210 100% 50%" etc
function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h:any, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d) + (g < b ? 6 : 0); break;
      case g: h = ((b - r) / d) + 2; break;
      case b: h = ((r - g) / d) + 4; break;
    }
    h /= 6;
  }
  h = Math.round(360 * h);
  s = Math.round(100 * (s ?? 0));
  l = Math.round(100 * l);
  return `${h} ${s}% ${l}%`;
}
