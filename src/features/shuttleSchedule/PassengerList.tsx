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
                  className="absolute right-4 top-2 p-2 text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
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
