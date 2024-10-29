"use client";
import { useEffect, useState } from "react";

interface NotificationPopupProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  styles?: string;
}

const NotificationPopup = ({
  message,
  isVisible,
  onClose,
  duration = 2000,
  styles = "",
}: NotificationPopupProps) => {
  const [lineWidth, setLineWidth] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setLineWidth(100);
      const interval = setInterval(() => {
        setLineWidth((prev) => Math.max(prev - 100 / (duration / 20), 0));
      }, 20);
      const timeout = setTimeout(onClose, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`flex flex-col ${styles} absolute top-2 right-8 p-2 rounded-lg animate-fade-left`}
    >
      {message}
      <span
        style={{
          borderBottom: "3px solid white",
          width: `${lineWidth}%`,
          height: "3px",
          transition: "width 0.02s linear",
        }}
      ></span>
    </div>
  );
};

export default NotificationPopup;
