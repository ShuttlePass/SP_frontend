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
}

interface StudentResponse {
  st_idx: number;
  st_name: string;
  st_contact: string;
  st_address: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//토큰 수정 필요 시 수정
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZHgiOjEwLCJjb21wYW55X2lkeCI6MSwidXNfbGV2ZWwiOiJtYW5hZ2VyIiwiaWF0IjoxNzM4NTQyNTQxLCJleHAiOjE3Mzg2Mjg5NDF9.yLmZ7tAhfnNXDtl9cqkxtqoaFacRGA0lDkg39p2rcwk';
export const studentService = {
  // 학생 목록 조회
  getStudents: async (): Promise<Student[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/student`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const result = await response.json();
      
      // 응답 구조 확인을 위한 로깅
      console.log('API Response:', result);
      
      // 데이터 구조에 맞게 매핑
      return result.data.map((student: StudentResponse) => ({
        id: student.st_idx.toString(),
        name: student.st_name,
        phone: student.st_contact,
        address: student.st_address
      }));
    } catch (error) {
      console.error('학생 목록 조회 실패:', error);
      throw error;
    }
  },

  // 학생 등록
  registerStudent: async (data: StudentRegisterData) => {
    const response = await fetch(`${API_BASE_URL}/student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: JSON.stringify({
        area_idx: 1,  // 여기서는 1을 사용
        st_name: data.st_name,
        st_contact: data.st_contact,
        st_address: data.st_address
      })
    });

    return response.json();
  },

  // 학생 상세 정보 조회
  getStudent: async (id: string): Promise<Student> => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API 응답 에러:', response.status, errorData);
        throw new Error(`학생 상세 정보 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('학생 상세 정보 조회 중 에러 발생:', error);
      throw error;
    }
  },

  // 학생 정보 수정
  updateStudent: async (id: string, data: Partial<StudentRegisterData>) => {
    // 실제 API 구현 시 아래 주석 해제
    /*
    const response = await fetch(`${API_BASE_URL}/student/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
    */

    // 임시 응답
    return {
      success: true,
      data: {
        id,
        name: data.st_name,
        phone: data.st_contact,
        address: data.st_address
      }
    };
  },

  // 학생 삭제
  deleteStudent: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/student/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    return response.json();
    
    // 임시 응답
    return {
      success: true
    };
  }
}; 