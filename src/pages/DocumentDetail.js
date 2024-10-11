import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams 추가
import NavBar from "../components/NavBar"; // 네비바 컴포넌트 가져오기
import "../styles/DocumentPage.css"; // DocumentPage에 대한 사용자 정의 스타일
import axios from "axios";

const DocumentDetail = () => {
  const navigate = useNavigate(); // navigate 함수 초기화
  const { dno } = useParams(); // dno를 라우트 파라미터에서 가져오기
  const [document, setDocument] = useState(null); // 문서 상태
  const [employees, setEmployees] = useState([]); // 직원 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태 추가

  // 문서 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const headers = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };

        const documentResponse = await axios.get(
          `http://localhost:8080/api/documents/${dno}`, // dno를 이용한 API 요청
          headers
        );

        setDocument(documentResponse.data); // 문서 데이터 설정
        setLoading(false);
      } catch (error) {
        console.error(error); // 오류를 콘솔에 로그
        setError("데이터를 불러오는 중 오류가 발생했습니다."); // 오류 메시지 설정
        setLoading(false);
      }
    };

    fetchData();
  }, [dno]); // dno에 따라 새로고침

  // 직원 데이터 가져오기
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
      setEmployees(employeeResponse.data); // 직원 데이터 설정
    };
    fetchData();
  }, []);

  // writer와 enb가 일치하는 직원의 이름을 찾는 함수
  const findEmployeeName = (writer) => {
    const employee = employees.find((emp) => String(emp.enb) === writer);
    return employee ? employee.name : "알 수 없음"; // 이름이 없으면 "알 수 없음" 출력
  };

  // 문서 삭제 함수
  const handleDelete = async () => {
    const jwtToken = localStorage.getItem("jwt");
    const headers = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      await axios.delete(`http://localhost:8080/api/documents/${dno}`, headers); // 문서 삭제 요청
      alert("문서가 삭제되었습니다."); // 삭제 성공 메시지
      navigate("/documents/"); // 문서 목록 페이지로 이동
    } catch (error) {
      console.error(error);
      alert("문서 삭제 중 오류가 발생했습니다."); // 삭제 오류 메시지
    }
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중 메시지
  }

  if (error) {
    return <div>{error}</div>; // 오류 메시지
  }

  if (!document) {
    return <div>문서를 찾을 수 없습니다.</div>; // 문서가 없을 경우
  }

  return (
    <div className="document-page">
      <NavBar />
      <div className="document-content">
        <h1>{document.title}</h1>
        <p>작성자: {findEmployeeName(document.writer)}</p>{" "}
        {/* 작성자 이름 출력 */}
        <p>작성일: {document.createDate}</p>
        <p>내용: {document.content}</p>
        {/* 첨부파일 리스트 출력 */}
        <h2>첨부파일</h2>
        {document.uploadFileNames && document.uploadFileNames.length > 0 ? (
          <ul>
            {document.uploadFileNames.map((fileName, index) => {
              const downloadFileName = fileName.split("_").pop();
              return (
                <li key={index}>
                  <a
                    className="text-blue-600 hover:underline"
                    href={`http://localhost:8080/api/documents/download/${encodeURIComponent(
                      fileName
                    )}`}
                    download={downloadFileName}
                  >
                    {downloadFileName}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>첨부파일이 없습니다.</p>
        )}
        {/* 삭제 버튼 추가 */}
        <button className="delete-button" onClick={handleDelete}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default DocumentDetail;
