// src/components/MySalaryWidget.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MySalaryWidget = () => {
  const [salary, setSalary] = useState(0);
  const [workTime, setWorkTime] = useState('데이터 준비 중입니다.');
  const [userName, setUserName] = useState(''); // 사용자 이름 상태 추가

  useEffect(() => {
    const getSalaryInfo = async () => {
      const token = localStorage.getItem('jwt'); // JWT 토큰 가져오기
      const empID = localStorage.getItem('empID'); // empID 가져오기

      try {
        // 1. 특정 empID에 대한 직원 정보 가져오기
        const employeeResponse = await axios.get(`http://localhost:8080/employee/${empID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { companyId, name } = employeeResponse.data; // empID에 해당하는 직원 정보
        setUserName(name); // 사용자 이름 설정

        // 2. 회사 정보를 가져오기
        const companyResponse = await axios.get(`http://localhost:8080/employee/${empID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('회사 정보:', companyResponse.data); // 회사 정보 콘솔 로그

        const companyData = companyResponse.data.find(company => company.cnb === companyId);

        if (companyData) {
          setSalary(companyData.baseSalary); // base_salary 설정
          console.log('총 급여:', companyData.baseSalary); // 총 급여 콘솔 로그
        } else {
          console.error('회사를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('급여 정보를 가져오는 중 오류 발생:', error.response ? error.response.data : error.message);
      }
    };

    getSalaryInfo();
  }, []);

  return (
    <div className="my-salary-page">
      <div className="salary-content">
        <h1>급여 & 근태 정보</h1>
        <p><strong>이름:</strong> {userName}</p> {/* 이름 표시 */}
        <p>월급: {salary}원</p>
        <p>근무 시간: {workTime}</p> {/* 에러 메시지로 대체 */}
      </div>
    </div>
  );
};

export default MySalaryWidget;
