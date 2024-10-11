import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import axiosInstance from '../interceptors/axiosInterceptor'; // axiosInstance import

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    console.log("username : " + username);
    console.log("password :" + password);

    const header = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }; // x-www-form-urlencoded로 설정
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);

    try {
      const res = await axiosInstance.post(
        "http://localhost:8080/api/member/login",
        form,
        header
      );
      const data = res.data;

      console.log("data : ", data);

      if (data.accessToken && data.refreshToken) {
        // 로그인 성공 확인
        localStorage.setItem("jwt", data.accessToken); // JWT를 로컬 스토리지에 저장
        localStorage.setItem("refreshToken", data.refreshToken); // refreshToken을 로컬 스토리지에 저장
        localStorage.setItem("empID", username); // empID를 로컬 스토리지에 저장
        navigate("/dashboard"); // 대시보드로 리디렉션
      } else {
        setError(true); // 로그인 실패
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setError(true); // 로그인 오류
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>로그인</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <input type="submit" value="로그인" />
          {error && <p className="error">아이디 또는 비밀번호가 잘못되었습니다.</p>}
        </form>
        <div className="forgot-password">
          <a href="#">비밀번호를 잊으셨나요?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

