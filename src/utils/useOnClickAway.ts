import { MutableRefObject, useEffect } from "react";

// Custom hook to close an dynamic element(modal, input) when clic outside the element
export function useCloseOnClickAway(
  ref: MutableRefObject<null | HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
