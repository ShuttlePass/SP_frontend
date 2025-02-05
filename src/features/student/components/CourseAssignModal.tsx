import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Calendar from 'react-calendar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../../services/courseService';
import 'react-calendar/dist/Calendar.css';
import AlertModal from '../../../components/common/AlertModal';

// Value 타입 직접 정의
type Value = Date | null | [Date | null, Date | null];

interface CourseAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  courseToEdit?: {
    id: string;
    type: string;
    date: string;
    startTime: string;
  } | null;
}

// styled 컴포넌트 대신 일반 CSS 클래스 사용
const calendarClassName = `
  w-full border-none font-inherit
  [&_.react-calendar__tile]:p-3
  [&_.react-calendar__month-view__weekdays__weekday]:p-2
  [&_.react-calendar__month-view__weekdays__weekday_abbr]:no-underline
  [&_.react-calendar__month-view__weekdays__weekday_abbr]:font-semibold
  [&_.react-calendar__tile--active]:bg-blue-500
  [&_.react-calendar__tile--active]:text-white
  [&_.react-calendar__tile--active:enabled:hover]:bg-blue-600
  [&_.react-calendar__tile--active:enabled:focus]:bg-blue-600
`;

export interface ScheduleTime {
  classes_idx: number;
  cn_max_num: number;
  cl_start_at: string;
  cl_end_at: string;
  cn_name: string;
  cd_days: string;
  count?: number;
}

