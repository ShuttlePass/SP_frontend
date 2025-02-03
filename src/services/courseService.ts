interface CourseRegisterData {
  name: string;
  maxStudents: number;
}

interface Course {
  id: number;
  name: string;
  maxStudents: number;
}

// 임시 모킹 데이터
const MOCK_COURSES = [
  { id: 1, name: '기능 교육', maxStudents: 1 },
  { id: 2, name: '필기 시험', maxStudents: 15 }
];

export const courseService = {
  // 수업명 등록 (모킹)
  registerCourseName: async (data: CourseRegisterData) => {
    // 모킹 데이터에 새 수업 추가
    const newCourse = {
      id: MOCK_COURSES.length + 1,
      name: data.name,
      maxStudents: data.maxStudents
    };
    MOCK_COURSES.push(newCourse);

    return Promise.resolve({
      message: "수업명 추가 성공",
      code: 1,
      data: newCourse.id
    });
  },

  // 수업 목록 조회 (모킹)
  getCourses: async (): Promise<Course[]> => {
    return Promise.resolve(MOCK_COURSES);
  },

  // 수업 삭제 (모킹)
  deleteCourse: async (courseId: number) => {
    // 모킹 데이터에서 해당 수업 제거
    const index = MOCK_COURSES.findIndex(course => course.id === courseId);
    if (index !== -1) {
      MOCK_COURSES.splice(index, 1);
    }

    return Promise.resolve({
      message: "수업 삭제 성공",
      code: 1
    });
  },

  // 수업 수정 (모킹)
  updateCourse: async (courseId: number, data: CourseRegisterData) => {
    return Promise.resolve({
      message: "수업 수정 성공",
      code: 1,
      data: { id: courseId, ...data }
    });
  }
}; 