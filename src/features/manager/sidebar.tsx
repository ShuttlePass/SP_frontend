import { Link, useLocation } from "react-router-dom";
import { MENU_ITEMS } from "../../constants/manager";
import logo from "../../assets/SP_logo.png";

const AdminSidebar = () => {
  const location = useLocation();
  const isActiveMenu = (path: string) =>
    location.pathname === path || location.pathname.includes(path);

  return (
    <aside className="w-[300px] min-h-screen bg-white border-r">
      <div className="p-4">
        <Link to="/admin">
          <img src={logo} alt="셔틀패스" className="h-12 mx-auto" />
        </Link>
      </div>
      <nav className="mt-8">
        <ul className="space-y-3">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block text-center py-2 font-semibold ${
                  isActiveMenu(item.path)
                    ? "text-blue-500 font-bold"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-[300px] p-4 border-t">
        <div className="flex justify-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
            로그아웃
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
            내 계정
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
