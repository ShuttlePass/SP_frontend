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

interface CompanyResponse {
  message: string;
  code: number;
  data: Company[];
}

interface Company {
  co_co_idx: number;
  co_co_name: string;
  co_created_at: string;
  co_updated_at: string;
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
    mutationFn: (newUser: Omit<SignupFormValues, "us_password_confirm">) =>
      api.post("/user", newUser),
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
      console.error(error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
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

    const { us_password_confirm, ...submitData } = formValues;
    signupMutation.mutate(submitData);
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
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    이름
                  </label>
                  <input
                    placeholder="이름을 입력해주세요."
                    type="text"
                    name="us_name"
                    id="us_name"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    value={formValues.us_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="company_name"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    회사명
                  </label>
                  <select
                    name="company_name"
                    id="company_name"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    value={formValues.company_idx}
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
                    <option value="" disabled>
                      회사명을 선택해주세요.
                    </option>
                    {companyList.map((company) => (
                      <option key={company.co_co_idx} value={company.co_co_idx}>
                        {company.co_co_name}
                      </option>
                    ))}
                  </select>
                </div>

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
                <div>
                  <label
                    htmlFor="us_password_confirm"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    비밀번호 (확인)
                  </label>
                  <input
                    placeholder="비밀번호 한 번 더 입력해주세요."
                    type="password"
                    name="us_password_confirm"
                    id="us_password_confirm"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    value={formValues.us_password_confirm}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="us_contact"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    연락처
                  </label>
                  <input
                    placeholder="010.xxxx.xxxx"
                    type="text"
                    name="us_contact"
                    id="us_contact"
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 text-black"
                    value={formValues.us_contact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-black">
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
                  className="w-full text-white bg-primary hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5"
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
