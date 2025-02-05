import { Link, useLocation } from "react-router-dom";
import { MENU_ITEMS } from "../../constants/manager";
import logo from "../../assets/SP_logo.png";

const Sidebar = () => {
  const location = useLocation();
  const isActiveMenu = (path: string) =>
    location.pathname === path || location.pathname.includes(path);

  return (
    <div className="fixed h-screen w-64 bg-white shadow-md">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <img src={logo} alt="로고" className="mb-8 h-8" />
          </div>
          <nav>
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
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <button className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              로그아웃
            </button>
            <button className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              내 계정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
