import FullScreenContainer from "@/components/container/FullScreenContainer";
import logo from "../../assets/img/logo.png";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from '@/api/axios';

interface LoginFormValues {
  us_id: string;
  us_password: string;
  us_level: string;  // UI 용도로만 사용
}

interface LoginRequest {
  us_id: string;
  us_password: string;
}

interface LoginResponse {
  message: string;
  code: number;
  data: string;  // JWT 토큰
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const SignIn = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<LoginFormValues>({
    us_id: "",
    us_password: "",
    us_level: "manager",
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      try {
        const requestData: LoginRequest = {
          us_id: credentials.us_id,
          us_password: credentials.us_password
        };
        
        const response = await api.post<LoginResponse>('/user/login', requestData);
        
        if (response.data.code !== 1) {
          throw new Error(response.data.message || '로그인에 실패했습니다.');
        }

        // 토큰 저장
        localStorage.setItem('token', response.data.data);
        
        return {
          ...response.data,
          selectedLevel: credentials.us_level
        };
      } catch (error) {
        const apiError = error as ApiError;
        console.error('Login error details:', apiError.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      // UI에서 선택한 레벨로 페이지 이동
      const userLevel = formValues.us_level;
      console.log('Selected user level:', userLevel);
      
      switch(userLevel) {
        case 'manager':
          alert('관리자로 로그인되었습니다.');
          navigate('/admin/students');
          break;
        case 'driver':
          alert('기사로 로그인되었습니다.');
          navigate('/driver/schedule');
          break;
        default:
          console.error('Unknown user level:', userLevel);
          alert('사용자 권한을 확인할 수 없습니다.');
      }
    },
    onError: (error) => {
      const apiError = error as ApiError;
      console.error('로그인 실패:', error);
      const errorMessage = apiError.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      alert(errorMessage);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(formValues);
  };

  return (
    <FullScreenContainer>
      <header className="w-full h-[100px] bg-white border-b border-gray-200 shadow-sm">
        <div className="mt-2 w-full mx-auto flex justify-between items-center py-4 px-6">
          <img src={logo} alt="셔틀패스 로고" className="h-10 cursor-pointer" />
        </div>
      </header>
      <div className="w-full flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight text-black">
              로그인
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="us_id"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  아이디
                </label>
                <input
                  placeholder="아이디를 입력해주세요."
                  type="text"
                  name="us_id"
                  id="us_id"
                  className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                  value={formValues.us_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="us_password"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  비밀번호
                </label>
                <input
                  placeholder="비밀번호를 입력해주세요."
                  type="password"
                  name="us_password"
                  id="us_password"
                  className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                  value={formValues.us_password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="us_level"
                      value="manager"
                      checked={formValues.us_level === "manager"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    관리자
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="us_level"
                      value="driver"
                      checked={formValues.us_level === "driver"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    기사
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5"
              >
                로그인 완료
              </button>
              <div className="flex gap-6 w-full justify-center text-gray-400">
                <div>비밀번호 찾기</div> |{" "}
                <div onClick={() => navigate("/signup")}>회원 가입</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FullScreenContainer>
  );
};

export default SignIn;
