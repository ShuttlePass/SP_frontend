interface StudentRegisterData {
  area_idx: number;
  st_name: string;
  st_contact: string;
  st_address: string;
}

interface Student {
  id: string;
  name: string;
  phone: string;
  address: string;
  area_idx: number;
}

interface StudentResponse {
  st_idx: number;
  st_name: string;
  st_contact: string;
  st_address: string;
  area_idx: number;
}

const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

// 토큰을 가져오는 함수
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/signin";
    return null;
  }
  return token;
};

export const studentService = {
  // 학생 목록 조회
  getStudents: async (): Promise<Student[]> => {
    try {
      const token = getToken();
      if (!token) return [];

      console.log("API URL:", `${API_SERVER_URL}/student`);
      console.log("Using token:", token); // 토큰 확인용 로그

      const response = await fetch(`${API_SERVER_URL}/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token"); // 토큰이 유효하지 않으면 제거
        window.location.href = "/signin";
        throw new Error("인증이 필요합니다.");
      }

      // 응답 상태 확인 및 에러 처리 개선
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API 에러 응답:", errorText);
        throw new Error(`API 호출 실패 (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log("API 응답 데이터:", result);

      // 응답 데이터 구조 확인
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("잘못된 응답 데이터 형식");
      }

      // 데이터 구조에 맞게 매핑
      return result.data.map((student: StudentResponse) => ({
        id: student.st_idx.toString(),
        name: student.st_name,
        phone: student.st_contact,
        address: student.st_address,
        area_idx: student.area_idx,
      }));
    } catch (error) {
      console.error("학생 목록 조회 실패:", error);
      throw error;
    }
  },

  // 학생 등록
  registerStudent: async (data: StudentRegisterData) => {
    try {
      const token = getToken();
      if (!token) return;

      console.log('학생 등록 요청 데이터:', data); // 요청 데이터 로깅

      const response = await fetch(`${API_SERVER_URL}/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          area_idx: data.area_idx,
          st_name: data.st_name,
          st_contact: data.st_contact,
          st_address: data.st_address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('학생 등록 실패 응답:', errorData);
        throw new Error(errorData.message || '학생 등록에 실패했습니다.');
      }

      const result = await response.json();
      console.log('학생 등록 응답:', result); // 응답 데이터 로깅
      return result;
    } catch (error) {
      console.error('학생 등록 에러:', error);
      throw error;
    }
  },

  // 학생 상세 정보 조회
  getStudent: async (id: string): Promise<Student> => {
    const token = getToken();
    if (!token) throw new Error("인증이 필요합니다");

    try {
      const response = await fetch(`${API_SERVER_URL}/student/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API 응답 에러:", response.status, errorData);
        throw new Error(`학생 상세 정보 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data.st_idx.toString(),
        name: data.st_name,
        phone: data.st_contact,
        address: data.st_address,
        area_idx: data.area_idx,
      };
    } catch (error) {
      console.error("학생 상세 정보 조회 중 에러 발생:", error);
      throw error;
    }
  },

  // 학생 정보 수정
  updateStudent: async (id: string, data: Partial<StudentRegisterData>) => {
    try {
      const token = getToken();
      if (!token) return;

      console.log('학생 정보 수정 요청 데이터:', { id, data }); // 요청 데이터 로깅

      const response = await fetch(`${API_SERVER_URL}/student/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          area_idx: data.area_idx,
          st_name: data.st_name,
          st_contact: data.st_contact,
          st_address: data.st_address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('학생 정보 수정 실패 응답:', errorData);
        throw new Error(errorData.message || '학생 정보 수정에 실패했습니다.');
      }

      const result = await response.json();
      console.log('학생 정보 수정 응답:', result); // 응답 데이터 로깅
      return result;
    } catch (error) {
      console.error('학생 정보 수정 에러:', error);
      throw error;
    }
  },

  // 학생 삭제
  deleteStudent: async (id: string) => {
    const token = getToken();
    if (!token) return;

    const response = await fetch(`${API_SERVER_URL}/student/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();

    // 임시 응답
    return {
      success: true,
    };
  },
};
