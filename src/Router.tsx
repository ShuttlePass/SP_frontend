import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";
import Signup from "./pages/admin/Signup";
import StudentPage from "./pages/manager/StudentPage";
import ShuttlePage from "./pages/manager/ShuttlePage";
import VehiclePage from "./pages/manager/VehiclePage";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/students" element={<StudentPage />} />
      <Route path="/admin/shuttles" element={<ShuttlePage />} />
      <Route path="/admin/vehicles" element={<VehiclePage />} />
    </Routes>
  );
};

export default Router;
