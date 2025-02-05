import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/common/Button';
import AlertModal from '../../../components/common/AlertModal';
import { courseService } from '../../../services/courseService.ts';

interface Course {
  id: number;
  name: string;
  maxStudents: number;
}

const CourseTypeManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'register' | 'list'>('register');
  const [courseName, setCourseName] = useState('');
  const [maxStudents, setMaxStudents] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Course | null>(null);

  // 수업 목록 조회 - 모킹 데이터 사용
  const { data: courseTypes } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => courseService.getCourses()
  });

  const handleRegisterSubmit = async () => {
    try {
      await courseService.registerCourseName({
        cn_name: courseName,
        cn_max_num: maxStudents
      });
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      setAlertMessage('수업이 등록되었습니다.');
      setShowAlert(true);
      setActiveTab('list');
      setCourseName('');
      setMaxStudents(1);
    } catch (error) {
      console.error(error);
      setAlertMessage('오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  const handleEditSave = async () => {
    if (!editForm) return;

    try {
      await courseService.updateCourse(editForm.id, {
        cn_name: editForm.name,
        cn_max_num: editForm.maxStudents
      });
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsEditing(false);
      setEditForm(null);
      setAlertMessage('수업이 수정되었습니다.');
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('수정 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  const handleDeleteCourseType = async (courseId: number) => {
    try {
      await courseService.deleteCourse(courseId);
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      setAlertMessage('수업이 삭제되었습니다.');
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('삭제 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  // 수정 모드 시작
  const handleEditStart = (course: Course) => {
    setEditForm({ 
      ...course,
    });
    setIsEditing(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[800px] max-h-[90vh] flex flex-col">
        {/* 헤더 - 수정 모드에 따라 다른 텍스트 표시 */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? (
                <div className="flex items-center text-blue-600">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  "{editForm?.name}" 수업 수정
                </div>
              ) : (
                "수업 관리"
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="닫기"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 탭 네비게이션 - 수정 모드가 아닐 때만 표시 */}
          {!isEditing && (
            <div className="flex border-b mb-6">
              <button
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('register')}
              >
                수업 등록
              </button>
              <button
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('list')}
              >
                수업 목록
              </button>
            </div>
          )}

          {isEditing ? (
            // 수정 폼
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    수업명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    title="수업명"
                    type="text"
                    value={editForm?.name}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 인원 <span className="text-red-500">*</span>
                  </label>
                  <input
                    title="최대 인원"
                    type="number"
                    min={1}
                    value={editForm?.maxStudents}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, maxStudents: Number(e.target.value) } : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'register' ? (
            // 수업 등록 폼
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  수업명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="수업명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  제한 인원 <span className="text-red-500">*</span>
                </label>
                <input
                  title="제한 인원"
                  type="number"
                  min={1}
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose}>취소</Button>
                <Button 
                  variant="primary" 
                  onClick={handleRegisterSubmit}
                  disabled={!courseName || maxStudents < 1}
                >
                  등록
                </Button>
              </div>
            </div>
          ) : (
            // 수업 목록 
            <div className="grid gap-4">
              {courseTypes?.map((course) => (
                <div 
                  key={course.id}
                  className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                    <span className="text-sm text-gray-600">최대 {course.maxStudents}명</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart(course)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="수업 수정"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCourseType(course.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="수업 삭제"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 영역 - 수정 모드일 때만 표시 */}
        {isEditing && (
        <div className="p-6 border-t sticky bottom-0 bg-white rounded-b-xl">
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setEditForm(null);
              }}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSave}
              disabled={!editForm?.name || (editForm?.maxStudents || 0) < 1}
            >
              저장
            </Button>
          </div>
        </div>
        )}
      </div>

      {/* 알림 모달 */}
      {showAlert && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          message={alertMessage}
        />
      )}
    </div>
  );
};

export default CourseTypeManager; 