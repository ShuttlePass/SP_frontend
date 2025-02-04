import { api } from '@/api/axios';

export interface CourseNameInfo {
  cn_idx: number;
  company_idx: number;
  cn_max_num: number;
  cn_name: string;
  created_at: string;
  updated_at: string;
}

export interface CourseSchedule {
  classes_idx: number;
  cn_max_num: number;
  cl_start_at: string;
  cl_end_at: string;
  created_at: string;
  updated_at: string;
  cn_name: string;
  cn_idx: number;
  cd_days: string;
  cd_idx: number;
  count: number;
}

interface CourseNameResponse {
  message: string;
  code: number;
  data: CourseNameInfo[];
}

interface CourseScheduleResponse {
  message: string;
  code: number;
  data: CourseSchedule[];
  pageInfo: {
    size: number;
    page: number;
    total_count: number;
  };
}

interface CourseRegisterData {
  name: string;
  maxStudents: number;
}

interface Course {
  id: number;
  name: string;
  maxStudents: number;
}

interface CreateScheduleData {
  classes_name_idx: number;
  cl_start_at: string;
  cl_end_at: string;
  cd_days: string[];
}

// 임시 모킹 데이터
const MOCK_COURSES = [
  { id: 1, name: '기능 교육', maxStudents: 1 },
  { id: 2, name: '필기 시험', maxStudents: 15 }
];

// 토큰을 가져오는 함수
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/signin";
    return null;
  }
  return token;
};

export const courseService = {
  // 수업명 등록
  registerCourseName: async (data: { cn_name: string; cn_max_num: number }) => {
    const token = getToken();
    if (!token) return;

    const response = await api.post('/classes/name', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
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
  },

  // 수업 이름 목록 조회
  getCourseNames: async () => {
    const token = getToken();
    if (!token) return [];

    const response = await api.get<CourseNameResponse>('/classes/name', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  // 수업 시간표 목록 조회
  getCourseSchedules: async (page = 1, size = 10) => {
    const token = getToken();
    if (!token) return { data: [], pageInfo: { size, page, total_count: 0 } };

    const response = await api.get<CourseScheduleResponse>('/classes', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { page, size }
    });
    return response.data;
  },

  // 시간표 생성
  createSchedule: async (data: CreateScheduleData) => {
    const token = getToken();
    if (!token) return;

    const response = await api.post('/classes', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}; 