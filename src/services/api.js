import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.navigate = null;
  }

  setNavigate(navigate) {
    this.navigate = navigate;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint ?? ''}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available and not explicitly skipped
    if (!options.skipAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }


    const exceptions = ['/','/auth', '/admin/dashboard']


    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401 && !exceptions.includes(window.location.pathname)) {
          // Clear user data
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');

          // Redirect to login if navigate is available
          if (this.navigate) {
            this.navigate('/auth');
          } else {
            // Fallback: redirect using window.location
            window.location.href = '/auth';
          }
        }

        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async googleAuth(googleData) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Social endpoints
  async initiateSocialAuth(platform) {
    return this.request(`/social/auth/${platform}`);
  }

  async connectSocial(platform, data) {
    return this.request(`/social/connect/${platform}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async disconnectSocial(platform) {
    return this.request(`/social/disconnect/${platform}`, {
      method: 'DELETE',
    });
  }

  async getSocialConnections() {
    return this.request('/social/connections');
  }

  // Schedule endpoints
  async createOrUpdateSchedule(scheduleData) {
    return this.request('/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async getSchedule() {
    return this.request('/schedules');
  }

  async toggleSchedule() {
    return this.request('/schedules/toggle', {
      method: 'PUT',
    });
  }

  async deleteSchedule() {
    return this.request('/schedules', {
      method: 'DELETE',
    });
  }

  // Topic endpoints
  async addTopic(topic) {
    return this.request('/topics', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  }

  async removeTopic(topicId) {
    return this.request(`/topics/${topicId}`, {
      method: 'DELETE',
    });
  }

  async getTopics() {
    return this.request('/topics');
  }

  async updateTopics(topics) {
    return this.request('/topics', {
      method: 'PUT',
      body: JSON.stringify({ topics }),
    });
  }

  async getPredefinedTopics() {
    return this.request('/topics/predefined');
  }

  async getTopicSuggestions() {
    return this.request('/topics/suggestions');
  }

  // Content endpoints
  async generateContent(data) {
    return this.request('/content/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateContentWithTopic(data) {
    return this.request('/content/generate-topic', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getContentHistory() {
    return this.request('/content/history');
  }

  async getContentAnalytics() {
    return this.request('/content/analytics');
  }

  async saveDraft(draftData) {
    return this.request('/content/drafts', {
      method: 'POST',
      body: JSON.stringify(draftData),
    });
  }

  async getDrafts() {
    return this.request('/content/drafts');
  }

  async deleteDraft(draftId) {
    return this.request(`/content/drafts/${draftId}`, {
      method: 'DELETE',
    });
  }

  // Plan endpoints
  async getPlans() {
    return this.request('/plans');
  }

  async subscribeToPlan(plan) {
    return this.request('/plans/subscribe', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  async getUserPlan() {
    return this.request('/plans/user');
  }

  async createStripePaymentIntent(planId) {
    return this.request('/plans/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  // Dashboard endpoints
  async getDashboardOverview(requireAuth = false) {
    // Skip auth for admin dashboard (open route)
    return this.request('/dashboard/overview', { skipAuth: !requireAuth });
  }

  // Scheduled posts endpoints (manual scheduling)
  async createScheduledPost(postData) {
    return this.request('/posts/schedule', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getScheduledPosts(status = null, page = 1, limit = 20) {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    return this.request(`/posts/scheduled?${params}`);
  }

  async getScheduledPost(id) {
    return this.request(`/posts/scheduled/${id}`);
  }

  async updateScheduledPost(id, postData) {
    return this.request(`/posts/scheduled/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async cancelScheduledPost(id) {
    return this.request(`/posts/scheduled/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();