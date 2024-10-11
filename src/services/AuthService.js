// // AuthService.js: 인증 관련 메서드 구현

// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// const AuthService = {
//   refreshToken: async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) throw new Error('No refresh token available');

//       const response = await axios.post(`${API_BASE_URL}/api/member/refresh`, null, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         params: {
//           refreshToken: refreshToken,
//         },
//       });
//       if (response.data.accessToken) {
//         localStorage.setItem('accessToken', response.data.accessToken);
//       }
//       return response;
//     } catch (error) {
//       console.error('Error refreshing token:', error);
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/member/login`, credentials);
//       if (response.data.accessToken && response.data.refreshToken) {
//         localStorage.setItem('accessToken', response.data.accessToken);
//         localStorage.setItem('refreshToken', response.data.refreshToken);
//       }
//       return response;
//     } catch (error) {
//       console.error('Error during login:', error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//   },
// };

// export default AuthService;
