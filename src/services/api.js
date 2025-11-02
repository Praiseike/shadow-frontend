const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
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
}

export default new ApiService();