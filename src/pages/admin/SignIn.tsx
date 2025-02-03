import FullScreenContainer from "@/components/container/FullScreenContainer";
import logo from "../../assets/img/logo.png";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SignInFormValues {
  us_id: string;
  us_password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<SignInFormValues>({
    us_id: "",
    us_password: "",
  });
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER_URL,
  });

  const signupMutation = useMutation({
    mutationFn: (newUser: Omit<SignInFormValues, "us_password_confirm">) =>
      api.post("/user/login", newUser),
    onSuccess: () => {
      alert("로그인이 완료되었습니다.");
      localStorage.setItem("isLoggedIn", "true");
      setFormValues({
        us_id: "",
        us_password: "",
      });
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
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
    const { ...submitData } = formValues;
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
                      // checked={formValues.us_level === "manager"}
                      // onChange={handleChange}
                      className="mr-2"
                    />
                    관리자
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="us_level"
                      value="driver"
                      // checked={formValues.us_level === "driver"}
                      // onChange={handleChange}
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
