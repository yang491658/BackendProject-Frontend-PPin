import React from 'react';
import Profile from '../components/Profile';
import NavBar from '../components/NavBar';
// 다른 설정 컴포넌트들도 여기서 import

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <NavBar />
      <h2>설정</h2>
      <section>
        <h3>사용자 계정 관리</h3>
        <Profile />  {/* 프로필 관리 컴포넌트 */}
      </section>

      {/* 다른 설정 항목들도 같은 방식으로 추가 */}
      <section>
        <h3>알림 설정</h3>
        {/* 알림 설정 컴포넌트 추가 */}
      </section>

      <section>
        <h3>테마 및 레이아웃</h3>
        {/* 다크모드/라이트모드 설정 */}
      </section>
    </div>
  );
};

export default SettingsPage;