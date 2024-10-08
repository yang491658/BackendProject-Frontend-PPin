import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrganizationChart.css';
import NavBar from '../components/NavBar';

const OrganizationChart = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await axios.get('/employee/all');
        const companyResponse = await axios.get('/employee/companies');

        console.log('Employee Data:', employeeResponse.data);
        console.log('Company Data:', companyResponse.data);

        setEmployees(employeeResponse.data);
        setCompanies(companyResponse.data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다!', error);
      }
    };

    fetchData();
  }, []);

  const getPosition = (companyId) => {
    const company = companies.find(c => c.cnb === companyId);
    return company ? company.position : '직책 없음';
  };

  const getDepartment = (companyId) => {
    const company = companies.find(c => c.cnb === companyId);
    return company ? company.department : '부서 없음';
  };

  const getSubordinates = (managerId) => {
    return employees.filter(employee => {
      const isSubordinate =
        (managerId === 100 && employee.companyId === 201) || // CEO의 비서
        (managerId === 100 && (employee.companyId >= 301 && employee.companyId <= 306)) || // 1팀 부서장
        (managerId === 301 && (employee.companyId === 302)) || // 1팀 팀장
        (managerId === 302 && (employee.companyId === 303)) || // 1팀 담당자
        (managerId === 100 && (employee.companyId >= 401 && employee.companyId <= 406)) || // 2팀 부서장
        (managerId === 401 && (employee.companyId === 402)) || // 2팀 팀장
        (managerId === 402 && (employee.companyId === 403)) || // 2팀 담당자
        (managerId === 100 && (employee.companyId >= 501 && employee.companyId <= 506)) || // 3팀 부서장
        (managerId === 501 && (employee.companyId === 502)) || // 3팀 팀장
        (managerId === 502 && (employee.companyId === 503)) || // 3팀 담당자
        (managerId === 100 && (employee.companyId >= 601 && employee.companyId <= 606)); // 4팀 부서장

      return isSubordinate;
    });
  };

  const getSubordinatesExcludingInternsAndContractors = (managerId) => {
    return getSubordinates(managerId).filter(employee => {
      const position = getPosition(employee.companyId);
      return position !== '인턴' && position !== '계약직';
    });
  };

  const renderEmployeeNode = (employee) => (
    <div className="employee-node" key={employee.enb}>
      <NavBar />
      <div className="employee-info">
        <p>{employee.name}</p>
        <p>{getPosition(employee.companyId)}</p>
        <p>{getDepartment(employee.companyId)}</p>
        <p>전화번호: {employee.phoneNum}</p>
      </div>
    </div>
  );

  const renderDepartmentHeads = () => {
    const departmentHeads = getSubordinates(100); // 부서장 가져오기
    return (
      <div className="employee-group">
        {departmentHeads.map(renderEmployeeNode)}
      </div>
    );
  };

  const renderTeamLeads = (departmentHeadId) => {
    const teamLeads = getSubordinates(departmentHeadId);
    return (
      <div className="team-leads-row">
        {teamLeads.map((teamLead) => (
          <div key={teamLead.enb}>
            {renderEmployeeNode(teamLead)}
            {renderEmployees(teamLead.companyId)} {/* 팀장 아래 담당자 렌더링 */}
          </div>
        ))}
      </div>
    );
  };

  const renderEmployees = (managerId) => {
    const employeesUnderManager = getSubordinates(managerId);
    return (
      <div className="subordinates-row">
        {employeesUnderManager.map(renderEmployeeNode)}
      </div>
    );
  };

  const renderOrganizationChart = () => {
    return (
      <div className="organization-chart">
        <div className="ceo">
          {renderEmployeeNode({ name: 'CEO', companyId: 100 })} {/* CEO 표시 */}
        </div>
        <div className="managers-row">
          {renderDepartmentHeads()} {/* 부서장 렌더링 */}
        </div>
        <div className="team-leads">
          {getSubordinates(100).map((manager) => renderTeamLeads(manager.companyId))} {/* 팀장 렌더링 */}
        </div>
      </div>
    );
  };

  return (
    <div>
      {employees.length > 0 ? renderOrganizationChart() : <p>No data available</p>}
    </div>
  );
};

export default OrganizationChart;