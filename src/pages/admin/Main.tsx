import Header from "@/components/Header";
import banner from "../../assets/img/banner_main.png";
import Footer from "@/components/common/Footer";

const Main = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="mx-auto mt-8 flex max-w-7xl flex-grow items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-normal text-gray-700">
              운전 면허 학원을 운영중인 친구에게 고충을 듣게 되다
            </h2>
            <p className="text-xl font-bold text-gray-800">
              “셔틀을 기사 아저씨가 수기로 관리중인데, 가끔 누락 문제가 되는
              고충이 있어”
            </p>
            <p className="mt-1 text-base text-gray-700">
              그걸 수기로 하고있다니 누락이 될만도 하네..
            </p>
            <p className="text-base text-gray-700">
              셔틀 버스를 관리하는 웹사이트가 있으면 좋겠다!
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-600">
              셔틀패스는 운행 일정을 쉽게 관리하고, 기사님도 빠르게 확인할 수
              있어요.
            </p>
          </div>

          <div className="relative">
            <div className="absolute right-0 top-[-200px] hidden md:block">
              {" "}
              {/* md 이상일 때만 보이도록 설정 */}
              <img
                src={banner}
                alt="Banner"
                className="h-48 w-48 object-cover"
              />
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-500 p-1">
                  <svg
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">학생 정보 등록</h3>
              </div>
              <p className="mt-2 text-gray-600">
                학생 정보를 손쉽게 등록하고 관리하세요
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-500 p-1">
                  <svg
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">차량 정보 등록</h3>
              </div>
              <p className="mt-2 text-gray-600">
                차량 정보를 쉽게 등록하고 관리할 수 있어요{" "}
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-500 p-1">
                  <svg
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">셔틀 일정 관리</h3>
              </div>
              <p className="mt-2 text-gray-600">
                셔틀 운행 일정을 간편하게 관리하고 확인하세요
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
