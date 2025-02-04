import React from "react";

interface FullScreenContainerProps {
  children: React.ReactNode;
}

const FullScreenContainer: React.FC<FullScreenContainerProps> = ({
  children,
}) => {
  return (
    <div className="w-[1920px] h-[1080px] flex flex-col bg-white">
      {children}
    </div>
  );
};

export default FullScreenContainer;
