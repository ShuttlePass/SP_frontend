import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/img/logo.png";
import AuthButton from "../common/AuthButton";

export const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogOut = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  const getLogoLinkPath = (pathname: string) => {
    if (pathname.startsWith("/driver")) return "/driver";
    if (pathname.startsWith("/admin")) return "/admin";
    return "/";
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="mt-2 w-full mx-auto flex justify-between items-center py-4 px-6">
        <Link to={getLogoLinkPath(window.location.pathname)}>
          <img src={logo} alt="셔틀패스 로고" className="h-10 cursor-pointer" />
        </Link>
        <div className="flex space-x-3">
          {isLoggedIn ? (
            <>
              <Link to="/account">
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
