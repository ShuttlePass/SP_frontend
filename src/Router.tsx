import { Route, Routes } from "react-router-dom";
import Main from "./pages/admin/Main";

const Router: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
};

export default Router;
