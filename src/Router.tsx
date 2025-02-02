import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";
import Signup from "./pages/admin/Signup";
import SignupComplete from "./pages/admin/SignupComplete";
import SignIn from "./pages/admin/SignIn";

const Router: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-complete" element={<SignupComplete />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
};

export default Router;