const CourseAssignModal: React.FC<CourseAssignModalProps> = ({
  isOpen,
  onClose,
  studentId,
  courseToEdit
}) => {
  const [selectedCourseType, setSelectedCourseType] = useState(courseToEdit?.type || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    courseToEdit ? new Date(courseToEdit.date) : null
  );
  const [selectedTimes, setSelectedTimes] = useState<string[]>(
    courseToEdit ? [courseToEdit.startTime] : []
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 수업 목록 조회
  const { data: courseTypes, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courseTypes'],
    queryFn: async () => {
      const response = await courseService.getCourseNames();
      return response;
    }
  });

  // 수업 시간표 조회
  const { data: schedules = [], isLoading: isLoadingSchedules } = useQuery({
    queryKey: ['courseSchedules', selectedCourseType],
    queryFn: async () => {
      if (!selectedCourseType) return [];
      const response = await courseService.getCourseSchedules();
      return response?.data?.filter(schedule => schedule.cn_name === selectedCourseType) || [];
    },
    enabled: !!selectedCourseType
  });

  // 시간대 목록 생성
  const availableTimes = schedules?.map(schedule => {
    if (!schedule.cl_start_at || !schedule.cl_end_at) return null;

    try {
      // 시간 형식 변환 (HH:MM:SS -> HH:MM)
      const startTime = schedule.cl_start_at.substring(0, 5);
      const endTime = schedule.cl_end_at.substring(0, 5);
      
      // 요일 변환
      const days = schedule.cd_days.split(',').map(day => {
        switch(day.trim()) {
          case 'MON': return '월';
          case 'TUE': return '화';
          case 'WED': return '수';
          case 'THU': return '목';
          case 'FRI': return '금';
          case 'SAT': return '토';
          case 'SUN': return '일';
          default: return day;
        }
      });

      return {
        classes_idx: schedule.classes_idx,
        startTime,
        endTime,
        maxStudents: schedule.cn_max_num,
        currentCount: schedule.count || 0,
        days
      };
    } catch (error) {
      console.error('시간 데이터 처리 중 에러:', error);
      return null;
    }
  }).filter(Boolean) || [];

  const queryClient = useQueryClient();

  const formatDateToKST = (date: Date) => {
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  };

  const handleTimeSelect = (time: string) => {
    if (courseToEdit) {
      setSelectedTimes([time]);
    } else {
      setSelectedTimes(prev => 
        prev.includes(time)
          ? prev.filter(t => t !== time)
          : [...prev, time]
      );
    }
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedDate || selectedTimes.length === 0 || !selectedCourseType) return;

      // 선택된 수업 시간표 찾기
      const selectedSchedule = schedules?.find(schedule => {
        const scheduleTime = schedule.cl_start_at.substring(0, 5);
        return scheduleTime === selectedTimes[0];
      });

      if (!selectedSchedule) {
        setAlertMessage('선택한 시간의 수업 시간표를 찾을 수 없습니다.');
        setShowAlert(true);
        return;
      }

      if (courseToEdit) {
        await courseService.updateStudentCourse({
          classes_idx: Number(courseToEdit.id),
          new_classes_idx: selectedSchedule.classes_idx
        });
        setAlertMessage('수업이 수정되었습니다.');
      } else {
        // 요일 인덱스 찾기
        const dayMap: { [key: string]: number } = {
          'MON': 1,
          'TUE': 2,
          'WED': 3,
          'THU': 4,
          'FRI': 5,
          'SAT': 6,
          'SUN': 7
        };

        // 선택된 날짜의 요일 찾기
        const days = selectedSchedule.cd_days.split(',');
        const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dayIdx = dayMap[selectedDay];

        if (!days.includes(selectedDay)) {
          setAlertMessage('선택한 날짜는 해당 수업의 요일이 아닙니다.');
          setShowAlert(true);
          return;
        }

        try {
          // 날짜를 YYYY-MM-DD 형식으로 변환
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
          const day = String(selectedDate.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;

          const response = await courseService.assignStudentCourse({
            student_idx: Number(studentId),
            classes_day_idx: dayIdx,
            ce_date: formattedDate
          });

          if (!response) {
            setAlertMessage('수업 배정 중 오류가 발생했습니다.');
            setShowAlert(true);
            return;
          }

          // 응답 코드에 따른 처리
          if (response.code === 1) {
            setAlertMessage('수업이 배정되었습니다.');
            await queryClient.invalidateQueries({ queryKey: ['assignedCourses', studentId] });
            setShowAlert(true);
            onClose();
          } else if (response.code === -104) {
            setAlertMessage('이미 등록된 수업과 시간이 겹칩니다.');
            setShowAlert(true);
          } else {
            setAlertMessage('수업 배정 중 오류가 발생했습니다.');
            setShowAlert(true);
          }
        } catch (error) {
          console.error('수업 배정 실패:', error);
          setAlertMessage('수업 배정 중 오류가 발생했습니다.');
          setShowAlert(true);
        }
      }
    } catch (error) {
      console.error('수업 배정/수정 실패:', error);
      setAlertMessage('오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  const isSubmitDisabled = !selectedCourseType || !selectedDate || selectedTimes.length === 0;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={courseToEdit ? "수업 수정" : "수업 배정"}>
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 수업 선택 */}
          <div>
            <h3 className="text-lg font-medium mb-3">수업 선택</h3>
            {isLoadingCourses ? (
              <div>로딩 중...</div>
            ) : (
              <select
                value={selectedCourseType}
                onChange={(e) => setSelectedCourseType(e.target.value)}
                className="w-full p-2 border rounded-lg"
                disabled={!!courseToEdit}
                aria-label="수업 선택"
              >
                <option value="" key="default">수업을 선택하세요</option>
                {courseTypes?.map((course) => (
                  <option key={course.cn_idx} value={course.cn_name}>
                    {course.cn_name} (최대 {course.cn_max_num}명)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 달력 */}
          <div>
            <h3 className="text-lg font-medium mb-3">날짜 선택</h3>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={new Date()}
              className={calendarClassName}
              formatDay={(_, date: Date) => date.getDate().toString()}
              calendarType="gregory"
            />
          </div>

          {/* 시간표 선택 */}
          {selectedCourseType && (
            <div>
              <h3 className="text-lg font-medium mb-3">시간 선택</h3>
              {isLoadingSchedules ? (
                <div>시간표 로딩 중...</div>
              ) : availableTimes.length > 0 ? (
                <div className="space-y-2">
                  {availableTimes.map((schedule) => schedule && (
                    <button
                      key={schedule.classes_idx}
                      onClick={() => handleTimeSelect(schedule.startTime)}
                      disabled={schedule.currentCount >= schedule.maxStudents}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        selectedTimes.includes(schedule.startTime)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : schedule.currentCount >= schedule.maxStudents
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {schedule.startTime} - {schedule.endTime}
                          <span className="ml-2 text-sm">
                            ({schedule.days.join(', ')})
                          </span>
                        </span>
                        <span className={`text-sm ${
                          schedule.currentCount >= schedule.maxStudents
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}>
                          {schedule.currentCount}/{schedule.maxStudents}명
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  등록된 시간표가 없습니다.
                </div>
              )}
            </div>
          )}

          {/* 선택된 정보 요약 */}
          {selectedDate && selectedTimes.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">선택된 일정</h4>
              <div className="space-y-2">
                {selectedTimes.map((time) => (
                  <div 
                    key={time} 
                    className="flex justify-between items-center text-sm py-1"
                  >
                    <span className="text-gray-600">
                      {`${formatDateToKST(selectedDate)} ${time}`}
                    </span>
                    <button
                      onClick={() => handleTimeSelect(time)}
                      className="text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {courseToEdit ? '수정하기' : '배정하기'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 알림 모달 */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
          if (alertMessage.includes('되었습니다')) {
            onClose();
          }
        }}
        message={alertMessage}
      />
    </>
  );
};

export default CourseAssignModal; 