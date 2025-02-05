import React, { useState } from "react";
import { BusRoute } from "./schedule.types";
import { RouteRow } from "./RouteRow";
import { Link } from "react-router-dom";
import { SelectDateButton } from "@/components/common/SelectDateButton";
import Button from "@/components/common/Button";
import { ShuttleType } from "@/types/shuttle.types";

interface TimeTableProps {
  routes: BusRoute[];
  onTimeSlotClick?: (routeId: string, time: string) => void;
  selectedRoute?: string;
  selectedTime?: string;
  onDateChange?: (date: Date | null) => void;
  initialDate?: Date;
  shuttleType: ShuttleType;
  onScheduleTypeChange: (type: "pickup" | "dropoff") => void;
}

export const TimeTable: React.FC<TimeTableProps> = ({
  routes,
  onTimeSlotClick,
  selectedRoute,
  selectedTime,
  onDateChange,
  initialDate = new Date(),
  shuttleType,
  onScheduleTypeChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  return (
    <div className="flex">
      <div className="w-full rounded-lg bg-white shadow-md">
        <div className="rounded-t-lg border border-gray-300 bg-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <select
                title="등/하원"
                className="w-24 rounded-md border border-gray-300 px-3 py-2 text-center"
                value={shuttleType}
                onChange={(e) =>
                  onScheduleTypeChange(e.target.value as "pickup" | "dropoff")
                }
              >
                <option value="pickup">등원</option>
                <option value="dropoff">하원</option>
              </select>
            </div>
            <SelectDateButton
              selectedDate={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto rounded-b-lg bg-white p-2 shadow-sm">
          {routes.length > 0 ? (
            routes.map((route) => (
              <div key={route.id} className="mb-2">
                <RouteRow
                  routeName={route.carName}
                  timeSlots={route.timeSlots}
                  onTimeSlotClick={(time) => onTimeSlotClick?.(route.id, time)}
                  selectedTime={
                    selectedRoute === route.id ? selectedTime : undefined
                  }
                  className="overflow-x-auto"
                />
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <span className="mb-4">선택한 날짜에 등록된 셔틀이 없습니다.</span>
              <Button variant="primary" size="sm">
                <Link to="/admin/vehicles">바로가기</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
