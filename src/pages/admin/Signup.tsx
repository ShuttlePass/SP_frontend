import FullScreenContainer from "../../components/container/FullScreenContainer";
import logo from "../../assets/img/logo.png";

const Signup = () => {
  return (
    <FullScreenContainer>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="mt-2 w-full mx-auto flex justify-between items-center py-4 px-6">
          <img src={logo} alt="셔틀패스 로고" className="h-10 cursor-pointer" />
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 sm:p-8">
              <h1 className="text-xl font-bold leading-tight text-black">
                회원가입
              </h1>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    이름
                  </label>
                  <input
                    placeholder="이름을 입력해주세요."
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    회사명
                  </label>
                  <input
                    placeholder="회사명을 입력해주세요."
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userId"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    아이디
                  </label>
                  <input
                    placeholder="아이디를 입력해주세요."
                    type="email"
                    name="userId"
                    id="userId"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    비밀번호
                  </label>
                  <input
                    placeholder="비밀번호를 입력해주세요."
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    비밀번호 (확인)
                  </label>
                  <input
                    placeholder="비밀번호 한 번 더 입력해주세요."
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    연락처
                  </label>
                  <input
                    placeholder="010.xxxx.xxxx"
                    type="number"
                    name="name"
                    id="name"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-black">
                    * 가입 대상 여부를 선택해주세요 (필수)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="role"
                        value="admin"
                        className="mr-2"
                      />
                      관리자
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="role"
                        value="driver"
                        className="mr-2"
                      />
                      기사
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5"
                >
                  회원가입 완료
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
    </FullScreenContainer>
  );
};

export default Signup;
