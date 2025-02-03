import { TimeSlot } from "./schedule.types";
import { TimeBox } from "./TimeBox";

interface RouteRowProps {
  routeName: string;
  timeSlots: TimeSlot[];
  onTimeSlotClick?: (time: string) => void;
  selectedTime?: string;
}

export const RouteRow = ({
  routeName,
  timeSlots,
  onTimeSlotClick,
  selectedTime,
}: RouteRowProps) => {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      <div className="ml-10 w-20 font-bold">{routeName}</div>
      <div className="flex flex-1 gap-6">
        {timeSlots.map((slot) => (
          <TimeBox
            key={slot.time}
            time={slot.time}
            passengers={slot.passengers ?? []}
            isSelected={selectedTime === slot.time}
            onClick={() => onTimeSlotClick?.(slot.time)}
          />
        ))}
      </div>
    </div>
  );
};
