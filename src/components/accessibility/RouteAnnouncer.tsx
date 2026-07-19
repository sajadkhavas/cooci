import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FALLBACK_TITLE = "وینیمی بیکری";

export const RouteAnnouncer = () => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const pageHeading = document.querySelector("main h1")?.textContent?.trim();
      const documentTitle = document.title.split("|")[0]?.trim();
      const title = pageHeading || documentTitle || FALLBACK_TITLE;

      setAnnouncement("");
      window.setTimeout(() => {
        setAnnouncement(`صفحه ${title} بارگذاری شد`);
      }, 20);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search]);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
};
