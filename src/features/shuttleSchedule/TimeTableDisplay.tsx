import { useState, useMemo, useEffect } from "react";
import { TimeTable } from "./TimeTable";
import PassengerList from "./PassengerList";
import { ShuttleType } from "@/types/shuttle.types";
import { ShuttleApiResponse, ShuttleData } from "./api.types";
import { BusRoute } from "./schedule.types";

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
  const [shuttleData, setShuttleData] = useState<ShuttleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // API 호출 함수
  const fetchShuttleData = async (date: string, type: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("토큰이 없습니다.");
        return;
      }

      // 날짜 형식을 'YYYY-MM-DD' 형식으로 변환
      const formattedDate = new Date(date).toISOString().split("T")[0];

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/shuttle?date=${formattedDate}&st_type=${type}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("인증이 만료되었습니다. 다시 로그인해주세요.");
          // 로그인 페이지로 리다이렉트하는 로직 추가 가능
          // navigate('/signin');
        }
        throw new Error("Network response was not ok");
      }

      const data: ShuttleApiResponse = await response.json();
      if (data.code === 1) {
        setShuttleData(data.data);
      }
    } catch (error) {
      console.error("셔틀 데이터 로딩 실패:", error);
      setShuttleData([]); // 에러 시 빈 배열로 초기화
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터 변환 함수
  const convertToRoutes = (shuttleData: ShuttleData[]): BusRoute[] => {
    return shuttleData
      .filter((shuttle) => shuttle.sh_state === 1 || shuttle.sh_state === 2)
      .map((shuttle) => ({
        id: shuttle.sh_idx.toString(),
        carName: shuttle.sh_name,
        timeSlots: shuttle.times
          .filter((time) =>
            shuttleType === "pickup" ? time.st_type === 1 : time.st_type === 2,
          )
          .sort((a, b) => {
            // 시간 문자열을 비교하여 오름차순 정렬 (이른 시간이 먼저 오도록)
            const timeA = a.st_time.substring(0, 5);
            const timeB = b.st_time.substring(0, 5);
            return timeA.localeCompare(timeB);
          })
          .map((time) => ({
            time: time.st_time.substring(0, 5),
            passengers: [], // 필요한 경우 승객 데이터 추가
          })),
      }));
  };

  // 날짜나 셔틀 타입이 변경될 때마다 데이터 fetch
  useEffect(() => {
    const stType = shuttleType === "pickup" ? 1 : 2;
    fetchShuttleData(selectedDate, stType);
  }, [selectedDate, shuttleType]);

  const availableRoutes = useMemo(() => {
    return convertToRoutes(shuttleData);
  }, [shuttleData, shuttleType]);

  const handleTimeSlotClick = (routeId: string, time: string) => {
    setSelectedRoute(routeId);
    setSelectedTime(time);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setSelectedDate(formattedDate);
      setSelectedRoute(undefined);
      setSelectedTime(undefined);
    }
  };

  // PassengerList 관련 핸들러 임시 제거 (나중에 API 연동 시 다시 구현)
  const handlePassengerDelete = (passengerName: string) => {
    // TODO: API 연동 후 구현
    console.log("승객 삭제:", passengerName);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">로딩 중...</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
