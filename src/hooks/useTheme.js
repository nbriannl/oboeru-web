import { useState, useEffect } from "react";

const THEME = {
  red: "#DC3545",
  blue: "#007BFF"
};

function setBrowserThemeColor(color) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", color);
}

export function useTheme() {
  const [isBlueTheme, setIsBlueTheme] = useState(false);

  useEffect(() => {
    setBrowserThemeColor(isBlueTheme ? THEME.blue : THEME.red);
  }, [isBlueTheme]);

  const themeColor = isBlueTheme ? "primary" : "danger";

  return { isBlueTheme, setIsBlueTheme, themeColor };
}
