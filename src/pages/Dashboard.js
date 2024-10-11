import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaLock, FaUnlock } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import NavBar from '../components/NavBar';
import CalendarComponent from '../components/Calendar';
import Board from '../components/Board';
import Mailbox from '../components/Mailbox';
import Profile from '../components/Profile';
import WeatherWidget from '../components/WeatherWidget';
import ExchangeRateWidget from '../components/ExchangeRateWidget';
import MySalaryWidget from '../components/MySalaryWidget';

import '../styles/Dashboard.css';
import '../styles/NavBar.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: 'calendar', x: 0, y: 0, w: 3, h: 3 },
    { i: 'board', x: 3, y: 0, w: 3, h: 3 },
    { i: 'mailbox', x: 6, y: 0, w: 3, h: 3 },
    { i: 'profile', x: 9, y: 0, w: 3, h: 3 },
    { i: 'weather', x: 0, y: 1, w: 3, h: 3 },
    { i: 'exchangeRate', x: 3, y: 1, w: 3, h: 3 },
  ],
};

const availableWidgets = [
  { id: 'calendar', name: '캘린더', component: <CalendarComponent /> },
  { id: 'board', name: '게시판', component: <Board /> },
  { id: 'mailbox', name: '편지함', component: <Mailbox /> },
  { id: 'profile', name: '프로필', component: <Profile /> },
  { id: 'weather', name: '날씨', component: <WeatherWidget /> },
  { id: 'exchangeRate', name: '환율', component: <ExchangeRateWidget /> },
  { id: 'mySalary', name: '내 급여', component: <MySalaryWidget /> },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeWidgets, setActiveWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('activeWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : ['calendar', 'board', 'mailbox', 'profile', 'weather', 'exchangeRate'];
  });

  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts;
  });

  const [isLocked, setIsLocked] = useState(false);
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userDepartment, setUserDepartment] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openWidgetSelector = () => setIsWidgetSelectorOpen(true);
  const closeWidgetSelector = () => setIsWidgetSelectorOpen(false);

  const generateDefaultLayoutItem = (widgetId) => ({
    i: widgetId,
    x: 0,
    y: activeWidgets.length > 0 ? activeWidgets.length : 0,
    w: 3,
    h: 3,
  });

  const handleAddWidget = (widgetId) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets([...activeWidgets, widgetId]);
      const newLayouts = { ...layouts };
      Object.keys(newLayouts).forEach((breakpoint) => {
        newLayouts[breakpoint] = [
          ...newLayouts[breakpoint],
          generateDefaultLayoutItem(widgetId),
        ];
      });
      setLayouts(newLayouts);
    }
    closeWidgetSelector();
  };

  const handleRemoveWidget = (widgetId) => {
    setActiveWidgets(activeWidgets.filter((id) => id !== widgetId));
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach((breakpoint) => {
      newLayouts[breakpoint] = newLayouts[breakpoint].filter(
        (layout) => layout.i !== widgetId
      );
    });
    setLayouts(newLayouts);
  };

  const onLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  };

  useEffect(() => {
    localStorage.setItem('activeWidgets', JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  const getUserInfo = async () => {
    const token = localStorage.getItem('jwt');
    const empID = localStorage.getItem('empID'); // empID 가져오기

    try {
      // 1. 특정 empID에 대한 직원 정보 가져오기
      const employeeResponse = await axios.get(`http://localhost:8080/employee/${empID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { companyId, name } = employeeResponse.data; // 직원 정보에서 companyId와 이름 가져오기
      setUserName(name); // 사용자 이름 설정

      // 2. 회사 정보 가져오기
      const companyResponse = await axios.get(`http://localhost:8080/employee/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const companyData = companyResponse.data.find(company => company.cnb === companyId);

      if (companyData) {
        setUserDepartment(companyData.department); // 부서 설정
        setUserRole(companyData.position); // 직급 설정
      } else {
        console.error('회사를 찾을 수 없습니다.');
      }
    } catch (error) {
      if (error.response) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error.response.data);
      } else {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error.message);
      }
    }
  };

  useEffect(() => {
    getUserInfo(); 
  }, []);

  const handleLogout = () => {
    navigate('/'); 
  };

  return (
    <div className="dashboard-container">
      <NavBar onLogout={handleLogout} toggleNavbar={toggleNavbar} isCollapsed={isCollapsed} />
      
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-header">
          <div className="user-info">
            <h2>{userDepartment} {userRole} {userName}님</h2>
          </div>
          <div className="top-buttons">
            <button
              className="lock-button"
              onClick={toggleLock}
              aria-label={isLocked ? 'Unlock Widgets' : 'Lock Widgets'}
            >
              {isLocked ? <FaLock /> : <FaUnlock />}
            </button>
          </div>
        </div>

        <button className="add-widget-button" onClick={openWidgetSelector}>
          위젯 추가
        </button>

        <Modal
          isOpen={isWidgetSelectorOpen}
          onRequestClose={closeWidgetSelector}
          contentLabel="위젯 선택"
          className="widget-modal"
          overlayClassName="widget-modal-overlay"
        >
          <h2>추가할 위젯을 선택하세요</h2>
          <ul>
            {availableWidgets.map(widget => (
              !activeWidgets.includes(widget.id) && (
                <li key={widget.id}>
                  <button onClick={() => handleAddWidget(widget.id)}>
                    {widget.name}
                  </button>
                </li>
              ))
            )}
          </ul>
          <button onClick={closeWidgetSelector}>닫기</button>
        </Modal>

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
          rowHeight={100}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          isDraggable={!isLocked}
          isResizable={!isLocked}
        >
          {activeWidgets.map(widgetId => {
            const widget = availableWidgets.find(w => w.id === widgetId);
            return (
              <div key={widget.id} className="widget">
                <div className={`widget-header ${isLocked ? 'widget-header-locked' : ''}`}>
                  <span className="drag-handle">☰</span>
                  <span className="widget-title">{widget.name}</span>
                  {!isLocked && (
                    <button
                      className="remove-widget-button"
                      onClick={() => handleRemoveWidget(widgetId)}
                      aria-label={`Remove ${widget.name}`}
                    >
                      ×
                    </button>
                  )}
                </div>
                {widget.component}
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Dashboard;
