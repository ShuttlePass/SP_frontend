import Header from "@/components/Header";
import banner from "../../assets/img/banner_main.jpeg";
import Footer from "@/components/common/Footer";
import ScrollDown from "@/components/common/ScrollDown";

const Main = () => {
  return (
    <div>
      <Header />
      <div className="">
        <img
          className="w-full max-h-[600px] sm:max-h-[400px] md:max-h-[450px] lg:max-h-[600px] object-cover"
          src={banner}
          alt="intro"
        />
      </div>
      <div className="flex flex-col p-52 items-center justify-center">
        <p className="font-bold text-4xl sm:text-3xl md:text-4xl leading-[1.6] text-center mb-[50px] min-w-[350px]">
          면허 학원 셔틀 관리의 편리함과 누락을 줄이고, 실시간 현황을
          확인하세요.
        </p>
        <ScrollDown />
      </div>
      <div className="flex flex-col bg-gray-50 p-52 items-end"></div>
      <Footer />
    </div>
  );
};

export default Main;
