import { useState, useMemo, useEffect, useCallback } from "react";
import { TimeTable } from "./TimeTable";
import PassengerList from "./PassengerList";
import { StudentList } from "./StudentList";
import { ShuttleType } from "@/types/shuttle.types";
import {
  ShuttleApiResponse,
  ShuttleData,
  ShuttleReservationRequest,
} from "./api.types";
import { BusRoute } from "./schedule.types";
import Alert from "@/components/common/Alert";
import api from "@/api/axios";

interface TimeTableDisplayProps {
  selectedDate: string;
  shuttleType: ShuttleType;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setShuttleType: React.Dispatch<React.SetStateAction<"pickup" | "dropoff">>;
}

// 타입 정의 추가
interface MatchedArea {
  area_idx: number;
  ar_name: string;
  shuttle_idx: number;
}

// 셔틀 차량의 담당 지역 정보를 포함하도록 수정
interface ShuttleArea {
  sh_name: string;
  area_idx: number;
  ar_name: string;
}

// 학생 데이터 타입 정의
interface StudentData {
  student_idx: number;
  shuttle_idx: number;
  shuttle_name: string;
  area_idx: number;
  area_name: string;
  max_count: number;
  state: number;
}

// MatchedItem 타입 정의 추가
interface MatchedItem {
  shuttle_idx: number;
  sh_name: string;
  area_idx: number;
  ar_name: string;
  sh_max_cnt: number;
  sh_state: number;
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

  const [areas, setAreas] = useState<ShuttleArea[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<ShuttleArea[]>([]);

  const [selectedStudentIdx, setSelectedStudentIdx] = useState<number | null>(null);

  // studentsWithCourses 상태의 타입 지정
  const [studentsWithCourses, setStudentsWithCourses] = useState<StudentData[]>([]);

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

  // 지역 목록 조회
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get("/list/area", {
          params: {
            ip: 0,
            ar_name: ""
          }
        });
        console.log("Areas response:", response.data);

        if (response.data.code === 1) {
          setAreas(response.data.data || []);
        }
      } catch (error) {
        console.error("지역 목록 조회 실패:", error);
        setAreas([]);
      }
    };

    fetchAreas();
  }, []); // 빈 배열로 유지 - 컴포넌트 마운트 시 한 번만 실행

  // 셔틀별 지역 필터링
  useEffect(() => {
    const fetchShuttleAreas = async () => {
      if (!selectedShuttleIdx) return;

      try {
        if (selectedStudentIdx) {
          // 학생이 선택된 경우 매칭 정보 조회
          const response = await api.get<{ code: number; data: MatchedArea[] }>('/shuttle/match', {
            params: {
              student_idx: selectedStudentIdx
            }
          });
          console.log("Shuttle match response:", response.data);

          if (response.data.code === 1) {
            // 선택된 셔틀의 지역 정보만 추출
            const matchedAreas = response.data.data
              .filter(item => item.shuttle_idx === selectedShuttleIdx)
              .map(item => ({
                sh_name: "",
                area_idx: item.area_idx,
                ar_name: item.ar_name
              }));

            if (matchedAreas.length > 0) {
              console.log("Matched areas:", matchedAreas);
              setFilteredAreas(matchedAreas);
              setSelectedShuttleAreas(matchedAreas.map(area => area.ar_name));
              return;
            }
          }
        }

        // 학생이 선택되지 않았거나 매칭된 지역이 없는 경우 전체 지역 목록 사용
        const defaultAreas = areas.slice(0, 3).map(area => ({
          sh_name: "",
          area_idx: area.area_idx,
          ar_name: area.ar_name
        }));
        console.log("Default areas:", defaultAreas);
        setFilteredAreas(defaultAreas);
        setSelectedShuttleAreas(defaultAreas.map(area => area.ar_name));

      } catch (error) {
        console.error("셔틀 지역 조회 실패:", error);
        // 에러 시 전체 지역 목록의 처음 3개 지역 사용
        const defaultAreas = areas.slice(0, 3).map(area => ({
          sh_name: "",
          area_idx: area.area_idx,
          ar_name: area.ar_name
        }));
        setFilteredAreas(defaultAreas);
        setSelectedShuttleAreas(defaultAreas.map(area => area.ar_name));
      }
    };

    fetchShuttleAreas();
  }, [selectedShuttleIdx, selectedStudentIdx, areas]);  // selectedStudentIdx 의존성 추가

  // 데이터 변환 함수
  const convertToRoutes = useCallback((shuttleData: ShuttleData[]): BusRoute[] => {
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
  }, [shuttleType]);

  // 날짜나 셔틀 타입이 변경될 때마다 데이터 fetch
  useEffect(() => {
    const stType = shuttleType === "pickup" ? 1 : 2;
    fetchShuttleData(selectedDate, stType);
  }, [selectedDate, shuttleType]);

  const availableRoutes = useMemo(() => {
    return convertToRoutes(shuttleData);
  }, [shuttleData, convertToRoutes]);

  const handleTimeSlotClick = (routeId: string, time: string) => {
    setSelectedRoute(routeId);
    setSelectedTime(time);
    setSelectedStudentIdx(null); // 새로운 시간 선택 시 선택된 학생 초기화

    const selectedShuttle = shuttleData.find(
      (shuttle) => shuttle.sh_idx.toString() === routeId,
    );
    if (selectedShuttle) {
      setSelectedShuttleIdx(selectedShuttle.sh_idx);
      setSelectedShuttleAreas(filteredAreas.map(area => area.ar_name));
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

  // 학생 수업 정보 조회
  useEffect(() => {
    const loadStudentCourses = async () => {
      if (!selectedStudentIdx) {
        setStudentsWithCourses([]); // 학생이 선택되지 않았을 때 목록 초기화
        return;
      }

      try {
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

        const response = await api.get<{ code: number; data: MatchedItem[] }>('/shuttle/match', {
          params: {
            student_idx: selectedStudentIdx,
            date: formattedDate
          }
        });

        if (response.data.code === 1) {
          const studentData = response.data.data.map((item) => ({
            student_idx: selectedStudentIdx,
            shuttle_idx: item.shuttle_idx,
            shuttle_name: item.sh_name,
            area_idx: item.area_idx,
            area_name: item.ar_name,
            max_count: item.sh_max_cnt,
            state: item.sh_state
          }));

          setStudentsWithCourses(studentData);
        }
      } catch (error) {
        console.error("학생 매칭 정보 조회 실패:", error);
        setStudentsWithCourses([]);
      }
    };

    loadStudentCourses();
  }, [selectedStudentIdx, selectedDate]);

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
              studentList={studentsWithCourses}
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
