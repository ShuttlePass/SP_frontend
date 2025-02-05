import { TimeSlot } from "./schedule.types";
import { TimeBox } from "./TimeBox";

interface RouteRowProps {
  routeName: string;
  timeSlots: TimeSlot[];
  onTimeSlotClick?: (time: string) => void;
  selectedTime?: string;
  className?: string;
}

export const RouteRow = ({
  routeName,
  timeSlots,
  onTimeSlotClick,
  selectedTime,
  className,
}: RouteRowProps) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="mb-2 font-medium">{routeName}</div>
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => onTimeSlotClick?.(slot.time)}
              className={`w-24 rounded-lg border p-2 text-center transition-colors ${
                selectedTime === slot.time
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
