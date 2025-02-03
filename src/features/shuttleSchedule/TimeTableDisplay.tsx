import { useState, useMemo } from "react";
import { TimeTable } from "./TimeTable.tsx";
import { MOCK_SCHEDULE_DATA } from "../../mocks/mockScheduleData.ts.ts";
import PassengerList from "./PassengerList.tsx";
import { ShuttleType } from "@/types/shuttle.types";

interface TimeTableDisplayProps {
  selectedDate: string;
  shuttleType: ShuttleType;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setShuttleType: React.Dispatch<React.SetStateAction<"pickup" | "dropoff">>;
}

export const TimeTableDisplay = ({
  selectedDate,
  shuttleType,
  setSelectedDate,
  setShuttleType,
}: TimeTableDisplayProps) => {
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [scheduleData, setScheduleData] = useState(MOCK_SCHEDULE_DATA);

  const formatDate = (date: Date): string => {
    const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // 9시간을 더해서 한국 시간으로 변환
    return localDate.toISOString().split("T")[0];
  };

  const availableRoutes = useMemo(() => {
    const dateKey = formatDate(new Date(selectedDate));
    return scheduleData[dateKey]?.[shuttleType] || [];
  }, [selectedDate, shuttleType, scheduleData]);

  const handleTimeSlotClick = (routeId: string, time: string) => {
    setSelectedRoute(routeId);
    setSelectedTime(time);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(formatDate(date));
      setSelectedRoute(undefined);
      setSelectedTime(undefined);
    }
  };

  const handlePassengerDelete = (passengerName: string) => {
    const dateKey = formatDate(new Date(selectedDate));
    const updatedData = { ...scheduleData };

    if (
      !selectedRoute ||
      !selectedTime ||
      !updatedData[dateKey]?.[shuttleType]
    ) {
      return;
    }

    const routes = updatedData[dateKey][shuttleType];
    const route = routes.find((r) => r.id === selectedRoute);

    if (!route || !route.timeSlots) {
      return;
    }

    const timeSlot = route.timeSlots.find((t) => t.time === selectedTime);

    if (!timeSlot || !timeSlot.passengers) {
      return;
    }

    timeSlot.passengers = timeSlot.passengers.filter(
      (p) => p.name !== passengerName,
    );

    setScheduleData(updatedData);
  };

  return (
    <div>
      <TimeTable
        routes={availableRoutes}
        onTimeSlotClick={handleTimeSlotClick}
        selectedRoute={selectedRoute}
        selectedTime={selectedTime}
        onDateChange={handleDateChange}
        initialDate={new Date(selectedDate)}
        shuttleType={shuttleType}
        onScheduleTypeChange={(type) => setShuttleType(type)}
      />

      <PassengerList
        selectedDate={selectedDate}
        shuttleType={shuttleType}
        selectedRoute={selectedRoute}
        selectedTime={selectedTime}
        onPassengerDelete={handlePassengerDelete}
      />
    </div>
  );
};
