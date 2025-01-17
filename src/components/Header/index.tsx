import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import AuthButton from "../Button/AuthButton";

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

const handleAuth = () => {
  console.log("");
};

const handleAccount = () => {
  console.log("");
};

const getLogoLinkPath = (pathname: string) => {
  if (pathname.startsWith("/driver")) return "/driver";
  if (pathname.startsWith("/admin")) return "/admin";
  return "/";
};

const getHeaderMenuItems = (pathname: string): MenuItem[] => {
  if (pathname.startsWith("/drive")) {
    return [
      { id: "schedule", label: "운영 시간표", path: "/driver/schedule" },
      { id: "attendance", label: "출석 체크", path: "/driver/attendance" },
    ];
  }
  return [
    { id: "about", label: "회사 소개", path: "/about" },
    { id: "service", label: "서비스 소개", path: "/service" },
  ];
};

const Header = () => {
  const location = useLocation();
  const menuItems = getHeaderMenuItems(location.pathname);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="mt-2 max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <Link to={getLogoLinkPath(location.pathname)}>
          <img src={logo} alt="셔틀패스 로고" className="h-10 cursor-pointer" />
        </Link>
        <nav className="hidden sm:flex space-x-32">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="font-bold hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex space-x-3">
          <AuthButton onClick={handleAuth}>로그인</AuthButton>
          <AuthButton onClick={handleAccount}>내 계정</AuthButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
