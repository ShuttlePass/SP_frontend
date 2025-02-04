import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import FullScreenContainer from "../../components/container/FullScreenContainer";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

interface SignupFormValues {
  us_id: string;
  us_password: string;
  us_password_confirm: string;
  us_level: string;
  company_idx: number;
  us_contact: string;
  us_name: string;
}

interface Company {
  co_idx: number;
  co_name: string;
  created_at: string;
  updated_at: string;
}

interface CompanyResponse {
  message: string;
  code: number;
  data: Company[];
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
    headers?: Record<string, string>;
  };
}

const Signup = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<SignupFormValues>({
    us_id: "",
    us_password: "",
    us_password_confirm: "",
    us_level: "",
    company_idx: 0,
    us_contact: "",
    us_name: "",
  });

  const [companyList, setCompanyList] = useState<Company[]>([]);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER_URL,
  });

  const fetchCompanies = async (): Promise<CompanyResponse> => {
    const { data } = await api.get<CompanyResponse>("/list/company?ip=0");
    setCompanyList(data?.data);
    return data;
  };

  const { isLoading, error } = useQuery<CompanyResponse, Error>({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const signupMutation = useMutation({
    mutationFn: async (
      newUser: Omit<SignupFormValues, "us_password_confirm">,
    ) => {
      console.log("회원가입 요청 데이터:", newUser);

      try {
        const response = await api.post("/user", newUser);
        console.log("회원가입 응답:", response.data);
        return response.data;
      } catch (error) {
        const apiError = error as ApiError;
        console.error("회원가입 에러 상세:", {
          status: apiError.response?.status,
          data: apiError.response?.data,
          headers: apiError.response?.headers,
        });
        throw error;
      }
    },
    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      setFormValues({
        us_id: "",
        us_password: "",
        us_password_confirm: "",
        us_level: "",
        company_idx: 0,
        us_contact: "",
        us_name: "",
      });
      navigate("/signup-complete");
    },
    onError: (error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "회원가입에 실패했습니다.";
      console.error("회원가입 실패:", errorMessage);
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

    if (formValues.us_password !== formValues.us_password_confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formValues.company_idx || formValues.company_idx === 0) {
      alert("회사를 선택해주세요.");
      return;
    }

    if (!formValues.us_level) {
      alert("가입 대상 여부를 선택해주세요.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { us_password_confirm, ...submitData } = formValues;
    console.log("제출할 데이터:", submitData);
    signupMutation.mutate(submitData);
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
              회원가입
            </h1>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Failed to load company data.</div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="us_name"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    이름
                  </label>
                  <input
                    placeholder="이름을 입력해주세요."
                    type="text"
                    name="us_name"
                    id="us_name"
                    className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-black"
                    value={formValues.us_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="company_idx"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    회사명
                  </label>
                  <select
                    name="company_idx"
                    id="company_idx"
                    className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-black"
                    value={formValues.company_idx || ""}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        company_idx: e.target.value
                          ? parseInt(e.target.value)
                          : 0,
                      }))
                    }
                    required
                  >
                    <option value="">회사명을 선택해주세요.</option>
                    {companyList?.map((company) => (
                      <option key={company.co_idx} value={company.co_idx}>
                        {company.co_name}
                      </option>
                    ))}
                  </select>
                </div>

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
                <div>
                  <label
                    htmlFor="us_password_confirm"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    비밀번호 (확인)
                  </label>
                  <input
                    placeholder="비밀번호 한 번 더 입력해주세요."
                    type="password"
                    name="us_password_confirm"
                    id="us_password_confirm"
                    className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-black"
                    value={formValues.us_password_confirm}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="us_contact"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    연락처
                  </label>
                  <input
                    placeholder="010.xxxx.xxxx"
                    type="text"
                    name="us_contact"
                    id="us_contact"
                    className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-black"
                    value={formValues.us_contact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-black">
                    * 가입 대상 여부를 선택해주세요 (필수)
                  </label>
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
                  회원가입 완료
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </FullScreenContainer>
  );
};

export default Signup;
