import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateDetails: (data) => api.put('/auth/updatedetails', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  logout: () => api.get('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgotpassword', data),
  resetPassword: (data) => api.post('/auth/resetpassword', data),
  verifyOTP: (data) => api.post('/auth/verifyotp', data),
};

// User API
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
};

// Student API
export const studentAPI = {
  getStudents: (params) => api.get('/students', { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  getStudentByUserId: (userId) => api.get(`/students/user/${userId}`),
  getStudentProfile: () => api.get('/students/profile'),
  updateStudentProfile: (profileData) => api.put('/students/profile', profileData),
  getStudentEnrollments: () => api.get('/students/enrollments'),
  getAvailableSubjects: () => api.get('/students/available-subjects'),
  enrollInSubject: (enrollmentData) => api.post('/students/enroll', enrollmentData),
  dropSubject: (enrollmentId) => api.delete(`/students/enroll/${enrollmentId}`),
  getEnrollmentStats: () => api.get('/students/enrollments/stats'),
  getStudentTimetable: (params) => api.get('/students/timetable', { params }),
  getStudentAttendance: (params) => api.get('/students/attendance', { params }),
  getStudentNotices: (params) => api.get('/students/notices', { params }),
  getStudyMaterials: (params) => api.get('/students/study-materials', { params }),
  downloadStudyMaterial: (materialId) => api.get(`/students/study-materials/${materialId}/download`, { responseType: 'blob' }),
  getStudentQueries: () => api.get('/students/queries'),
  submitQuery: (queryData) => api.post('/students/queries', queryData),
  getJobPostings: () => api.get('/students/job-postings'),
  getPlacementStats: () => api.get('/students/placement-stats'),
  applyForJob: (jobId) => api.post('/students/job-applications', { jobId }),
};

// Department API
export const departmentAPI = {
  getDepartments: (params) => api.get('/departments', { params }),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (departmentData) => api.post('/departments', departmentData),
  updateDepartment: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};

// Course API
export const courseAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Faculty API
export const facultyAPI = {
  getFaculty: (params) => api.get('/faculty', { params }),
  getFacultyById: (id) => api.get(`/faculty/${id}`),
  createFaculty: (facultyData) => api.post('/faculty', facultyData),
  updateFaculty: (id, facultyData) => api.put(`/faculty/${id}`, facultyData),
  deleteFaculty: (id) => api.delete(`/faculty/${id}`),
  getFacultyByUserId: (userId) => api.get(`/faculty/user/${userId}`),
  getFacultyStats: (userId) => api.get(`/faculty/stats/${userId}`),
  getAssignedQueries: (params) => api.get(`/faculty/queries/${params.userId}`, { params }),
  respondToQuery: (queryId, responseData) => api.put(`/faculty/queries/${queryId}/respond`, responseData),
  getFacultyTimetable: () => api.get(`/faculty/timetable/${JSON.parse(localStorage.getItem('user')).id}`),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getPendingApprovals: () => api.get('/admin/pending-approvals'),
  approveStudent: (studentId, approvalData) => api.put(`/admin/approve-student/${studentId}`, approvalData),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserPermissions: (userId, permissionData) => api.put(`/admin/users/${userId}/permissions`, permissionData),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
};

// Attendance API
export const attendanceAPI = {
  getStudentAttendance: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getSubjectAttendance: (subjectId, params) => api.get(`/attendance/subject/${subjectId}`, { params }),
  getEnrolledStudents: (subjectId) => api.get(`/attendance/subject/${subjectId}/students`),
  markAttendance: (attendanceData) => api.post('/attendance', attendanceData),
  bulkMarkAttendance: (bulkData) => api.post('/attendance/bulk', bulkData),
  getAttendanceStats: (studentId, params) => api.get(`/attendance/stats/${studentId}`, { params }),
};

// Notices API
export const noticeAPI = {
  getNotices: (params) => api.get('/notices', { params }),
  getNotice: (id) => api.get(`/notices/${id}`),
  createNotice: (noticeData) => api.post('/notices', noticeData),
  updateNotice: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
  getNoticeCategories: () => api.get('/notices/categories'),
};

export default api;