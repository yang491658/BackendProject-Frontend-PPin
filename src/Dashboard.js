import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaLock, FaUnlock } from 'react-icons/fa'; // Font Awesome 아이콘 임포트

import CalendarComponent from './components/Calendar';
import Board from './components/Board';
import Mailbox from './components/Mailbox';
import Profile from './components/Profile';

import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const layouts = {
  lg: [
    { i: 'calendar', x: 0, y: 0, w: 3, h: 2 },
    { i: 'board', x: 3, y: 0, w: 3, h: 2 },
    { i: 'mailbox', x: 6, y: 0, w: 3, h: 2 },
    { i: 'profile', x: 9, y: 0, w: 3, h: 2 },
  ],
  md: [
    { i: 'calendar', x: 0, y: 0, w: 6, h: 2 },
    { i: 'board', x: 6, y: 0, w: 6, h: 2 },
    { i: 'mailbox', x: 0, y: 2, w: 6, h: 2 },
    { i: 'profile', x: 6, y: 2, w: 6, h: 2 },
  ],
  sm: [
    { i: 'calendar', x: 0, y: 0, w: 12, h: 2 },
    { i: 'board', x: 0, y: 2, w: 12, h: 2 },
    { i: 'mailbox', x: 0, y: 4, w: 12, h: 2 },
    { i: 'profile', x: 0, y: 6, w: 12, h: 2 },
  ],
};

const Dashboard = () => {
  const [currentLayouts, setCurrentLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    return savedLayouts ? JSON.parse(savedLayouts) : layouts;
  });

  const [isLocked, setIsLocked] = useState(false); // 잠금 상태 추가

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const onLayoutChange = (currentLayout, allLayouts) => {
    setCurrentLayouts(allLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  };

  return (
    <div>
      <button className="lock-button" onClick={toggleLock} aria-label={isLocked ? 'Unlock Widgets' : 'Lock Widgets'}>
        {isLocked ? <FaLock /> : <FaUnlock />}
      </button>
      <ResponsiveGridLayout
        className="layout"
        layouts={currentLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-header"
        isDraggable={!isLocked}
        isResizable={!isLocked}
      >
        <div key="calendar" className="widget">
          <div className={`widget-header ${isLocked ? 'widget-header-locked' : ''}`}>캘린더</div>
          <CalendarComponent />
        </div>
        <div key="board" className="widget">
          <div className={`widget-header ${isLocked ? 'widget-header-locked' : ''}`}>게시판</div>
          <Board />
        </div>
        <div key="mailbox" className="widget">
          <div className={`widget-header ${isLocked ? 'widget-header-locked' : ''}`}>편지함</div>
          <Mailbox />
        </div>
        <div key="profile" className="widget">
          <div className={`widget-header ${isLocked ? 'widget-header-locked' : ''}`}>내 정보</div>
          <Profile />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;