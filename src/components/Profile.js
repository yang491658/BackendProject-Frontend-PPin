// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const employeeResponse = await axios.get('http://localhost:8080/employee/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allEmployees = employeeResponse.data;
        const currentUser = allEmployees.find(emp => emp.empID === localStorage.getItem('empID'));

        if (currentUser) {
          const { companyId, name, email } = currentUser;

          const companyResponse = await axios.get(`http://localhost:8080/employee/companies`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const companyData = companyResponse.data.find(company => company.cnb === companyId);

          if (companyData) {
            setProfile({
              name,
              email,
              department: companyData.department,
              role: companyData.position,
            });
          }
        }
      } catch (error) {
        console.error('프로필 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="profile-container">
      <h3>내 정보</h3>
      <p><strong>이름:</strong> {profile.name}</p>
      <p><strong>이메일:</strong> {profile.email}</p>
      <p><strong>부서:</strong> {profile.department}</p>
      <p><strong>직급:</strong> {profile.role}</p>
    </div>
  );
};

export default Profile;