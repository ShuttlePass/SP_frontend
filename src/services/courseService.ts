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

interface CreateScheduleData {
  classes_name_idx: number;
  cl_start_at: string;
  cl_end_at: string;
  cd_days: string[];
}

export interface StudentCourseResponse {
  message: string;
  code: number;
  data: {
    ce_idx: number;          // 수업 배정 ID
    student_idx: number;     // 학생 ID
    ce_date: string;         // 수업 날짜
    classes_idx: number;     // 수업 ID
    cn_name: string;         // 수업 이름
    cl_start_at: string;     // 시작 시간
    cl_end_at: string;       // 종료 시간
  }[];
}

interface AssignCourseData {
  student_idx: number;
  classes_day_idx: number;
  ce_date: string;
}

interface UpdateStudentCourseData {
  classes_idx: number;
  new_classes_idx: number;
}

interface AssignCourseResponse {
  message: string;
  code: number;  // 1: 성공, -104: 시간 겹침
}

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

    try {
      const response = await api.post('/classes/name', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('수업 등록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('수업 등록 에러:', error);
      throw error;
    }
  },

  // 수업 수정
  updateCourse: async (courseId: number, data: { cn_name: string; cn_max_num: number }) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.put(`/classes/name/${courseId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('수업 수정 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('수업 수정 에러:', error);
      throw error;
    }
  },

  // 수업 삭제
  deleteCourse: async (courseId: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.delete(`/classes/name/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('수업 삭제 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('수업 삭제 에러:', error);
      throw error;
    }
  },

  // 수업 목록 조회
  getCourses: async () => {
    const token = getToken();
    if (!token) return [];

    try {
      const response = await api.get<CourseNameResponse>('/classes/name', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('수업 목록 조회 응답:', response.data);

      return response.data.data.map(course => ({
        id: course.cn_idx,
        name: course.cn_name,
        maxStudents: course.cn_max_num
      }));
    } catch (error) {
      console.error('수업 목록 조회 에러:', error);
      throw error;
    }
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
  },

  // 학생별 수업 목록 조회
  getStudentCourses: async (studentId: string) => {
    const token = getToken();
    if (!token) return { data: [] };

    try {
      const response = await api.get<StudentCourseResponse>('/classes/enroll', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          student_idx: studentId  // 학생 ID를 쿼리 파라미터로 전달
        }
      });
      console.log('학생 수업 목록 조회 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('학생 수업 목록 조회 에러:', error);
      throw error;
    }
  },

  // 학생 수업 배정
  assignStudentCourse: async (data: AssignCourseData) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.post<AssignCourseResponse>('/classes/enroll', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('수업 배정 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('수업 배정 에러:', error);
      throw error;
    }
  },

  // 학생 수업 수정
  updateStudentCourse: async (data: UpdateStudentCourseData) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.put(`/classes/student/${data.classes_idx}`, {
        new_classes_idx: data.new_classes_idx
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('수업 수정 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('수업 수정 에러:', error);
      throw error;
    }
  },

  // 학생 수업 삭제
  deleteStudentCourse: async (courseId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.delete(`/admin/students/classes/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('학생 수업 삭제 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('학생 수업 삭제 에러:', error);
      throw error;
    }
  }
}; 