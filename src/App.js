// src/App.js
import React from 'react';
import Dashboard from './Dashboard';
import './App.css'; // App 컴포넌트 전역 CSS 임포트

const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '20px 0' }}>나의 대시보드</h1>
      <Dashboard />
    </div>
  );
};

export default App;