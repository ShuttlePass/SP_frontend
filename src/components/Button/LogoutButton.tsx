import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <button
      className="text-xs text-gray-600 border border-gray-300 rounded-lg px-2 py-1 shadow-sm hover:bg-gray-100"
      onClick={handleLogout}
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;
