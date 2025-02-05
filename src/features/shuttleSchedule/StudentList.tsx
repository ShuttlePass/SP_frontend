import { useState, useEffect, useCallback } from "react";
import {
  StudentApiResponse,
  ClassEnrollmentApiResponse,
  StudentWithClasses,
} from "./student.types";
import { ShuttleReservationRequest } from "./api.types";
import api from "@/api/axios";

interface StudentData {
  student_idx: number;
  shuttle_idx: number;
  shuttle_name: string;
  area_idx: number;
  area_name: string;
  max_count: number;
  state: number;
}

interface StudentListProps {
  selectedDate: string;
  selectedShuttleIdx: number | undefined;
  selectedTimeIdx: number | undefined;
  onStudentAssign: (reservation: ShuttleReservationRequest) => Promise<void>;
  selectedShuttleAreas: string[];
  studentList: StudentData[];
}

interface Area {
  ar_idx: number;
  ar_name: string;
}

interface AreaApiResponse {
  message: string;
  code: number;
  data: Area[];
}

export const StudentList = ({
  selectedDate,
  selectedShuttleIdx,
  selectedTimeIdx,
  onStudentAssign,
  selectedShuttleAreas,
  studentList,
}: StudentListProps) => {
  const [students, setStudents] = useState<StudentWithClasses[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchName, setSearchName] = useState("");

  const fetchStudentClasses = async (studentIdx: number, date: string) => {
    try {
      const response = await api.get<ClassEnrollmentApiResponse>(
        '/classes/enroll', 
        {
          params: {
            student_idx: studentIdx,
            ce_date: date
          }
        }
      );

      if (response.data.code === 1) {
        return response.data.data;
      }
      return [];

    } catch (error) {
      console.error(`학생 ${studentIdx}의 수업 데이터 로딩 실패:`, error);
      return [];
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await api.get<AreaApiResponse>('/list/area', {
        params: {
          ar_name: ''
        }
      });

      if (response.data.code === 1) {
        setAreas(response.data.data);
      }
    } catch (error) {
      console.error("지역 데이터 로딩 실패:", error);
      setAreas([]);
    }
  };

  const fetchStudents = useCallback(async (date: string, name: string = "") => {
    setIsLoading(true);
    try {
      const response = await api.get<StudentApiResponse>(
        '/student/haveclasses',
        {
          params: {
            ce_date: date,
            ...(name && { st_name: name })
          }
        }
      );

      if (response.data.code === 1) {
        const studentsWithClasses = await Promise.all(
          response.data.data.map(async (student) => {
            const classes = await fetchStudentClasses(student.st_idx, date);
            return {
              ...student,
              classes: classes || []
            };
          })
        );
        setStudents(studentsWithClasses);
      }
    } catch (error) {
      console.error("학생 데이터 로딩 실패:", error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAreaName = (areaIdx: number) => {
    const area = areas.find((area) => area.ar_idx === areaIdx);
    return area?.ar_name || "";
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    if (!searchName) {
      fetchStudents(selectedDate);
    }
  }, [selectedDate, fetchStudents]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(selectedDate, searchName);
  }, [selectedDate, searchName, fetchStudents]);

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const handleAssignStudent = (student: StudentWithClasses) => {
    if (!selectedShuttleIdx || !selectedTimeIdx) return;

    const reservation: ShuttleReservationRequest = {
      shuttle_idx: selectedShuttleIdx,
      shuttle_time_idx: selectedTimeIdx,
      sr_meet_date: selectedDate,
      student_idx: student.st_idx,
      sr_address: getAreaName(student.area_idx),
      classes_enrollment_idxs: student.classes?.map((c) => c.ce_idx) || [],
    };

    onStudentAssign(reservation);
  };

  // 필터링된 학생 목록을 studentList와 통합
  const filteredStudents = students
    .filter((student) => {
      const studentArea = getAreaName(student.area_idx);
      return selectedShuttleAreas.includes(studentArea);
    })
    .map(student => {
      // studentList에서 해당 학생의 추가 정보 찾기
      const matchingData = studentList.find(item => item.student_idx === student.st_idx);
      return {
        ...student,
        shuttle_info: matchingData
      };
    });

  return (
    <div className="w-96 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-bold">학생 목록</h2>
        <form onSubmit={handleSearch} className="mt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="학생 이름 검색"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              검색
            </button>
          </div>
        </form>
      </div>

      <div className={`max-h-[calc(100vh-300px)] overflow-y-auto ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        )}
        
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student.st_idx}
              className="mb-3 rounded-lg border border-gray-200 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-bold">{student.st_name}</span>
                <span className="text-sm text-gray-600">
                  {student.st_contact}
                </span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                {getAreaName(student.area_idx)}
              </div>
              {student.classes && student.classes.length > 0 && (
                <div className="mt-2 border-t border-gray-100 pt-2">
                  <div className="text-sm font-medium text-gray-700">
                    수업 정보
                  </div>
                  {student.classes.map((classInfo) => (
                    <div
                      key={classInfo.ce_idx}
                      className="mt-1 text-sm text-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <span>{classInfo.cn_name}</span>
                        <span>
                          {formatTime(classInfo.cl_start_at)} -{" "}
                          {formatTime(classInfo.cl_end_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => handleAssignStudent(student)}
                disabled={!selectedShuttleIdx || !selectedTimeIdx}
                className={`mt-2 w-full rounded-lg py-2 text-sm ${
                  !selectedShuttleIdx || !selectedTimeIdx
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                셔틀 배정하기
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            해당 지역의 수업 예정인 학생이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
