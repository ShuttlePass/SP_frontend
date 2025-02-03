import complete_logo1 from "../../assets/img/admin/service_provide.png";
import complete_logo2 from "../../assets/img/admin/complete_signup.png";
import logo from "../../assets/img/logo.png";
import FullScreenContainer from "@/components/container/FullScreenContainer";
import { useNavigate } from "react-router-dom";

const SignupComplete = () => {
  const navigate = useNavigate();
  return (
    <FullScreenContainer>
      <header className="w-full h-[100px] bg-white border-b border-gray-200 shadow-sm">
        <div className="mt-2 w-full mx-auto flex justify-between items-center py-4 px-6">
          <img src={logo} alt="셔틀패스 로고" className="h-10 cursor-pointer" />
        </div>
      </header>
      <div className="flex flex-col gap-14 w-full items-center justify-center mt-52">
        <img className="w-[570px]" src={complete_logo2} alt="complete_logo2" />
        <img className="w-[1070px]" src={complete_logo1} alt="complete_logo1" />
        <div className="w-full flex justify-center gap-7 mt-44">
          <button
            onClick={() => navigate("/")}
            className="w-1/6 text-white bg-primary hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5"
          >
            메인으로 돌아가기
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="w-1/6 text-white bg-primary hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5"
          >
            로그인 하러가기
          </button>
        </div>
      </div>
    </FullScreenContainer>
  );
};

export default SignupComplete;
