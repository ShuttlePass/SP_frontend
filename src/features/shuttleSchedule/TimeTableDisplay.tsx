import { useState, useMemo, useEffect } from "react";
import { TimeTable } from "./TimeTable";
import PassengerList from "./PassengerList";
import { StudentList } from "./StudentList";
import { ShuttleType } from "@/types/shuttle.types";
import AlertModal from "@/components/common/AlertModal";
import {
  ShuttleApiResponse,
  ShuttleData,
  ShuttleReservationRequest,
} from "./api.types";
import { BusRoute } from "./schedule.types";
import Alert from "@/components/common/Alert";

interface TimeTableDisplayProps {
  selectedDate: string;
  shuttleType: ShuttleType;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setShuttleType: React.Dispatch<React.SetStateAction<"pickup" | "dropoff">>;
}

// 셔틀 차량의 담당 지역 정보를 포함하도록 수정
interface ShuttleArea {
  sh_name: string;
  ar_name: string;
  area_idx: number;
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

  // 선택된 셔틀과 시간의 idx 값을 저장할 state 추가
  const [selectedShuttleIdx, setSelectedShuttleIdx] = useState<number>();
  const [selectedTimeIdx, setSelectedTimeIdx] = useState<number>();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [selectedShuttleAreas, setSelectedShuttleAreas] = useState<string[]>(
    [],
  );

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

  // 선택된 셔틀의 담당 지역 정보를 가져오는 함수
  const fetchShuttleAreas = async (shuttleIdx: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 먼저 모든 지역 정보를 가져옵니다
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/list/area?ar_name=`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Response status:", response.status);
        const errorData = await response.json();
        console.error("Error data:", errorData);
        setSelectedShuttleAreas([]);
        return;
      }

      const data = await response.json();
      console.log("Areas response:", data);

      if (data.code === 1) {
        // 선택된 셔틀의 지역만 필터링
        const selectedShuttle = shuttleData.find(
          (shuttle) => shuttle.sh_idx === shuttleIdx,
        );
        if (selectedShuttle) {
          // 해당 셔틀이 담당하는 지역 이름들을 설정
          const shuttleAreas = data.data
            .filter(
              (area: { ar_idx: number }) =>
                // 여기서 셔틀과 지역의 매칭 로직을 구현
                // 예: 1호차는 영통동, 2호차는 매탄동 등
                (shuttleIdx === 1 && area.ar_idx === 1) || // 1호차는 영통동
                (shuttleIdx === 2 && area.ar_idx === 2) || // 2호차는 매탄동
                (shuttleIdx === 3 && area.ar_idx === 3), // 3호차는 다른 지역
            )
            .map((area: { ar_name: string }) => area.ar_name);

          console.log("Filtered areas for shuttle:", shuttleAreas);
          setSelectedShuttleAreas(shuttleAreas);
        }
      } else {
        setSelectedShuttleAreas([]);
      }
    } catch (error) {
      console.error("셔틀 지역 데이터 로딩 실패:", error);
      setSelectedShuttleAreas([]);
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
            passengers: [], // 서버에서 받은 cnt 값 사용
            passengerCount: parseInt(time.cnt) || 0, // cnt 값을 숫자로 변환하여 사용
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

    const selectedShuttle = shuttleData.find(
      (shuttle) => shuttle.sh_idx.toString() === routeId,
    );
    if (selectedShuttle) {
      setSelectedShuttleIdx(selectedShuttle.sh_idx);
      fetchShuttleAreas(selectedShuttle.sh_idx); // 선택된 셔틀의 담당 지역 정보 가져오기
      const selectedTimeData = selectedShuttle.times.find((t) =>
        t.st_time.startsWith(time),
      );
      if (selectedTimeData) {
        setSelectedTimeIdx(selectedTimeData.st_idx);
      }
    }
  };

  const handleStudentAssign = async (
    reservation: ShuttleReservationRequest,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/shuttle/reservation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...reservation,
            sr_meet_date: reservation.sr_meet_date.split("T")[0],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setAlertType("error");
          setAlertMessage("이미 배정이 되었습니다.");
          setShowAlert(true);
          return;
        }
        throw new Error(data.message || "셔틀 배정 실패");
      }

      if (data.code === 1) {
        // 성공적으로 배정되면 데이터 새로고침
        const stType = shuttleType === "pickup" ? 1 : 2;
        await fetchShuttleData(selectedDate, stType);
        setAlertType("success");
        setAlertMessage("배정이 완료되었습니다.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("셔틀 배정 실패:", error);
      setAlertType("error");
      setAlertMessage("셔틀 배정에 실패했습니다.");
      setShowAlert(true);
    }
  };

  const handlePassengerDelete = async (studentIdx: number) => {
    // TODO: 승객 삭제 API 구현
    console.log("승객 삭제:", studentIdx);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">로딩 중...</div>
      ) : (
        <>
          <div className="flex gap-4">
            <TimeTable
              routes={availableRoutes}
              onTimeSlotClick={handleTimeSlotClick}
              selectedRoute={selectedRoute}
              selectedTime={selectedTime}
              onDateChange={(date) => {
                if (date) {
                  setSelectedDate(date.toISOString().split("T")[0]);
                  setSelectedRoute(undefined);
                  setSelectedTime(undefined);
                }
              }}
              initialDate={new Date(selectedDate)}
              shuttleType={shuttleType}
              onScheduleTypeChange={setShuttleType}
            />

            <StudentList
              selectedDate={selectedDate}
              selectedShuttleIdx={selectedShuttleIdx}
              selectedTimeIdx={selectedTimeIdx}
              onStudentAssign={handleStudentAssign}
              selectedShuttleAreas={selectedShuttleAreas}
            />
          </div>

          <div className="mt-8">
            <PassengerList
              selectedDate={selectedDate}
              selectedShuttleIdx={selectedShuttleIdx}
              selectedTimeIdx={selectedTimeIdx}
              onPassengerDelete={handlePassengerDelete}
            />
          </div>

          {showAlert && (
            <Alert
              message={alertMessage}
              type={alertType}
              onClose={() => setShowAlert(false)}
            />
          )}
        </>
      )}
    </div>
  );
};
