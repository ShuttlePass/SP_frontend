import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import LogoutButton from "../Button/LogoutButton";
import MyAccountButton from "../Button/MyAccountButton";

const Header = () => {
  return (
    <header className="w-full bg-white">
      <div className="mt-2 max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/DriverMainPage">
          <img src={logo} alt="셔틀패스 로고" className="h-10"></img>
        </Link>
        <nav className="hidden sm:flex space-x-32">
          <Link
            to="/DriverSchedulePage"
            className="font-bold hover:text-blue-600"
          >
            {/* header 메뉴 바 추가 */}
          </Link>
          <Link
            to="/AttendanceCheckPage"
            className="font-bold hover:text-blue-600"
          >
            {/* header 메뉴 바 추가 */}
          </Link>
        </nav>
        <div className="flex space-x-3">
          <LogoutButton />
          <MyAccountButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
