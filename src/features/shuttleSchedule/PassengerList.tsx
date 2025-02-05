import { MOCK_SCHEDULE_DATA } from "@/mocks/mockScheduleData.ts";
import { ShuttleType } from "@/types/shuttle.types";

interface PassengerListProps {
  selectedDate: string;
  selectedRoute: string | undefined;
  selectedTime: string | undefined;
  shuttleType: ShuttleType;
  onPassengerDelete: (passengerName: string) => void;
}

const PassengerList = ({
  selectedDate,
  shuttleType,
  selectedRoute,
  selectedTime,
  onPassengerDelete,
}: PassengerListProps) => {
  const routes = MOCK_SCHEDULE_DATA[selectedDate]?.[shuttleType] || [];

  const selectedRouteData = routes.find((route) => route.id === selectedRoute);

  const selectedTimeSlot = selectedRouteData?.timeSlots.find(
    (timeSlot) => timeSlot.time === selectedTime,
  );

  const passengers = selectedTimeSlot?.passengers || [];

  return (
    <div className="flex flex-col">
      <div className="mt-4 text-2xl font-bold">탑승자 명단</div>
      <div className="mt-2 h-96 w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-md">
        {passengers.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            탑승자 명단이 없습니다.
          </div>
        ) : (
          <ul>
            {passengers.map((passenger, index) => (
              <li
                className="relative flex justify-around border p-4"
                key={index}
              >
                <div>{passenger.name}</div>
                <div>{passenger.contact}</div>
                <div>{passenger.address}</div>
                <div>{passenger.boardingLocation}</div>
                <button
                  onClick={() => onPassengerDelete(passenger.name)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`${passenger.name} 승객 삭제`}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PassengerList;
