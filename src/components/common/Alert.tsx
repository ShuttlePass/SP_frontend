import { useEffect } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

const Alert = ({ message, type, onClose, duration = 2000 }: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transform">
      <div
        className={`rounded-lg px-6 py-3 shadow-lg ${
          type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default Alert; 