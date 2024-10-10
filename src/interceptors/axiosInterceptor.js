import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const navigate = useNavigate();

    // 401 Unauthorized 발생 시 토큰 만료로 간주
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        // refreshToken을 사용해 accessToken을 재발급 받음
        const res = await axios.post('http://localhost:8080/api/member/refresh-token', { token: refreshToken });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('jwt', newAccessToken); // 새 accessToken을 로컬 스토리지에 저장

        // 요청에 새로운 accessToken을 추가하고 재시도
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("토큰 갱신 중 오류 발생:", err);
        localStorage.clear(); // 오류 시 모든 토큰 삭제
        navigate('/'); // 로그인 페이지로 리디렉션
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;