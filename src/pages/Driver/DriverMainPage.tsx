import Header from "../../components/Driver/Header";
import { Link } from "react-router-dom";

const DriverMainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <Header />

      <main className="text-center">
        <p className="mt-24 text-gray-500 font-bold text-lg mb-6">
          기사님, 오늘도 안전운행 하세요!
        </p>
        <div className="mt-16 flex space-x-6">
          <div className="mt-16 flex flex-wrap justify-center gap-6 md:space-x-6">
            <div className="bg-blue-500 text-white rounded-lg w-72 h-56 md:w-80 md:h-64 flex flex-col items-center justify-center hover:scale-105 transition">
              <h2 className="text-2xl md:text-4xl font-semibold">
                운영 시간표
              </h2>
              <Link
                to="DriverSchedulePage"
                className="mt-4 text-sm md:text-base"
              >
                바로가기 &gt;&gt;
              </Link>
            </div>
            <div className="bg-yellow-400 text-white rounded-lg w-72 h-56 md:w-80 md:h-64 flex flex-col items-center justify-center hover:scale-105 transition">
              <h2 className="text-2xl md:text-4xl font-semibold">출석 체크</h2>
              <Link
                to="AttendanceCheckPage"
                className="mt-4 text-sm md:text-base"
              >
                바로가기 &gt;&gt;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverMainPage;
