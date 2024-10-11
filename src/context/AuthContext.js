// import React, { createContext, useState, useEffect } from 'react';
// import AuthService from '../services/AuthService';

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (accessToken && refreshToken) {
//       AuthService.refreshToken()
//         .then((response) => {
//           setUser({ accessToken: response.data.accessToken });
//         })
//         .catch(() => {
//           AuthService.logout();
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await AuthService.login(credentials);
//       if (response.data.accessToken) {
//         setUser({ accessToken: response.data.accessToken });
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   const logout = () => {
//     AuthService.logout();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
