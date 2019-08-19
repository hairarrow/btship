import { useState, useEffect } from "react";
import { sizes } from "../styles/breakpoints";

export default function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize(): { [k: string]: number | boolean | undefined } {
    const width = window.innerWidth || undefined;
    const height = window.innerHeight || undefined;
    const isLandscape = width && height && height > width;
    const size = Object.entries(sizes).reduce<{ [k: string]: boolean }>(
      (a, [k, v]) => {
        const key = `is${k.charAt(0).toUpperCase()}${k.slice(1)}`;
        const val = width ? width < v : false;
        a[key] = val;
        return a;
      },
      {}
    );

    return {
      width,
      height,
      isLandscape,
      ...size
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) return;

    function handleResize() {
      setWindowSize(getSize());
    }

    function cleanUp() {
      window.removeEventListener("resize", handleResize);
    }

    window.addEventListener("resize", handleResize);

    return cleanUp;
  }, [isClient]);

  return windowSize;
}
