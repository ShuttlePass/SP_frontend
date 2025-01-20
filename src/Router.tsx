import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";
import Signup from "./pages/admin/Signup";

const Router: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

export default Router;
