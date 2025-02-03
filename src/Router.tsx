import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";
import Signup from "./pages/admin/Signup";
import StudentPage from "./pages/manager/StudentPage";
import ShuttlePage from "./pages/manager/ShuttlePage";
import VehiclePage from "./pages/manager/VehiclePage";

const Router: React.FC = () => {
  return (
    <Routes>
      {/* 공통 라우트 */}
      <Route path="/" element={<Main />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* 관리자 라우트 */}
      <Route path="/admin">
        <Route path="students" element={<StudentPage />} />
        <Route path="shuttles" element={<ShuttlePage />} />
        <Route path="vehicles" element={<VehiclePage />} />
      </Route>
    </Routes>
  );
};

export default Router;
