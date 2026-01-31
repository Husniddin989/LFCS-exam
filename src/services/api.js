/**
 * API Service for LFCS Platform
 * Handles all communication with the backend API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Token storage
let accessToken = localStorage.getItem('lfcs-access-token');
let refreshToken = localStorage.getItem('lfcs-refresh-token');

// Set tokens
export const setTokens = (tokens) => {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  localStorage.setItem('lfcs-access-token', tokens.accessToken);
  localStorage.setItem('lfcs-refresh-token', tokens.refreshToken);
};

// Clear tokens
export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('lfcs-access-token');
  localStorage.removeItem('lfcs-refresh-token');
};

// Check if user is logged in
export const isAuthenticated = () => !!accessToken;

// Base request function
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && refreshToken) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry the request with new token
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      return handleResponse(retryResponse);
    } else {
      // Refresh failed, clear tokens
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  return handleResponse(response);
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

async function tryRefreshToken() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.data.tokens);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// API methods
export const api = {
  // ============ Auth ============
  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: async (data) => {
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result.success && result.data.tokens) {
      setTokens(result.data.tokens);
    }
    return result;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  getProfile: () => request('/auth/me'),

  updateProfile: (data) =>
    request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  verifyEmail: (token) =>
    request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  // ============ Modules ============
  getModules: () => request('/modules'),

  getModule: (id) => request(`/modules/${id}`),

  // ============ Lessons ============
  getLesson: (id) => request(`/lessons/${id}`),

  getLessonSolution: (lessonId, taskId) =>
    request(`/lessons/${lessonId}/solution?taskId=${taskId}`),

  // ============ Progress ============
  getProgress: () => request('/progress'),

  completeLesson: (lessonId, moduleId, data = {}) =>
    request('/progress/lesson', {
      method: 'POST',
      body: JSON.stringify({ lessonId, moduleId, ...data }),
    }),

  completeLab: (lessonId, moduleId, data = {}) =>
    request('/progress/lab', {
      method: 'POST',
      body: JSON.stringify({ lessonId, moduleId, ...data }),
    }),

  submitQuiz: (lessonId, moduleId, answers) =>
    request('/progress/quiz', {
      method: 'POST',
      body: JSON.stringify({ lessonId, moduleId, answers }),
    }),

  resetProgress: () => request('/progress', { method: 'DELETE' }),

  // ============ Exam Domains ============
  getExamDomains: () => request('/exam-domains'),

  // ============ Stats ============
  getStats: () => request('/stats'),

  // ============ Health ============
  health: () => request('/health'),
};

export default api;
