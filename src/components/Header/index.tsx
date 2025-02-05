import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import AuthButton from "../common/AuthButton";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const userLevel = localStorage.getItem("userLevel");

  const handleLogOut = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const getMyAccountPath = () => {
    switch (userLevel) {
      case "manager":
        return "/admin/my-account";
      case "driver":
        return "/driver/my-account";
      default:
        return "/my-account";
    }
  };

  // 현재 경로가 /driver로 시작하는지 확인
  const isDriverPage = location.pathname.startsWith("/driver");

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <img 
          src={logo} 
          alt="셔틀패스 로고" 
          className="h-10 cursor-pointer" 
          onClick={handleLogoClick}
        />
        <div className="flex space-x-3">
          {isLoggedIn || isDriverPage ? (
            <>
              <Link to={getMyAccountPath()}>
                <AuthButton>내 계정</AuthButton>
              </Link>
              <AuthButton onClick={handleLogOut}>로그아웃</AuthButton>
            </>
          ) : (
            <>
              <Link to="/signin">
                <AuthButton>로그인</AuthButton>
              </Link>
              <Link to="/signup">
                <AuthButton>회원가입</AuthButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
