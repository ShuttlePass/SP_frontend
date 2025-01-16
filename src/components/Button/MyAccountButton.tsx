import { useNavigate } from "react-router-dom";

const MyAccountButton = () => {
  const navigate = useNavigate();

  const handleMyPage = () => {
    navigate("/MyAccount");
  };
  return (
    <button
      className="text-xs text-gray-600 border border-gray-300 rounded-lg px-2 py-1 shadow-sm hover:bg-gray-100"
      onClick={handleMyPage}
    >
      내 계정
    </button>
  );
};

export default MyAccountButton;
