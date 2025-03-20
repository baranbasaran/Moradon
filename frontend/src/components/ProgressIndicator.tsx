import React, { useEffect, useState } from "react";

interface ProgressIndicatorProps {
  isLoading: boolean;
  duration?: number;
  color?: string | string[];
  height?: string;
  position?: "absolute" | "fixed" | "relative" | "static" | "sticky";
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isLoading,
  duration = 600,
  color = ["#1d9bf0", "#1a8cd8"],
  height = "2px",
  position = "absolute",
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isLoading) {
      setIsVisible(true);
      setProgress(0);

      // Quick initial progress
      progressTimer = setTimeout(() => {
        setProgress(70);
      }, 50);
    } else if (isVisible) {
      // Complete the progress
      setProgress(100);

      // Hide after animation
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }

    return () => {
      if (progressTimer) clearTimeout(progressTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isLoading, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        position,
        height,
      }}
    >
      <div
        className="h-full transition-all duration-400 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition:
            progress === 100
              ? "all 200ms ease-out"
              : "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          background: Array.isArray(color)
            ? `linear-gradient(to right, ${color.join(", ")})`
            : `linear-gradient(to right, ${color}, ${color})`,
        }}
      />
    </div>
  );
};

export default ProgressIndicator;
