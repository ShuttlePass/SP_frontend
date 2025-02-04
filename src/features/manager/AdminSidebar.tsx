import { Link, useLocation } from "react-router-dom";
import { MENU_ITEMS } from "@/constants/manager";
import logo from "@/assets/img/logo.png";
import AuthButton from "@/components/common/AuthButton";

const AdminSidebar = () => {
  const location = useLocation();
  const isActiveMenu = (path: string) =>
    location.pathname === path || location.pathname.includes(path);

  return (
    <aside className="min-h-screen w-[300px] border-r bg-white">
      <div className="p-4">
        <Link to="/admin">
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
          <AuthButton>로그아웃</AuthButton>
          <AuthButton>내 계정</AuthButton>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
