import FullScreenContainer from "@/components/container/FullScreenContainer";
import logo from "../../assets/img/logo.png";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/api/axios";

interface LoginFormValues {
  us_id: string;
  us_password: string;
  us_level: string; // UI 용도로만 사용
}

interface LoginRequest {
  us_id: string;
  us_password: string;
}

interface LoginResponse {
  message: string;
  code: number;
  data: {
    token: string;
    company_idx: number;
    us_level: string;
  };
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
  stack?: string;
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
          us_password: credentials.us_password,
        };

        // 요청 데이터 로깅
        console.log("로그인 요청 데이터:", requestData);

        const response = await api.post<LoginResponse>(
          "/user/login",
          requestData,
        );

        // 응답 데이터 로깅
        console.log("로그인 응답 데이터:", response.data);

        if (response.data.code !== 1) {
          console.error("로그인 실패 응답:", response.data);
          throw new Error(response.data.message || "로그인에 실패했습니다.");
        }

        // 토큰 저장 - response.data.data.token 사용
        const token = response.data.data.token;
        if (typeof token === "string") {
          localStorage.setItem("token", token);
          console.log("저장된 토큰:", token);
        } else {
          console.error("잘못된 토큰 형식:", response.data.data);
          throw new Error("유효하지 않은 토큰 형식입니다.");
        }

        return {
          ...response.data,
          selectedLevel: credentials.us_level,
        };
      } catch (error) {
        const apiError = error as ApiError;
        console.error("로그인 에러 상세:", {
          status: apiError.response?.status,
          data: apiError.response?.data,
          message: apiError.message,
          stack: apiError.stack,
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      // 성공 데이터 로깅
      console.log("로그인 성공:", data);

      const userLevel = formValues.us_level;
      console.log("선택된 사용자 레벨:", userLevel);

      switch (userLevel) {
        case "manager":
          alert("관리자로 로그인되었습니다.");
          navigate("/admin/students");
          break;
        case "driver":
          alert("기사로 로그인되었습니다.");
          navigate("/driver/schedule");
          break;
        default:
          console.error("알 수 없는 사용자 레벨:", userLevel);
          alert("사용자 권한을 확인할 수 없습니다.");
      }
    },
    onError: (error) => {
      const apiError = error as ApiError;
      console.error("로그인 실패 상세:", {
        error: error,
        response: apiError.response?.data,
        status: apiError.response?.status,
      });
      const errorMessage =
        apiError.response?.data?.message ||
        "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";
      alert(errorMessage);
    },
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
      <header className="h-[100px] w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto mt-2 flex w-full items-center justify-between px-6 py-4">
          <img src={logo} alt="셔틀패스 로고" className="h-10 cursor-pointer" />
        </div>
      </header>
      <div className="mx-auto flex w-full flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md xl:p-0 dark:border">
          <div className="space-y-4 p-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight text-black">
              로그인
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="us_id"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  아이디
                </label>
                <input
                  placeholder="아이디를 입력해주세요."
                  type="text"
                  name="us_id"
                  id="us_id"
                  className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-black"
                  value={formValues.us_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="us_password"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  비밀번호
                </label>
                <input
                  placeholder="비밀번호를 입력해주세요."
                  type="password"
                  name="us_password"
                  id="us_password"
                  className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-black"
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
                className="bg-primary hover:bg-primary-700 w-full rounded-lg px-5 py-2.5 text-sm text-white"
              >
                로그인 완료
              </button>
              <div className="flex w-full justify-center gap-6 text-gray-400">
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
