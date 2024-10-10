import NavBar from '../components/NavBar'; // 네비게이션 바 컴포넌트
import MySalaryWidget from '../components/MySalaryWidget';
import '../styles/MySalaryPage.css'; // 스타일 추가

const MySalaryPage = () => {
  return (
    <div className="my-salary-page">
      <NavBar />
      <div className="salary-content">
        <MySalaryWidget />
      </div>
    </div>
  );
};

export default MySalaryPage;