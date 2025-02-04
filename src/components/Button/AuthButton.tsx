import { ReactNode } from "react";

interface AuthButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const AuthButton = ({ children, onClick }: AuthButtonProps) => {
  return (
    <button
      className="text-xs text-gray-600 border border-gray-300 rounded-lg px-2 py-1 shadow-sm hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AuthButton;
