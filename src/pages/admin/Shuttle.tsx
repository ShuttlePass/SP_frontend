import AdminSidebar from "@/features/manager/AdminSidebar";
import { TimeTableDisplay } from "@/features/shuttleSchedule/TimeTableDisplay";
import { useState } from "react";

export const Shuttle = () => {
  const [selectedDate, setSelectedDate] = useState<string>(String(new Date()));
  const [shuttleType, setShuttleType] = useState<"pickup" | "dropoff">(
    "pickup",
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex flex-auto flex-col">
        <div className="ml-28 mt-14 flex w-full max-w-[1200px] items-start gap-4">
          <div className="min-w-[500px] flex-1">
            <TimeTableDisplay
              selectedDate={selectedDate}
              shuttleType={shuttleType}
              setSelectedDate={setSelectedDate}
              setShuttleType={setShuttleType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shuttle;
