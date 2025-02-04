import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import type { CourseNameInfo } from '@/services/courseService';
import Button from '@/components/common/Button';

interface CourseManagerProps {
  mode: 'management' | 'assignment';
  onClose: () => void;
}

const DAYS = [
  { key: 'MON', label: '월' },
  { key: 'TUE', label: '화' },
  { key: 'WED', label: '수' },
  { key: 'THU', label: '목' },
  { key: 'FRI', label: '금' },
  { key: 'SAT', label: '토' },
  { key: 'SUN', label: '일' }
] as const;

// 요일 문자열을 한글로 변환하는 함수
const formatDays = (daysString: string) => {
  const dayMap: { [key: string]: string } = {
    'MON': '월',
    'TUE': '화',
    'WED': '수',
    'THU': '목',
    'FRI': '금',
    'SAT': '토',
    'SUN': '일'
  };

  // 쉼표로 구분된 요일들을 분리하고 한글로 변환
  return daysString.split(',')
    .map(day => dayMap[day.trim()] || day)
    .join(', ');
};

const CourseManager: React.FC<CourseManagerProps> = () => {
  const [currentTab, setCurrentTab] = useState<'list' | 'register'>('list');
  const [selectedCourse, setSelectedCourse] = useState<CourseNameInfo | null>(null);
  const [showSchedules, setShowSchedules] = useState(false);
  const queryClient = useQueryClient();
  const [courseName, setCourseName] = useState('');
  const [maxStudents, setMaxStudents] = useState<number>(10);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    startTime: '09:00',
    endTime: '12:00',
    days: [] as string[]
  });

  // 수업 이름 목록 조회
  const { data: courseNames = [] } = useQuery({
    queryKey: ['courseNames'],
    queryFn: courseService.getCourseNames
  });

  // 선택된 수업의 시간표 목록 조회
  const { data: courseSchedules } = useQuery({
    queryKey: ['courseSchedules', selectedCourse?.cn_idx],
    queryFn: () => courseService.getCourseSchedules(),
    enabled: !!selectedCourse,
  });

  // 수업명 등록 mutation
  const registerMutation = useMutation({
    mutationFn: (data: { cn_name: string; cn_max_num: number }) =>
      courseService.registerCourseName(data),
    onSuccess: () => {
      // 수업 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['courseNames'] });
      // 폼 초기화
      setCourseName('');
      setMaxStudents(10);
      // 목록 탭으로 이동
      setCurrentTab('list');
    }
  });

  // 시간표 생성 mutation
  const createScheduleMutation = useMutation({
    mutationFn: (data: { 
      classes_name_idx: number; 
      cl_start_at: string; 
      cl_end_at: string; 
      cd_days: string[] 
    }) => courseService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['courseSchedules', selectedCourse?.cn_idx] 
      });
      setShowScheduleForm(false);
      setScheduleForm({ startTime: '09:00', endTime: '12:00', days: [] });
    }
  });

  const handleRegister = () => {
    if (!courseName.trim()) {
      alert('수업명을 입력해주세요.');
      return;
    }

    registerMutation.mutate({
      cn_name: courseName,
      cn_max_num: maxStudents
    });
  };

  const handleDayToggle = (day: string) => {
    setScheduleForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleCreateSchedule = () => {
    if (!selectedCourse) return;
    if (scheduleForm.days.length === 0) {
      alert('요일을 선택해주세요.');
      return;
    }

    createScheduleMutation.mutate({
      classes_name_idx: selectedCourse.cn_idx,
      cl_start_at: scheduleForm.startTime + ':00',
      cl_end_at: scheduleForm.endTime + ':00',
      cd_days: scheduleForm.days
    });
  };

  const renderScheduleList = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            title="닫기"
            onClick={() => setShowSchedules(false)}
            className="text-gray-600 hover:text-blue-600 transition-colors p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCourse?.cn_name}
            <span className="text-base font-normal text-gray-500 ml-2">시간표</span>
          </h2>
        </div>
        <Button 
          onClick={() => setShowScheduleForm(true)}
          className="min-w-[100px]"  // 최소 너비 지정
        >
          시간표 추가
        </Button>
      </div>

      {showScheduleForm && (
        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">시간표 추가</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작 시간
                </label>
                <input
                  title="시작 시간"
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm(prev => ({
                    ...prev,
                    startTime: e.target.value
                  }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료 시간
                </label>
                <input
                  title="종료 시간"
                  type="time"
                  value={scheduleForm.endTime}
                  onChange={(e) => setScheduleForm(prev => ({
                    ...prev,
                    endTime: e.target.value
                  }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요일 선택
              </label>
              <div className="flex gap-2">
                {DAYS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleDayToggle(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${scheduleForm.days.includes(key)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowScheduleForm(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleCreateSchedule}
                disabled={scheduleForm.days.length === 0}
              >
                추가
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {courseSchedules?.data
          .filter(schedule => schedule.cn_idx === selectedCourse?.cn_idx)
          .map((schedule) => (
            <div 
              key={schedule.classes_idx}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-blue-600 font-medium min-w-[50px]">  {/* 최소 너비 지정 */}
                    {formatDays(schedule.cd_days)}요일
                  </span>
                  <span className="text-gray-900">
                    {schedule.cl_start_at.slice(0, 5)} - {schedule.cl_end_at.slice(0, 5)}
                  </span>
                </div>
                <span className="text-sm text-gray-500 min-w-[80px] text-right">  {/* 최소 너비와 정렬 지정 */}
                  {schedule.count}/{schedule.cn_max_num}명
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderCourseList = () => (
    <div className="p-6">
      <div className="space-y-3">
        {courseNames.map((course) => (
          <div 
            key={course.cn_idx}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => {
              setSelectedCourse(course);
              setShowSchedules(true);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{course.cn_name}</h3>
                <p className="text-sm text-gray-500">최대 인원: {course.cn_max_num}명</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">수업 등록</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            수업명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="수업명을 입력하세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            최대 수강 인원 <span className="text-red-500">*</span>
          </label>
          <input
            title="최대 수강 인원"
            type="number"
            value={maxStudents}
            onChange={(e) => setMaxStudents(Number(e.target.value))}
            min={1}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="pt-4">
          <Button
            onClick={handleRegister}
            disabled={!courseName.trim() || maxStudents < 1}
            className="w-full"
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* 탭 메뉴 */}
      {!showSchedules && (
        <div className="flex border-b sticky top-0 bg-white z-10">
          <button
            className={`px-6 py-3 ${currentTab === 'list' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentTab('list')}
          >
            수업 목록
          </button>
          <button
            className={`px-6 py-3 ${currentTab === 'register' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentTab('register')}
          >
            수업 등록
          </button>
        </div>
      )}

      {/* 컨텐츠 영역 */}
      {showSchedules ? renderScheduleList() : 
        currentTab === 'list' ? renderCourseList() : renderRegisterForm()}
    </div>
  );
};

export default CourseManager; 