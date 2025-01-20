import FullScreenContainer from "../../components/container/FullScreenContainer";
import Header from "../../components/Header";
import android from "../../assets/img/admin/android_admin_main.png";
import intro from "../../assets/img/admin/intro_main.png";

const Main = () => {
  return (
    <FullScreenContainer>
      <Header />
      <div className="w-full h-[691px] bg-primary relative">
        <img className="absolute top-60 left-20" src={intro} alt="intro" />
        <img
          className="h-[858px] w-[410px] absolute right-[300px] top-20"
          src={android}
          alt="android-main"
        />
      </div>
    </FullScreenContainer>
  );
};

export default Main;
