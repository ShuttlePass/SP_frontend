import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "@/constants/manager";
import logo from "@/assets/img/logo.png";
import AuthButton from "@/components/common/AuthButton";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveMenu = (path: string) =>
    location.pathname === path || location.pathname.includes(path);

  const handleLogout = () => {
    localStorage.clear();  // 모든 인증 관련 데이터 제거
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleMyAccount = () => {
    navigate("/admin/my-account");
  };

  return (
    <aside className="min-h-screen w-[300px] border-r bg-white">
      <div className="p-4">
        <Link to="/admin/students">
          <img src={logo} alt="셔틀패스" className="mx-auto h-12" />
        </Link>
      </div>
      <nav className="mt-8">
        <ul className="space-y-3">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block py-2 text-center font-semibold ${
                  isActiveMenu(item.path)
                    ? "font-bold text-blue-500"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-[300px] border-t p-4">
        <div className="flex justify-center gap-2">
          <AuthButton onClick={handleLogout}>로그아웃</AuthButton>
          <AuthButton onClick={handleMyAccount}>내 계정</AuthButton>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
