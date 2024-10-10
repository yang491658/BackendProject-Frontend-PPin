import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrganizationChart.css';
import NavBar from '../components/NavBar';

const OrganizationChart = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem('jwt');
        const headers = { 
          headers: {
            Authorization: `Bearer ${jwtToken}` 
          }
        };

        const employeeResponse = await axios.get('http://localhost:8080/employee/all', headers);
        const companyResponse = await axios.get('http://localhost:8080/employee/companies', headers);

        if (Array.isArray(employeeResponse.data)) {
          setEmployees(employeeResponse.data);
        } else {
          setEmployees([]);
        }

        setCompanies(companyResponse.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
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
      // 각 부서별로 상사에 따른 하위 직원을 가져옴
      return (managerId === 201 && employee.companyId === 202) ||
        (managerId === 202 && employee.companyId === 203) ||
        (managerId === 301 && employee.companyId === 302) ||
        (managerId === 302 && employee.companyId === 303) ||
        (managerId === 303 && employee.companyId === 304) ||
        (managerId === 401 && employee.companyId === 402) ||
        (managerId === 402 && employee.companyId === 403) ||
        (managerId === 403 && employee.companyId === 404) ||
        (managerId === 501 && employee.companyId === 502) ||
        (managerId === 502 && employee.companyId === 503) ||
        (managerId === 503 && employee.companyId === 504) ||
        (managerId === 601 && employee.companyId === 602) ||
        (managerId === 602 && employee.companyId === 603) ||
        (managerId === 603 && employee.companyId === 604);
    });
  };

  const renderEmployeeNode = (employee) => (
    <div className="employee-node" key={employee.enb || employee.companyId}>
      <div className="employee-info">
        <p>{employee.name}</p>
        <p>{getPosition(employee.companyId)}</p>
        <p>{getDepartment(employee.companyId)}</p>
        <p>번호: {employee.phoneNum || 'N/A'}</p>
      </div>
    </div>
  );

  const renderOrganizationChart = () => {
    // employees 배열에서 CEO 정보를 가져오기
    const ceo = employees.find(employee => employee.companyId === 100); // employees 배열에서 CEO를 찾음
  
    const firstRowEmployees = employees.filter(
      employee => [201, 301, 401, 501, 601].includes(employee.companyId)
    );
  
    return (
      <div className="organization-chart">
        <div className="ceo-row">
          {ceo ? renderEmployeeNode(ceo) : renderEmployeeNode({ name: 'CEO 없음', companyId: 100, phoneNum: 'N/A' })} {/* CEO 표시 */}
        </div>
  
        <div className="first-row">
          {firstRowEmployees.map((firstRowEmployee) => (
            <div key={firstRowEmployee.companyId} className="department-column">
              {renderEmployeeNode(firstRowEmployee)} {/* 부서장 */}
              <div className="second-row">
                {getSubordinates(firstRowEmployee.companyId).length > 0 ? (
                  getSubordinates(firstRowEmployee.companyId).map((secondRowEmployee) => (
                    <div key={secondRowEmployee.companyId} className="subordinate">
                      {renderEmployeeNode(secondRowEmployee)} {/* 팀장 */}
                      <div className="third-row">
                        {getSubordinates(secondRowEmployee.companyId).map((thirdRowEmployee) => (
                          <div key={thirdRowEmployee.companyId}>
                            {renderEmployeeNode(thirdRowEmployee)} {/* 팀원 */}
                            <div className="fourth-row">
                              {/* 304, 404, 504, 604 표시 */}
                              {getSubordinates(thirdRowEmployee.companyId).map((fourthRowEmployee) => (
                                <div key={fourthRowEmployee.companyId}>
                                  {renderEmployeeNode(fourthRowEmployee)} {/* 4번째 팀원 */}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p></p> // 하위 직원이 없는 경우 표시
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <NavBar />
      {loading ? <p>로딩 중...</p> : employees.length > 0 ? renderOrganizationChart() : <p>No data available</p>}
    </div>
  );
};

export default OrganizationChart;