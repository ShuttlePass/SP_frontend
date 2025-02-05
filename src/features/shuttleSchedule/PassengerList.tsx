import { useEffect, useState } from "react";
import { ShuttleReservation } from "./api.types";

interface PassengerListProps {
  selectedDate: string;
  selectedShuttleIdx?: number;
  selectedTimeIdx?: number;
  onPassengerDelete: (studentIdx: number) => void;
}

const PassengerList = ({
  selectedDate,
  selectedShuttleIdx,
  selectedTimeIdx,
  onPassengerDelete,
}: PassengerListProps) => {
  const [passengers, setPassengers] = useState<ShuttleReservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPassengers = async () => {
    if (!selectedShuttleIdx || !selectedTimeIdx) return;

    setIsLoading(true);
    try {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/shuttle/reservation/student?date=${formattedDate}&shuttle_idx=${selectedShuttleIdx}&shuttle_time_idx=${selectedTimeIdx}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Response status:", response.status);
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error(errorData.message || "서버에러");
      }

      const data = await response.json();
      if (data.code === 1) {
        setPassengers(data.data.data);
      }
    } catch (error) {
      console.error("탑승자 목록 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, [selectedDate, selectedShuttleIdx, selectedTimeIdx]);

  return (
    <div className="flex flex-col">
      <div className="mt-4 text-2xl font-bold">탑승자 명단</div>
      <div className="mt-2 h-96 w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-md">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            로딩 중...
          </div>
        ) : passengers.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            탑승자 명단이 없습니다.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 border-b p-4 font-medium text-gray-600">
              <div className="border-r px-4 text-center">이름</div>
              <div className="border-r px-4 text-center">연락처</div>
              <div className="border-r px-4 text-center">탑승 지역</div>
              <div className="px-4 text-center">예약 시간</div>
            </div>
            <ul>
              {passengers.map((passenger) => (
                <li
                  key={passenger.student_idx}
                  className="grid grid-cols-4 gap-4 border-b p-4"
                >
                  <div className="px-4 text-center">{passenger.st_name}</div>
                  <div className="px-4 text-center">{passenger.st_contact}</div>
                  <div className="px-4 text-center">{passenger.sr_address}</div>
                  <div className="px-4 text-center">
                    {passenger.st_time.substring(0, 5)}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default PassengerList;
