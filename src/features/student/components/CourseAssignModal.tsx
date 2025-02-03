import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Calendar from 'react-calendar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockCourseService } from '../../../mocks/data';
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

const MORNING_TIMES = ['09:00', '10:00', '11:00', '12:00'];
const AFTERNOON_TIMES = ['13:00', '14:00', '15:00', '16:00', '17:00'];

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

  // courseTypes 쿼리 결과 확인을 위한 로깅 추가
  const { data: courseTypes, isLoading, error } = useQuery({
    queryKey: ['courseTypes'],
    queryFn: async () => {
      const types = await mockCourseService.getCourseTypes();
      console.log('Fetched course types:', types);  // 데이터 확인
      return types;
    }
  });

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

      if (courseToEdit) {
        await mockCourseService.updateCourse({
          id: courseToEdit.id,
          type: selectedCourseType,
          date: selectedDate.toISOString().split('T')[0],
          startTime: selectedTimes[0]
        });
        setAlertMessage('수업이 수정되었습니다.');
      } else {
        await Promise.all(
          selectedTimes.map(time => 
            mockCourseService.assignCourse({
              studentId,
              type: selectedCourseType,
              date: selectedDate.toISOString().split('T')[0],
              startTime: time
            })
          )
        );
        setAlertMessage('수업이 배정되었습니다.');
      }

      await queryClient.invalidateQueries({ queryKey: ['assignedCourses', studentId] });
      setShowAlert(true);
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
            {isLoading ? (
              <div>로딩 중...</div>
            ) : error ? (
              <div>수업 목록을 불러오는데 실패했습니다.</div>
            ) : (
              <select
                value={selectedCourseType}
                onChange={(e) => setSelectedCourseType(e.target.value)}
                className="w-full p-2 border rounded-lg"
                disabled={!!courseToEdit}
                aria-label="수업 선택"
              >
                <option value="">수업을 선택하세요</option>
                {courseTypes?.map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name} (최대 {course.maxStudents}명)
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

          {/* 시간 선택 */}
          {selectedDate && (
            <div>
              <h3 className="text-lg font-medium mb-3">시간 선택</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">오전</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {MORNING_TIMES.map(time => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-1.5 text-sm rounded-lg ${
                          selectedTimes.includes(time)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">오후</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {AFTERNOON_TIMES.map(time => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-1.5 text-sm rounded-lg ${
                          selectedTimes.includes(time)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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