import React from "react";
import FullScreenContainer from "../../components/container/FullScreenContainer";
import Header from "../../components/Header";

const Main = () => {
  return (
    <FullScreenContainer>
      <Header />
      <div className="w-full h-[691px] bg-primary"></div>
    </FullScreenContainer>
  );
};

export default Main;
