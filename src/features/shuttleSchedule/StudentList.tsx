import { useState, useEffect } from 'react';
import { Student, StudentApiResponse, ClassEnrollmentApiResponse, StudentWithClasses } from './student.types';

interface StudentListProps {
  selectedDate: string;
}

export const StudentList = ({ selectedDate }: StudentListProps) => {
  const [students, setStudents] = useState<StudentWithClasses[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchName, setSearchName] = useState('');

  const fetchStudentClasses = async (studentIdx: number, date: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/classes/enroll?student_idx=${studentIdx}&ce_date=${date}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return null;

      const data: ClassEnrollmentApiResponse = await response.json();
      return data.code === 1 ? data.data : [];
    } catch (error) {
      console.error("수업 데이터 로딩 실패:", error);
      return null;
    }
  };

  const fetchStudents = async (date: string, name: string = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('토큰이 없습니다.');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/student/haveclasses?ce_date=${date}${name ? `&st_name=${name}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: StudentApiResponse = await response.json();
      if (data.code === 1) {
        // 각 학생의 수업 정보를 가져옴
        const studentsWithClasses = await Promise.all(
          data.data.map(async (student) => {
            const classes = await fetchStudentClasses(student.st_idx, date);
            return {
              ...student,
              classes: classes || [],
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
  };

  useEffect(() => {
    fetchStudents(selectedDate, searchName);
  }, [selectedDate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(selectedDate, searchName);
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  return (
    <div className="w-96 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-bold">수업 예정 학생 목록</h2>
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

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          로딩 중...
        </div>
      ) : (
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {students.length > 0 ? (
            students.map((student) => (
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
                <div className="text-sm text-gray-600 mb-2">
                  {student.st_address}
                </div>
                {student.classes && student.classes.length > 0 && (
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <div className="text-sm font-medium text-gray-700">수업 정보</div>
                    {student.classes.map((classInfo) => (
                      <div 
                        key={classInfo.ce_idx}
                        className="mt-1 text-sm text-gray-600"
                      >
                        <div className="flex justify-between items-center">
                          <span>{classInfo.cn_name}</span>
                          <span>
                            {formatTime(classInfo.cl_start_at)} - {formatTime(classInfo.cl_end_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              수업 예정인 학생이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 