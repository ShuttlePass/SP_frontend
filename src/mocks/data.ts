export interface AssignedCourse {
  id: string;
  studentId: string;
  type: string;
  date: string;
  startTime: string;
  maxStudents: number;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface CourseUpdateData {
  name: string;
  maxStudents: number;
  type: string;
  dayOfWeek: string[];
  timeSlots: string[];
}

export interface Course {
  id: string;
  name: string;
  type: string;
  maxStudents: number;
}

export const MOCK_ASSIGNED_COURSES: AssignedCourse[] = [
  {
    id: '1',
    studentId: '1',
    type: '기능 교육',
    date: '2024-03-25',
    startTime: '09:00',
    maxStudents: 0,
  },
  {
    id: '2',
    studentId: '1',
    type: '필기 시험',
    date: '2024-03-25',
    startTime: '11:00',
    maxStudents: 0,
  },
  {
    id: '3',
    studentId: '1',
    type: '기능 교육',
    date: '2024-03-26',
    startTime: '14:00',
    maxStudents: 0,
  },
  {
    id: '4',
    studentId: '2',
    type: '필기 시험',
    date: '2024-03-25',
    startTime: '15:00',
    maxStudents: 0,
  },
  {
    id: '5',
    studentId: '2',
    type: '기능 교육',
    date: '2024-03-26',
    startTime: '10:00',
    maxStudents: 0,
  }
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [ // 시간대 데이터
  { id: '09:00', startTime: '09:00', endTime: '10:00', isAvailable: true },
  { id: '10:00', startTime: '10:00', endTime: '11:00', isAvailable: true },
  { id: '11:00', startTime: '11:00', endTime: '12:00', isAvailable: true },
  { id: '12:00', startTime: '12:00', endTime: '13:00', isAvailable: true },
  { id: '13:00', startTime: '13:00', endTime: '14:00', isAvailable: true },
  { id: '14:00', startTime: '14:00', endTime: '15:00', isAvailable: true },
  { id: '15:00', startTime: '15:00', endTime: '16:00', isAvailable: true },
  { id: '16:00', startTime: '16:00', endTime: '17:00', isAvailable: true },
  { id: '17:00', startTime: '17:00', endTime: '18:00', isAvailable: true }
];

export const MOCK_COURSE_TYPES = ['기능 교육', '필기 시험', '학과 교육'];

export const MOCK_COURSES = [
  { 
    id: '1', 
    name: '기능 교육',
    type: '기능 교육',
    maxStudents: 1,
  },
  { 
    id: '2', 
    name: '필기 시험',
    type: '필기 시험',
    maxStudents: 15,
  },
  { 
    id: '3', 
    name: '학과 교육',
    type: '학과 교육',
    maxStudents: 20,
  }
];

export const mockCourseService = {
  getStudentCourses: (studentId: string) => {
    return Promise.resolve(
      MOCK_ASSIGNED_COURSES.filter(course => course.studentId === studentId)
    );
  },

  updateCourse: async (courseData: {
    id: string;
    type: string;
    date: string;
    startTime: string;
  }) => {
    const courseIndex = MOCK_ASSIGNED_COURSES.findIndex(c => c.id === courseData.id);
    if (courseIndex === -1) {
      return Promise.reject(new Error('Course not found'));
    }

    // 수업 정보 업데이트
    MOCK_ASSIGNED_COURSES[courseIndex] = {
      ...MOCK_ASSIGNED_COURSES[courseIndex],
      type: courseData.type,
      date: courseData.date,
      startTime: courseData.startTime
    };

    return Promise.resolve(MOCK_ASSIGNED_COURSES[courseIndex]);
  },

  cancelCourse: (courseId: string) => {
    const courseIndex = MOCK_ASSIGNED_COURSES.findIndex(c => c.id === courseId);
    if (courseIndex === -1) {
      return Promise.reject(new Error('Course not found'));
    }


  },

  // 특정 날짜/시간의 예약 가능 여부 확인
  checkTimeSlotAvailability: (date: string, startTime: string) => {
    const isBooked = MOCK_ASSIGNED_COURSES.some(
      course => 
        course.date === date && 
        course.startTime === startTime
    );
    return Promise.resolve(!isBooked);
  },

  // 수업 배정 메서드 수정
  assignCourse: async (courseData: {
    studentId: string;
    type: string;
    date: string;
    startTime: string;
  }) => {
    const newCourse = {
      id: String(MOCK_ASSIGNED_COURSES.length + 1),
      ...courseData,
      maxStudents: MOCK_COURSES.find(c => c.type === courseData.type)?.maxStudents || 0
    };

    MOCK_ASSIGNED_COURSES.push(newCourse);
    return Promise.resolve(newCourse);
  },

  // 특정 날짜의 사용 가능한 시간대 조회 메서드 수정
  getAvailableTimeSlots: async (date: string) => {
    // 해당 날짜의 예약된 수업들 조회
    const bookedCourses = MOCK_ASSIGNED_COURSES.filter(course => 
        course.date === date
    );

    return MOCK_TIME_SLOTS.map(slot => ({
      ...slot,
      isAvailable: !bookedCourses.some(course => course.startTime === slot.startTime),
      // 선택적: 어떤 수업이 배정되어 있는지 정보 추가
      bookedInfo: bookedCourses.find(course => course.startTime === slot.startTime)
    }));
  },

  // 수업 삭제 메서드 추가
  deleteCourse: async (courseId: string) => {
    const courseIndex = MOCK_ASSIGNED_COURSES.findIndex(c => c.id === courseId);
    if (courseIndex === -1) {
      return Promise.reject(new Error('Course not found'));
    }

    // 배열에서 해당 수업 제거
    MOCK_ASSIGNED_COURSES.splice(courseIndex, 1);
    return Promise.resolve();
  },

  // 수업 종류 등록
  registerCourse: async (data: CourseUpdateData) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      ...data
    };
    return Promise.resolve(newCourse);
  },

  // 수업 종류 수정
  updateCourseType: async (courseId: string, data: CourseUpdateData) => {
    return Promise.resolve({ id: courseId, ...data });
  },

  // 수업 종류 삭제
  deleteCourseType: async () => {  // 파라미터 제거
    return Promise.resolve(true);
  },

  getCourseTypes: async () => {
    return MOCK_COURSES;  // 이 부분이 제대로 데이터를 반환하고 있는지 확인
  },

  getCourses: async () => {
    return MOCK_COURSES;
  }
};
