import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar"; // 네비바 컴포넌트 가져오기
import "../styles/Documents.css"; // Documents에 대한 사용자 정의 스타일
import axios from "axios";

const Documents = () => {
  const [document, setDocument] = useState([]);
  const [userId, setUserId] = useState([]);
  const uploadRef = useRef();

  const handleChangeBoard = (e) => {
    document[e.target.name] = e.target.value;
    setDocument({ ...document });
  };

  const jwtToken = localStorage.getItem("jwt");
  const empId = localStorage.getItem("empID"); // empID 가져오기

  useEffect(() => {
    const fetchData = async () => {
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
      if (Array.isArray(employeeResponse.data)) {
        // empId와 일치하는 데이터를 찾기
        const matchingEmployee = employeeResponse.data.find(
          (employee) => employee.empID === empId
        );
        setUserId(matchingEmployee.enb);
      }
    };
    fetchData();
  }, []);

  const handleClickAdd = () => {
    if (document.title === "" || document.content === "") {
      alert("빈칸 없이 입력해야합니다.");
      return;
    }
    const files = uploadRef.current.files;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("title", document.title);
    formData.append("userId", userId);
    formData.append("content", document.content);

    // 서버로 파일과 다른 데이터를 전송하는 API 호출
    fetch("/api/documents/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("문서 작성 완료:", data);
      })
      .catch((error) => {
        console.error("문서 작성 중 오류 발생:", error);
      });
  };

  return (
    <div className="documents-page">
      <NavBar />
      <div className="documents-content">
        <h1>문서 작성</h1>
        <div>
          <label>제목:</label>
          <input
            type="text"
            name="title"
            value={document.title}
            onChange={handleChangeBoard}
            required
          />
        </div>
        <div>
          <label>내용:</label>
          <textarea
            value={document.content}
            name="content"
            onChange={handleChangeBoard}
            required
          ></textarea>
        </div>
        {/* <div>
            <label>부서:</label>
            <select multiple onChange={(e) => setDepartment(Array.from(e.target.selectedOptions, option => option.value))}>
              <option value="연구소">연구소</option>
              <option value="경영지원">경영지원</option>
              <option value="인사">인사</option>
              <option value="영업">영업</option>
              <option value="품질">품질</option>
              <option value="자재">자재</option>
              <option value="생산">생산</option>
            </select>
          </div>
          <div>
            <label>직급:</label>
            <select multiple onChange={(e) => setPosition(Array.from(e.target.selectedOptions, option => option.value))}>
              <option value="부장">부장</option>
              <option value="차장">차장</option>
              <option value="팀장">팀장</option>
              <option value="대리">대리</option>
              <option value="사원">사원</option>
            </select>
          </div> */}
        <div>
          <label>문서 첨부:</label>
          <input type="file" name="files" multiple={true} ref={uploadRef} />
        </div>
        <button
          className="documents-submit-button"
          type="submit"
          onClick={handleClickAdd}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default Documents;
