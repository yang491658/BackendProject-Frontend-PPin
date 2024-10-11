import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import NavBar from "../components/NavBar"; // 네비바 컴포넌트 가져오기
import "../styles/DocumentPage.css"; // DocumentPage에 대한 사용자 정의 스타일
import axios from "axios";

const DocumentPage = () => {
  const navigate = useNavigate(); // navigate 함수 초기화
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 오류 상태 추가

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
          "http://localhost:8080/api/documents/list",
          headers
        );
        setDocuments(documentResponse.data); // 합쳐진 데이터를 상태에 설정
        setLoading(false);
      } catch (error) {
        console.error(error); // 오류를 콘솔에 로그
        setError("데이터를 불러오는 중 오류가 발생했습니다."); // 오류 메시지 설정
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 문서 작성 페이지로 이동하는 함수
  const handleCreateDocument = () => {
    navigate("/documents/create"); // 문서 작성 페이지로 이동
  };

  console.log(documents);

  return (
    <div className="document-page">
      <NavBar />
      <div className="document-content">
        <h1>문서함</h1>
        <button
          className="create-document-button"
          onClick={handleCreateDocument}
        >
          문서 작성
        </button>
        <table className="document-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성시간</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.dno}>
                <td>{document.title}</td>
                <td>{document.writer}</td>
                <td>
                  {new Date() - new Date(document.createDate) <
                  24 * 60 * 60 * 60
                    ? document.createDate.split("T")[1].slice(0, 5)
                    : document.createDate.split("T")[0].replace(/-/g, ".")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentPage;
