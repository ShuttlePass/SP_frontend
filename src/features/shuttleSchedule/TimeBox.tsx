import { Passenger } from "@/types/shuttle.types";

interface TimeBoxProps {
  time: string;
  passengers: Passenger[];
  isSelected?: boolean;
  onClick?: () => void;
}

export const TimeBox = ({
  time,
  passengers,
  isSelected = false,
  onClick,
}: TimeBoxProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex h-20 w-24 cursor-pointer flex-col items-center justify-center rounded-md border transition-colors ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"} `}
    >
      <span className="text-lg font-medium">{time}</span>
      <span className="text-base text-blue-600">{passengers.length}명</span>
    </div>
  );
};
