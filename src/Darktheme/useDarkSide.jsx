import { useEffect, useState } from "react";

export default function useDarkSide() {
  const [theme, setTheme] = useState(() => {
    // Safely check localStorage for the theme only on the client
    if (typeof window !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return "light"; // Default theme
  });

  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove(colorTheme);
      root.classList.add(theme);

      // Save theme to local storage
      localStorage.setItem("theme", theme);
    }
  }, [theme, colorTheme]);

  return [colorTheme, setTheme];
}
