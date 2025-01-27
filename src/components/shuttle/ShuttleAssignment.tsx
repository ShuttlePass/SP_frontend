import React, { useState, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AlertModal from '../common/AlertModal';
import ConfirmModal from '../common/ConfirmModal';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  dayAvailability?: { [key: number]: boolean };
  isSelected?: boolean;
}

interface SelectedClass {
  date: Date;
  time: string;
}

const ShuttleAssignment: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClasses, setSelectedClasses] = useState<SelectedClass[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const timeSlots = useMemo<TimeSlot[]>(() => [
    { 
      time: '09:00', 
      isAvailable: true,
      dayAvailability: {
        0: false,
        6: false,
      }
    },
    { time: '11:00', isAvailable: true },
    { time: '13:30', isAvailable: false },
    { time: '15:30', isAvailable: true },
    { time: '17:40', isAvailable: true },
  ], []);

  const getAvailableTimeSlots = useCallback((date: Date, slots: TimeSlot[], selectedClasses: SelectedClass[]): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    return slots.map(slot => {
      const isTimeSelected = selectedClasses.some(
        cls => cls.time === slot.time && cls.date.toDateString() === date.toDateString()
      );

      const [hours, minutes] = slot.time.split(':').map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0);
      const isPastTime = isToday && slotTime < now;

      return {
        ...slot,
        isAvailable: (
          !isPastTime &&
          slot.dayAvailability?.[dayOfWeek] !== false &&
          slot.isAvailable
        ),
        isSelected: isTimeSelected
      };
    });
  }, []);

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
    setAvailableTimeSlots(getAvailableTimeSlots(value, timeSlots, selectedClasses));
  };

  const getDayOfWeek = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const handleSubmit = () => {
    if (selectedClasses.length === 0) {
      setShowErrorAlert(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      // API 호출 로직
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccessAlert(true);
      setSelectedClasses([]);
    } catch {
      setShowErrorAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-[#f8f8f8] border-2 border-[#B0B8C1] rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">셔틀 배정</h2>
      
      {/* 날짜/시간 선택 UI */}
      <div className="flex flex-col mb-4">
        {/* 달력 */}
        <div className="w-full border-2 border-[#B0B8C1] rounded-lg p-4 mb-4">
          <Calendar
            onChange={(value, event) => {
              handleDateChange(value as Date);
              console.log('클릭된 요소:', event.target);
            }}
            value={selectedDate}
            formatDay={(locale, date) => {
              // locale이 'ko'인 경우 한글 날짜 포맷 사용
              if (locale === 'ko') {
                return `${date.getDate()}일`;
              }
              return date.getDate().toString();
            }}
            className="w-full border-none"
            tileClassName={({ date }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isBeforeToday = date < today;
              const isSelected = selectedDate.toDateString() === date.toDateString();
              
              if (isBeforeToday) {
                return 'text-gray-300 cursor-not-allowed';
              }
              return isSelected ? 'bg-blue-500 text-white rounded' : '';
            }}
            tileDisabled={({ date }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            navigationLabel={({ date }) => 
              `${date.getFullYear()}년 ${date.getMonth() + 1}월`
            }
            prevLabel="«"
            nextLabel="»"
            next2Label={null}
            prev2Label={null}
          />
        </div>

        {/* 시간 선택 */}
        <div className="w-full border-2 border-[#B0B8C1] rounded-lg p-4">
          <div className="space-y-4">
            {/* 오전/오후 시간대 */}
            {['오전', '오후'].map((period) => (
              <div key={period}>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{period}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots
                    .filter(slot => {
                      const hour = parseInt(slot.time.split(':')[0]);
                      return period === '오전' ? hour < 12 : hour >= 12;
                    })
                    .map((slot, index) => (
                      <button
                        key={index}
                        disabled={!slot.isAvailable || slot.isSelected}
                        onClick={() => {
                          if (slot.isAvailable && !slot.isSelected) {
                            const newSelectedClasses = [
                              ...selectedClasses,
                              {
                                date: selectedDate,
                                time: slot.time
                              }
                            ];
                            setSelectedClasses(newSelectedClasses);
                            setAvailableTimeSlots(getAvailableTimeSlots(selectedDate, timeSlots, newSelectedClasses));
                          }
                        }}
                        className={`py-1 px-2 text-sm rounded-lg text-center
                          ${slot.isSelected 
                            ? 'bg-gray-200 text-gray-500' 
                            : slot.isAvailable 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                              : 'bg-gray-100 text-gray-400'}`}
                      >
                        {parseInt(slot.time.split(':')[0]) > 12 
                          ? `${parseInt(slot.time.split(':')[0]) - 12}:${slot.time.split(':')[1]}`
                          : slot.time}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 선택된 수업 목록 */}
      <div className="border-2 border-[#B0B8C1] rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">총 배정된 수업: {selectedClasses.length}개</span>
          <button 
            className="text-xs text-red-500 hover:text-red-600"
            onClick={() => setSelectedClasses([])}
          >
            전체 취소
          </button>
        </div>
        <div className="space-y-1 max-h-[100px] overflow-y-auto">
          {selectedClasses.map((cls, index) => (
            <div key={index} className="flex justify-between items-center p-1.5 bg-white rounded text-sm">
              <span>
                {cls.date.getMonth() + 1}/{cls.date.getDate()}({getDayOfWeek(cls.date)}) {cls.time}
              </span>
              <button 
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  const newClasses = [...selectedClasses];
                  newClasses.splice(index, 1);
                  setSelectedClasses(newClasses);
                  setAvailableTimeSlots(getAvailableTimeSlots(selectedDate, timeSlots, newClasses));
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 등록 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedClasses.length === 0}
          className={`px-4 py-2 rounded-lg text-white flex items-center gap-2
            ${isSubmitting || selectedClasses.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>등록 중...</span>
            </>
          ) : (
            '수업 등록하기'
          )}
        </button>
      </div>

      {/* 모달들 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
      />

      <AlertModal
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        message="수업이 성공적으로 배정되었습니다."
      />

      <AlertModal
        isOpen={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        message={selectedClasses.length === 0 
          ? "배정할 수업을 선택해주세요." 
          : "수업 배정 중 오류가 발생했습니다."}
      />
    </div>
  );
};

export default ShuttleAssignment; 