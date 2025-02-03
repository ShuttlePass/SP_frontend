import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";
import Signup from "./pages/admin/Signup";
import SignupComplete from "./pages/admin/SignupComplete";
import SignIn from "./pages/admin/SignIn";
import { Schedule } from "./pages/driver/Schedule";

const Router: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-complete" element={<SignupComplete />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/driver/schedule" element={<Schedule />} />
      </Routes>
    </>
  );
};

export default Router;
