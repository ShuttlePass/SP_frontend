import { TimeSlot } from "./schedule.types";
import { TimeBox } from "./TimeBox";

interface RouteRowProps {
  routeName: string;
  timeSlots: TimeSlot[];
  selectedTime?: string;
  onTimeSlotClick?: (time: string) => void;
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
            <TimeBox
              key={slot.time}
              time={slot.time}
              isSelected={selectedTime === slot.time}
              onClick={() => onTimeSlotClick?.(slot.time)}
              passengers={slot.passengers}
              passengerCount={slot.passengerCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
