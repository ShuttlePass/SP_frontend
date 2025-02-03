import Header from "@/components/Header";
import Footer from "@/components/common/Footer";
import ShuttleSchedule from "@/features/ShuttleSchedule";

export const Schedule = () => {
  return (
    <div>
      <Header />
      <ShuttleSchedule carName="1호차" />
      <Footer />
    </div>
  );
};
