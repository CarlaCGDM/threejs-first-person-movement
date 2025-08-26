import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio;
      const ua = navigator.userAgent;
      const isUAStringMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

      const isPortrait = height > width;
      const isMobileByScreen = width <= 820 || (isPortrait && dpr >= 2);

      const result = isUAStringMobile || isMobileByScreen;

      setIsMobile(result);

      console.log("Mobile detection", {
        ua,
        width,
        height,
        dpr,
        isUAStringMobile,
        isPortrait,
        isMobile: result
      });
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
