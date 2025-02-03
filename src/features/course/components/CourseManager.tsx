import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button from '../../../components/common/Button';
import { mockCourseService } from '../../../mocks/data';
import type { Course, CourseUpdateData } from '../../../mocks/data';  // 타입 import

interface CourseManagerProps {
  mode: 'management' | 'assignment';
  onClose: () => void;
}

const CourseManager: React.FC<CourseManagerProps> = ({
  mode,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'list'>('list');
  const [courseName, setCourseName] = useState('');
  const [maxStudents, setMaxStudents] = useState(1);

  // 수업 목록 조회
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const data = await mockCourseService.getCourses();
      return data;
    }
  });

  const handleRegisterCourse = async () => {
    try {
      const courseData: CourseUpdateData = {
        name: courseName,
        type: courseName,  // type과 name이 같다고 가정
        maxStudents,
        dayOfWeek: [],
        timeSlots: []
      };

      await mockCourseService.registerCourse(courseData);
      
      // 폼 초기화
      setCourseName('');
      setMaxStudents(1);
      setActiveTab('list');
      onClose(); // 필요한 경우 여기서 onClose 호출
    } catch (error) {
      console.error('수업 등록 실패:', error);
    }
  };

  const renderManagementMode = () => (
    <div>
      {/* 탭 메뉴 */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'list' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('list')}
        >
          수업 목록
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'register' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('register')}
        >
          수업 등록
        </button>
      </div>

      {activeTab === 'register' ? (
        // 수업 등록 폼
        <div className="space-y-4">
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium mb-1">
              수업명 <span className="text-red-500">*</span>
            </label>
            <input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="수업명을 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="maxStudents" className="block text-sm font-medium mb-1">
              최대 인원 <span className="text-red-500">*</span>
            </label>
            <input
              id="maxStudents"
              type="number"
              min={1}
              value={maxStudents}
              onChange={(e) => setMaxStudents(Number(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="최대 인원을 입력하세요"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setActiveTab('list')}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              onClick={handleRegisterCourse}
              disabled={!courseName.trim() || maxStudents < 1}
            >
              등록
            </Button>
          </div>
        </div>
      ) : (
        // 수업 목록
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="font-bold text-lg mb-2">{course.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>최대 인원: {course.maxStudents}명</p>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-8">
              등록된 수업이 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      {mode === 'management' ? renderManagementMode() : null}
    </div>
  );
};

export default CourseManager; 