import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AttendancePage.css"; // CSS 파일을 가져옵니다.
import NavBar from "../components/NavBar";

const AttendanceTable = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [departmentFilter, setDepartmentFilter] = useState("all"); // 부서 필터 상태
  const [showMissingAttendance, setShowMissingAttendance] = useState(false); // 출퇴근 기록 없는 사람 필터 상태
  const [employees, setEmployees] = useState([]); // 사원 목록 상태 추가
  const [attemdances, setAttemdances] = useState([]);
  const [error, setError] = useState(null); // 오류 상태 추가
  const [loading, setLoading] = useState(true);

  const holidays = [
    "2024-01-01", // 신정
    "2024-03-01", // 삼일절
    "2024-05-05", // 어린이날
    "2024-06-06", // 현충일
    "2024-08-15", // 광복절
    "2024-10-01", // 국군
    "2024-10-03", // 개천절
    "2024-10-09", // 한글날
    "2024-12-25", // 크리스마스
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const headers = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };

        const employeeResponse = await axios.get(
          "http://localhost:8080/employee/all",
          headers
        );
        const attendanceResponse = await axios.get(
          "http://localhost:8080/api/attendance/all",
          headers
        );

        let mergedData = []; // 직원과 출퇴근 데이터를 합칠 배열 생성

        if (Array.isArray(employeeResponse.data)) {
          const employeesData = employeeResponse.data;
          const attendanceData = attendanceResponse.data;

          mergedData = employeesData
            .map((employee) => {
              // 직원의 출퇴근 기록 찾기
              const employeeAttendances = attendanceData.filter(
                (attendance) => attendance.userId === String(employee.enb)
              );

              // 출퇴근 기록을 날짜, 출근 시간, 퇴근 시간만 포함하도록 변환
              const attendanceSummary = employeeAttendances.reduce(
                (acc, attendance) => {
                  const date = attendance.timestamp.split("T")[0]; // 날짜 추출
                  const time =
                    attendance.timestamp.split("T")[1].split(":")[0] +
                    ":" +
                    attendance.timestamp.split("T")[1].split(":")[1]; // 시간 추출
                  const actionType = attendance.actionType; // "출근" 또는 "퇴근" 추출

                  // 해당 날짜의 출퇴근 기록 객체를 찾거나 새로 생성
                  if (!acc.some((entry) => entry.date === date)) {
                    acc.push({ date }); // 날짜 추가
                  }

                  // 출근 또는 퇴근 시간에 따라 분리
                  const currentEntry = acc.find((entry) => entry.date === date);
                  if (actionType === "출근") {
                    currentEntry.clockIn = time; // 출근 시간 추가
                  } else if (actionType === "퇴근") {
                    currentEntry.clockOut = time; // 퇴근 시간 추가
                  }
                  return acc;
                },
                []
              );

              // 출퇴근 기록이 존재할 경우에만 attendances 속성을 추가
              if (attendanceSummary.length > 0) {
                return {
                  ...employee,
                  attendances: attendanceSummary, // 날짜별 출퇴근 기록으로 저장
                };
              }

              // 출퇴근 기록이 없으면 해당 직원 객체는 저장하지 않음
              return null;
            })
            .filter(Boolean); // null을 제거하여 attendances가 있는 직원만 남김
        } else {
          mergedData = []; // 직원 데이터가 배열이 아닐 경우 빈 배열로 설정
        }

        setEmployees(mergedData); // 합쳐진 데이터를 상태에 설정
        setLoading(false);
      } catch (error) {
        console.error(error); // 오류를 콘솔에 로그
        setError("데이터를 불러오는 중 오류가 발생했습니다."); // 오류 메시지 설정
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
      return newDate; // 새로운 날짜 반환
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
      return newDate; // 새로운 날짜 반환
    });
  };

  const handleDepartmentFilterChange = (e) => {
    setDepartmentFilter(e.target.value);
  };

  const handleMissingAttendanceChange = () => {
    setShowMissingAttendance((prev) => !prev);
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate(); // 해당 월의 일 수
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시, 분, 초, 밀리초를 0으로 설정

  // 요일 배열 생성
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="attendance-table-container">
      <h2 className="attendance-table-title">전직원 출퇴근 기록</h2>
      <NavBar />
      {error && <p className="error-message">{error}</p>}{" "}
      {/* 오류 메시지 표시 */}
      <div className="attendance-table-navigation">
        <button onClick={handlePreviousMonth}>이전</button>
        <span>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </span>
        <button onClick={handleNextMonth}>다음</button>
      </div>
      <div className="attendance-table-filters">
        <label htmlFor="departmentFilter">부서 필터:</label>
        <select
          id="departmentFilter"
          value={departmentFilter}
          onChange={handleDepartmentFilterChange}
        >
          <option value="all">전체</option>
          <option value="영업팀">영업팀</option>
          <option value="인사관리팀">인사관리팀</option>
          <option value="인사기획팀">인사기획팀</option>
        </select>

        <label htmlFor="missingAttendance">
          <input
            type="checkbox"
            id="missingAttendance"
            checked={showMissingAttendance}
            onChange={handleMissingAttendanceChange}
          />
          공란 체크
        </label>
      </div>
      <table className="attendance-table">
        <thead>
          <tr className="attendance-table-header">
            <th className="attendance-table-header-cell">직원</th>
            {[...Array(daysInMonth)].map((_, index) => {
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                index + 1
              );
              const dayOfWeek = daysOfWeek[date.getDay()]; // 요일 가져오기
              const isToday = date.toDateString() === today.toDateString(); // 오늘 날짜인지 체크

              // 날짜를 YYYY-MM-DD 형식으로 변환하여 공휴일 배열과 비교
              const dateString = date
                .toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\./g, "")
                .replace(/ /g, "-");
              const isHoliday = holidays.includes(dateString); // 공휴일 여부 확인

              return (
                <th
                  key={index}
                  className={`attendance-table-header-cell ${
                    isToday ? "today-cell" : ""
                  } ${
                    date.getDay() === 0 || isHoliday ? "sunday" : "" // 공휴일이면 빨간날로 표시
                  } ${date.getDay() === 6 ? "saturday" : ""}`}
                >
                  {index + 1}
                  <br />({dayOfWeek})
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => {
              const firstAttendanceDate = employee.attendances
                ? employee.attendances[0].date
                : null;

              return (
                <tr key={index} className="attendance-table-row">
                  <td className="attendance-table-cell">
                    {employee.name} ({employee.department})
                  </td>
                  {[...Array(daysInMonth)].map((_, dayIndex) => {
                    const date = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      dayIndex + 1
                    );
                    const formattedDate = date
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\./g, "")
                      .replace(/ /g, "-");

                    const attendanceRecord = employee.attendances?.find(
                      (attendance) => attendance.date === formattedDate
                    );

                    const isHolidayOrWeekend =
                      date.getDay() === 0 ||
                      date.getDay() === 6 ||
                      holidays.includes(formattedDate);
                    const isBeforeToday =
                      date < new Date(currentDate.setHours(0, 0, 0, 0));
                    const isAfterHireDate =
                      firstAttendanceDate &&
                      formattedDate >= firstAttendanceDate;
                    const isWeekday = !isHolidayOrWeekend;

                    // 출근 시간이 9:00 이후인지 확인
                    const clockInTime =
                      attendanceRecord && attendanceRecord.clockIn
                        ? new Date(`1970-01-01T${attendanceRecord.clockIn}`)
                        : null;
                    const isLateClockIn =
                      clockInTime && clockInTime.getHours() >= 9;

                    // 퇴근 시간이 18시 이전인지 확인
                    const clockOutTime =
                      attendanceRecord && attendanceRecord.clockOut
                        ? new Date(`1970-01-01T${attendanceRecord.clockOut}`)
                        : null;
                    const isEarlyClockOut =
                      clockOutTime && clockOutTime.getHours() < 18;

                    console.log(
                      employee.name,
                      firstAttendanceDate,
                      formattedDate,
                      !isAfterHireDate ? "X" : ""
                    );
                    return (
                      <td
                        key={dayIndex}
                        className={
                          !isAfterHireDate
                            ? "attendance-table-cell hire-date-cell"
                            : "attendance-table-cell"
                        }
                      >
                        {attendanceRecord ? (
                          <>
                            <div
                              className={isLateClockIn ? "late-clock-in" : ""}
                            >
                              {attendanceRecord.clockIn}
                            </div>
                            <div
                              className={
                                isEarlyClockOut ? "early-clock-out" : ""
                              }
                            >
                              {attendanceRecord.clockOut || (
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  미체크
                                </span>
                              )}
                            </div>
                          </>
                        ) : isBeforeToday && isAfterHireDate && isWeekday ? (
                          <div
                            style={{
                              color: "red",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          >
                            X
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={daysInMonth + 1}
                className="attendance-table-no-data"
              >
                출퇴근 기록이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
