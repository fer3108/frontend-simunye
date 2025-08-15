import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ToastProps {
  message: string;
  variant?: "success" | "error";
  duration?: number; // en ms
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = "success",
  duration = 3000,
  onClose,
}) => {
  const color = variant === "success" ? "#4ade80" : "#ef4444";
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let elapsed = 0;
    const interval = 30;
    intervalRef.current = setInterval(() => {
      elapsed += interval;
      setProgress(100 - (elapsed / duration) * 100);
      if (elapsed >= duration) {
        clearInterval(intervalRef.current!);
      }
    }, interval);
    timeoutRef.current = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => {
      clearInterval(intervalRef.current!);
      clearTimeout(timeoutRef.current!);
    };
  }, [duration, onClose]);

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={`w-9/12 border flex flex-col items-center justify-center rounded-t-lg`}
        style={{ borderColor: `${color}` }}
      >
        <div
          className="w-full h-4 rounded-t-[3px]"
          style={{ background: `${color}` }}
        />
        <div className="flex items-center gap-3">
          <span style={{ color: `${color}` }}>
            {variant === "success" ? <CircleCheckIcon /> : <CircleAlertIcon />}
          </span>
          <span className="py-3 text-sm" style={{ color: `${color}` }}>
            {message}
          </span>
        </div>
        <div className="w-full mt-2">
          <div
            className="h-1 transition-all duration-300 ease-linear"
            style={{
              width: `${progress}%`,
              background: `${color}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
