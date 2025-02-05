import AdminSidebar from "@/features/manager/AdminSidebar";
import { TimeTableDisplay } from "@/features/shuttleSchedule/TimeTableDisplay";
import { useState } from "react";

export const ShuttlePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [shuttleType, setShuttleType] = useState<"pickup" | "dropoff">(
    "pickup",
  );

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="mb-6 text-2xl font-bold">셔틀 관리</h1>
          <div className="flex gap-6">
            <div className="flex-1">
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
    </div>
  );
};

export default ShuttlePage;
