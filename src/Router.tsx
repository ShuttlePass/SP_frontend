import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";
import Signup from "./pages/admin/Signup";
import SignupComplete from "./pages/admin/SignupComplete";
import SignIn from "./pages/admin/SignIn";
import { Schedule } from "./pages/Driver/Schedule";
import StudentPage from "./pages/manager/StudentPage";
import ShuttlePage from "./pages/manager/ShuttlePage";
import VehiclePage from "./pages/manager/VehiclePage";

const Router: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-complete" element={<SignupComplete />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/driver/schedule" element={<Schedule />} />
        <Route path="/admin/students" element={<StudentPage />} />
        <Route path="/admin/shuttles" element={<ShuttlePage />} />
        <Route path="/admin/vehicles" element={<VehiclePage />} />
      </Routes>
    </>
  );
};

export default Router;
