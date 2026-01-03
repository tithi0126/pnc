// MongoDB API client - simplified to only use HTTP requests
import { ServiceService } from '@/services/serviceService';
import { TestimonialService } from '@/services/testimonialService';
import { AwardsService } from '@/services/awardsService';
import { GalleryService } from '@/services/galleryService';
import { ContactInquiryService } from '@/services/contactInquiryService';
import { UserService } from '@/services/userService';
import { SettingsService } from '@/services/settingsService';
import { AuthService } from '@/services/authService';

// HTTP API client for backend requests
class HttpApiClient {
  private baseUrl = import.meta.env.VITE_API_BASE_URL 
  || 'https://pncapi.aangandevelopers.com/api'
  // ||  'http://localhost:5003/api'
  ;

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to backend server');
      }
      throw error;
    }
  }

  async get(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const httpClient = new HttpApiClient();

// Services API using MongoDB backend
export const servicesAPI = {
  async getAll() {
    return await httpClient.get('/services/active');
  },

  async getAllAdmin() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ServiceService.getAllServices();
  },

  async getById(id: string) {
    return await httpClient.get(`/services/${id}`);
  },

  async create(data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ServiceService.createService(data, token);
  },

  async update(id: string, data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ServiceService.updateService(id, data, token);
  },

  async delete(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ServiceService.deleteService(id, token);
  },
};

export const testimonialsAPI = {
  async getAll() {
    return await httpClient.get('/testimonials/approved');
  },

  async getAllAdmin() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await TestimonialService.getAllTestimonials(token);
  },

  async getById(id: string) {
    return await httpClient.get(`/testimonials/${id}`);
  },

  async create(data: any) {
    return await TestimonialService.createTestimonial(data);
  },

  async update(id: string, data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await TestimonialService.updateTestimonial(id, data, token);
  },

  async delete(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await TestimonialService.deleteTestimonial(id, token);
  },

  async toggleApproval(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await TestimonialService.toggleApproval(id, token);
  },

  async toggleFeatured(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await TestimonialService.toggleFeatured(id, token);
  },
};

export const galleryAPI = {
  async getAll() {
    return await httpClient.get('/gallery');
  },

  async getAllAdmin() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await GalleryService.getAllImages(token);
  },

  async getById(id: string) {
    return await httpClient.get(`/gallery/${id}`);
  },

  async create(data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await GalleryService.createImage(data, token);
  },

  async update(id: string, data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await GalleryService.updateImage(id, data, token);
  },

  async delete(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await GalleryService.deleteImage(id, token);
  },

  async toggleActive(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await GalleryService.toggleActive(id, token);
  },
};

export const contactAPI = {
  async submit(data: any) {
    return await ContactInquiryService.createInquiry(data);
  },

  async getAllAdmin() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ContactInquiryService.getAllInquiries(token);
  },

  async getById(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    const inquiries = await ContactInquiryService.getAllInquiries(token);
    return inquiries.find(i => i._id === id);
  },

  async update(id: string, data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ContactInquiryService.updateInquiry(id, data, token);
  },

  async updateStatus(id: string, status: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ContactInquiryService.updateStatus(id, status, token);
  },

  async updateNotes(id: string, notes: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ContactInquiryService.updateNotes(id, notes, token);
  },

  async delete(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await ContactInquiryService.deleteInquiry(id, token);
  },
};

export const usersAPI = {
  async getAll() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await UserService.getAllUsers(token);
  },

  async getById(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    const users = await UserService.getAllUsers(token);
    return users.find(u => u._id === id);
  },

  async promoteToAdmin(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await UserService.promoteToAdmin(id, token);
  },

  async demoteFromAdmin(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await UserService.demoteFromAdmin(id, token);
  },

  async activate(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await UserService.activateUser(id, token);
  },

  async deactivate(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await UserService.deactivateUser(id, token);
  },
};

export const settingsAPI = {
  async getAll() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await SettingsService.getAllSettings(token);
  },

  async getPublic() {
    return await SettingsService.getPublicSettings();
  },

  async getByKey(key: string, defaultValue = '') {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    const value = await SettingsService.getSetting(key, token);
    return value || defaultValue;
  },

  async update(settings: Record<string, any>) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await SettingsService.updateSettings(settings, token);
  },

  async updateByKey(key: string, value: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await SettingsService.updateSetting(key, value, token);
  },
};

export const awardsAPI = {
  async getAll() {
    return await httpClient.get('/awards/active');
  },

  async getAllAdmin() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await AwardsService.getAllAwards(token);
  },

  async getById(id: string) {
    return await httpClient.get(`/awards/${id}`);
  },

  async create(data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await AwardsService.createAward(data, token);
  },

  async update(id: string, data: any) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await AwardsService.updateAward(id, data, token);
  },

  async delete(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await AwardsService.deleteAward(id, token);
  },

  async toggleStatus(id: string) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');
    return await AwardsService.toggleAwardStatus(id, token);
  },
};

