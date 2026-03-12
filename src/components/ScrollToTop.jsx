import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Using instant to avoid seeing the previous page's scroll position
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
