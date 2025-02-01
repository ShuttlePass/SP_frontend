import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";
import Signup from "./pages/admin/Signup";
import SignupComplete from "./pages/admin/SignupComplete";

const Router: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-complete" element={<SignupComplete />} />
      </Routes>
    </>
  );
};

export default Router;
