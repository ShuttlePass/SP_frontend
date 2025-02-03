import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminSidebar from "../../components/layout/sidebar";
import Button from "../../components/common/Button";
import { studentService } from "../../services/studentService";
import { mockCourseService } from "../../mocks/data";
import Modal from "../../components/common/Modal";
import AlertModal from "../../components/common/AlertModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import DeleteConfirmModal from "../../features/student/components/DeleteConfirmModal";
import StudentTable from "../../features/student/components/StudentTable";
import StudentDetailModal from "../../features/student/components/StudentDetailModal";
import CourseManager from "../../features/course/components/CourseManager";
import CourseAssignModal from "../../features/student/components/CourseAssignModal";
import { Student } from "../../types/student";

// interface StudentRegisterData {
//   area_idx: number;
//   st_name: string;
//   st_contact: string;
//   st_address: string;
// }

interface AssignedCourse {
  id: string;
  type: string;
  date: string;
  startTime: string;
}

interface ApiError {
  message: string;
}

const StudentPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [selectedCourseToEdit, setSelectedCourseToEdit] =
    useState<AssignedCourse | null>(null);
  const [showCourseManagement, setShowCourseManagement] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // 전체 학생 목록 조회
  const { data: students } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: () => studentService.getStudents(),
  });

  // 학생별 수업 목록 조회 수정
  const { data: assignedCourses } = useQuery<AssignedCourse[]>({
    queryKey: ["assignedCourses", selectedStudent?.id],
    queryFn: () => {
      if (!selectedStudent?.id) return []; // selectedStudent가 null일 때 빈 배열 반환
      return mockCourseService.getStudentCourses(selectedStudent.id);
    },
    enabled: !!selectedStudent?.id, // selectedStudent와 id가 있을 때만 쿼리 실행
  });

  // 검색어에 따른 필터링
  const filteredStudents = students?.filter(
    (student) =>
      !searchTerm ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 날짜 포맷 함수 추가
  const formatDateToKorean = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return `${year}. ${month}. ${day}`;
  };

  // 검색어 입력 핸들러
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // 삭제 핸들러
  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  // 삭제 취소 핸들러
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setStudentToDelete(null);
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (studentToDelete) {
      try {
        await studentService.deleteStudent(studentToDelete.id);
        await queryClient.invalidateQueries({ queryKey: ["students"] });
        setShowDeleteConfirm(false);
        setStudentToDelete(null);
        setSelectedStudent(null); // 선택된 학생 초기화
        setAlertMessage("삭제되었습니다.");
        setShowAlert(true);
      } catch (error) {
        console.error("삭제 실패:", error);
        setAlertMessage("삭제 중 오류가 발생했습니다.");
        setShowAlert(true);
      }
    }
  };

  const handleStudentUpdate = async (updatedStudent: Student) => {
    try {
      await studentService.updateStudent(updatedStudent.id, {
        st_name: updatedStudent.name,
        st_contact: updatedStudent.phone,
        st_address: updatedStudent.address,
      });
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      setShowDetailModal(false);
      setAlertMessage("수정되었습니다.");
      setShowAlert(true);
    } catch (error) {
      console.error("수정 실패:", error);
      setAlertMessage("수정 중 오류가 발생했습니다.");
      setShowAlert(true);
    }
  };

  const handleStudentRegister = async (studentData: Omit<Student, "id">) => {
    try {
      await studentService.registerStudent({
        area_idx: 1,
        st_name: studentData.name,
        st_contact: studentData.phone,
        st_address: studentData.address,
      });
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowRegisterModal(false);
      setAlertMessage("등록되었습니다.");
      setShowAlert(true);
    } catch (error) {
      console.error("등록 실패:", error);
      const apiError = error as ApiError;
      setAlertMessage(apiError.message || "등록 중 오류가 발생했습니다.");
      setShowAlert(true);
    }
  };

  // 수업 수정/삭제 핸들러
  const handleEditCourse = (course: AssignedCourse) => {
    setSelectedCourseToEdit(course);
    setShowAssignForm(true);
  };

  const handleDeleteCourse = (course: AssignedCourse) => {
    setShowConfirmModal({
      title: "수업 삭제",
      message: `${course.type} 수업을 삭제하시겠습니까?`,
      onConfirm: async () => {
        try {
          await mockCourseService.deleteCourse(course.id);
          await queryClient.invalidateQueries({
            queryKey: ['assignedCourses', selectedStudent?.id],
          });
          setShowConfirmModal(null);
          setAlertMessage("수업이 삭제되었습니다.");
          setShowAlert(true);
        } catch (error) {
          const apiError = error as ApiError;
          console.error("수업 삭제 실패:", error);
          setAlertMessage(apiError.message || "수업 삭제 중 오류가 발생했습니다.");
          setShowAlert(true);
        }
      },
    });
  };

  // 수업 카드 컴포넌트 수정
  const CourseCard = ({ course }: { course: AssignedCourse }) => (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">
            {course.type}
          </div>
          <div className="text-sm text-gray-500">
            {formatDateToKorean(course.date)} {course.startTime}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditCourse(course);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            수정
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCourse(course);
            }}
            className="text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-4">
        {/* 상단 헤더에서 제목 제거하고 버튼만 유지 */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowRegisterModal(true)}
            >
              학생 등록
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowCourseManagement(true)}
            >
              수업 관리
            </Button>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex gap-6">
          {/* 왼쪽: 학생 목록 */}
          <div className="flex-1">
            <StudentTable
              students={filteredStudents || []}
              onStudentClick={(student) => {
                setSelectedStudent(student);
              }}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              onDeleteClick={() => {}}
            />
          </div>

          {/* 오른쪽: 학생 상세 정보 패널 */}
          <div className="w-[400px]">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">학생 정보</h2>
                {selectedStudent && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDetailModal(true)}
                      className="p-1.5 rounded hover:bg-gray-100"
                      title="학생 정보 수정"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(selectedStudent)}
                      className="p-1.5 rounded hover:bg-gray-100"
                      title="학생 삭제"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {selectedStudent ? (
                <>
                  {/* 기본 정보 섹션 */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">기본 정보</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600">이름</span>
                        <span className="font-medium">
                          {selectedStudent.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600">연락처</span>
                        <span>{selectedStudent.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600">주소</span>
                        <span>{selectedStudent.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* 수업 정보 섹션 */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">수업 정보</h3>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedCourseToEdit(null); // 새로운 배정이므로 null로 설정
                          setShowAssignForm(true);
                        }}
                      >
                        수업 배정
                      </Button>
                    </div>

                    {/* 배정된 수업 목록 */}
                    <div className="space-y-2">
                      {assignedCourses?.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                      {assignedCourses?.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          배정된 수업이 없습니다.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  학생을 선택하면 정보를 확인할 수 있습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 수업 관리 모달 */}
        <Modal
          isOpen={showCourseManagement}
          onClose={() => setShowCourseManagement(false)}
          title="수업 관리"
        >
          <CourseManager
            mode="management"
            onClose={() => setShowCourseManagement(false)}
          />
        </Modal>

        {/* 취소 확인 모달 */}
        {showConfirmModal && (
          <ConfirmModal
            isOpen={true}
            title={showConfirmModal.title}
            message={showConfirmModal.message}
            onConfirm={showConfirmModal.onConfirm}
            onClose={() => setShowConfirmModal(null)}
            confirmText={
              showConfirmModal.title === "수업 삭제" ? "삭제" : "취소"
            }
            cancelText={
              showConfirmModal.title === "수업 삭제" ? "취소" : "돌아가기"
            }
          />
        )}

        {/* 학생 정보 수정 모달 */}
        <StudentDetailModal
          isOpen={showDetailModal}
          student={selectedStudent}
          onClose={() => setShowDetailModal(false)}
          onSave={handleStudentUpdate}
        />

        {/* 삭제 확인 모달 */}
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          message={`${studentToDelete?.name} 학생을 삭제하시겠습니까?`}
        />

        {/* 알림 모달 */}
        {showAlert && (
          <AlertModal
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            message={alertMessage}
          />
        )}

        {/* CourseAssignModal 컴포넌트 추가 */}
        {showAssignForm && (
          <CourseAssignModal
            isOpen={showAssignForm}
            onClose={() => setShowAssignForm(false)}
            studentId={selectedStudent?.id || ""}
            courseToEdit={selectedCourseToEdit}
          />
        )}

        {/* 학생 등록 모달 */}
        <StudentDetailModal
          isOpen={showRegisterModal}
          student={null}
          onClose={() => setShowRegisterModal(false)}
          onSave={handleStudentRegister}
        />
      </div>
    </div>
  );
};

export default StudentPage;
