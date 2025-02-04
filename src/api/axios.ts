import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  timeout: 5000, // 타임아웃 설정 추가
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 토큰을 가져오는 함수
const getToken = () => {
  const token = localStorage.getItem("token"); // accessToken에서 token으로 변경
  if (!token) {
    window.location.href = "/signin";
    return null;
  }
  return token;
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // accessToken에서 token으로 변경
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export { api };
export default api;
