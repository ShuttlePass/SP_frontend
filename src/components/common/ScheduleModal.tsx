import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ScheduleModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
}

interface Schedule {
  days: string[];
  time: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  title,
  onClose,
  onSave
}) => {
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [selectedTime, setSelectedTime] = React.useState('');

  // 시간 변경 핸들러 실제 사용
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleSave = () => {
    onSave({
      days: selectedDays,
      time: selectedTime
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요일 선택
          </label>
          <div className="flex gap-2">
            {['월', '화', '수', '목', '금', '토', '일'].map(day => (
              <button
                key={day}
                onClick={() => {
                  setSelectedDays(prev => 
                    prev.includes(day) 
                      ? prev.filter(d => d !== day)
                      : [...prev, day]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium
                  ${selectedDays.includes(day)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시간 선택
          </label>
          <select
            title="시간 선택"
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full p-2 border rounded"
          >
            <option value="">선택해주세요</option>
            {Array.from({ length: 10 }, (_, i) => i + 9).map(hour => (
              <option key={hour} value={`${hour}:00`}>
                {`${hour}:00`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={selectedDays.length === 0 || !selectedTime}
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleModal; 