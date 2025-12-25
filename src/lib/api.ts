// Dynamic API client that switches between localStorage and HTTP requests
import { ServiceService } from '@/services/serviceService';
import { TestimonialService } from '@/services/testimonialService';
import { GalleryService } from '@/services/galleryService';
import { ContactInquiryService } from '@/services/contactInquiryService';
import { UserService } from '@/services/userService';
import { SettingsService } from '@/services/settingsService';
import { AuthService } from '@/services/authService';

// Check if backend is available
const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// API mode: 'localStorage' or 'http'
let apiMode: 'localStorage' | 'http' = 'localStorage';

// Initialize API mode
checkBackendAvailability().then(available => {
  if (available) {
    apiMode = 'http';
    console.log(`🔄 API Mode: ${apiMode} (Connected to backend server)`);
  } else {
    apiMode = 'localStorage';
    console.log(`🔄 API Mode: ${apiMode} (Backend not available, using localStorage)`);
  }
});

// Force HTTP mode for admin operations if backend is available
const ensureHttpMode = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health', { method: 'GET' });
    if (response.ok) {
      apiMode = 'http';
      console.log('🔒 Admin operations will use MongoDB (HTTP mode)');
      return true;
    }
  } catch (error) {
    console.warn('Backend not available, using localStorage mode');
  }
  return false;
};

// HTTP API client for backend requests
class HttpApiClient {
  private baseUrl = 'http://localhost:5000/api';

  private getAuthToken(): string | null {
    // Prefer backend token over frontend token for API calls
    return localStorage.getItem('backend_token') || localStorage.getItem('authToken');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Including auth header with token:', token.substring(0, 20) + '...');
      } else {
        console.log('No auth token found for API call');
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
          // If we can't parse error response, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Re-throw network errors with more context
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

// Dynamic service APIs that switch between localStorage and HTTP
export const servicesAPI = {
  async getAll() {
    if (apiMode === 'http') {
      try {
        return await httpClient.get('/services');
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return ServiceService.getActiveServices();
      }
    }
    return ServiceService.getActiveServices();
  },

  // Utility method to fix existing services with incorrect field names
  async fixExistingServices() {
    try {
      const allServices = await ServiceService.getAllServices();
      let fixedCount = 0;

      for (const service of allServices) {
        let needsUpdate = false;
        const updates: any = {};

        // Convert snake_case fields to camelCase for consistency
        if ((service as any).short_description && !service.shortDescription) {
          updates.shortDescription = (service as any).short_description;
          updates.short_description = undefined; // Remove old field
          needsUpdate = true;
        }
        if ((service as any).full_description && !service.fullDescription) {
          updates.fullDescription = (service as any).full_description;
          updates.full_description = undefined; // Remove old field
          needsUpdate = true;
        }
        if ((service as any).ideal_for && !service.idealFor) {
          updates.idealFor = (service as any).ideal_for;
          updates.ideal_for = undefined; // Remove old field
          needsUpdate = true;
        }
        if ((service as any).is_active !== undefined && service.isActive === undefined) {
          updates.isActive = (service as any).is_active;
          updates.is_active = undefined; // Remove old field
          needsUpdate = true;
        }
        if ((service as any).sort_order !== undefined && service.sortOrder === undefined) {
          updates.sortOrder = (service as any).sort_order;
          updates.sort_order = undefined; // Remove old field
          needsUpdate = true;
        }

        if (needsUpdate) {
          await ServiceService.updateService(service._id, updates);
          fixedCount++;
        }
      }

      console.log(`Fixed ${fixedCount} services with incorrect field names`);
      return fixedCount;
    } catch (error) {
      console.error('Error fixing services:', error);
      throw error;
    }
  },

  async getAllAdmin() {
    if (apiMode === 'http') {
      try {
        return await httpClient.get('/services/admin');
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return ServiceService.getAllServices();
      }
    }
    return ServiceService.getAllServices();
  },

  async getById(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.get(`/services/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        const services = await ServiceService.getAllServices();
        return services.find(s => s._id.toString() === id);
      }
    }
    const services = await ServiceService.getAllServices();
    return services.find(s => s._id.toString() === id);
  },

  async create(data: any) {
    console.log('🆕 Creating service in MongoDB:', data);

    // Ensure HTTP mode for admin operations
    await ensureHttpMode();

    try {
      // Always try HTTP first for admin operations - force save to MongoDB
      // Convert frontend field names to backend field names
      const backendData = {
        title: data.title,
        shortDescription: data.short_description || data.shortDescription,
        fullDescription: data.full_description || data.fullDescription,
        icon: data.icon || 'Star',
        duration: data.duration || '',
        idealFor: data.ideal_for || data.idealFor || '',
        benefits: Array.isArray(data.benefits) ? data.benefits : (typeof data.benefits === 'string' ? [data.benefits] : []),
        isActive: data.is_active ?? data.isActive ?? true, // Default to active when created by admin
        sortOrder: data.sort_order || data.sortOrder || 0
      };

      console.log('📡 Sending to MongoDB via HTTP:', backendData);
      const result = await httpClient.post('/services', backendData);
      console.log('✅ MongoDB save successful:', result._id);
      return result;
    } catch (error) {
      console.error('❌ Failed to save to MongoDB:', error.message);
      console.log('🔄 Falling back to localStorage (temporary)');
      // Only fallback to localStorage if HTTP completely fails
      return ServiceService.createService(data);
    }
  },

  async update(id: string, data: any) {
    console.log('🔄 Updating service in MongoDB:', id, data);

    // Ensure HTTP mode for admin operations
    await ensureHttpMode();

    try {
      // Always try HTTP first for admin operations
      const backendData: any = {};
      if (data.title !== undefined) backendData.title = data.title;
      if (data.short_description !== undefined || data.shortDescription !== undefined) {
        backendData.shortDescription = data.short_description || data.shortDescription;
      }
      if (data.full_description !== undefined || data.fullDescription !== undefined) {
        backendData.fullDescription = data.full_description || data.fullDescription;
      }
      if (data.icon !== undefined) backendData.icon = data.icon;
      if (data.duration !== undefined) backendData.duration = data.duration;
      if (data.ideal_for !== undefined || data.idealFor !== undefined) {
        backendData.idealFor = data.ideal_for || data.idealFor;
      }
      if (data.benefits !== undefined) {
        backendData.benefits = Array.isArray(data.benefits) ? data.benefits : (typeof data.benefits === 'string' ? [data.benefits] : []);
      }
      if (data.is_active !== undefined || data.isActive !== undefined) {
        backendData.isActive = data.is_active ?? data.isActive;
      }
      if (data.sort_order !== undefined || data.sortOrder !== undefined) {
        backendData.sortOrder = data.sort_order || data.sortOrder;
      }

      const result = await httpClient.put(`/services/${id}`, backendData);
      console.log('✅ MongoDB update successful:', id);
      return result;
    } catch (error) {
      console.error('❌ Failed to update in MongoDB:', error.message);
      console.log('🔄 Falling back to localStorage (temporary)');
      return ServiceService.updateService(id, data);
    }
  },

  async delete(id: string) {
    console.log('🗑️ Deleting service from MongoDB:', id);

    // Ensure HTTP mode for admin operations
    await ensureHttpMode();

    try {
      // Always try HTTP first for admin operations
      const result = await httpClient.delete(`/services/${id}`);
      console.log('✅ MongoDB delete successful:', id);
      return result;
    } catch (error) {
      console.error('❌ Failed to delete from MongoDB:', error.message);
      console.log('🔄 Falling back to localStorage (temporary)');
      return ServiceService.deleteService(id);
    }
  },
};

export const testimonialsAPI = {
  async getAll() {
    if (apiMode === 'http') {
      try {
        return await httpClient.get('/testimonials');
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return TestimonialService.getApprovedTestimonials();
      }
    }
    return TestimonialService.getApprovedTestimonials();
  },

  async getAllAdmin(filter?: string) {
    if (apiMode === 'http') {
      try {
        const endpoint = filter ? `/testimonials/admin?filter=${filter}` : '/testimonials/admin';
        return await httpClient.get(endpoint);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        switch (filter) {
          case 'approved':
            return TestimonialService.getApprovedTestimonials();
          case 'pending':
            return TestimonialService.getAllTestimonials().then(testimonials => testimonials.filter(t => !t.isApproved));
          default:
            return TestimonialService.getAllTestimonials();
        }
      }
    }
    switch (filter) {
      case 'approved':
        return TestimonialService.getApprovedTestimonials();
      case 'pending':
        return TestimonialService.getAllTestimonials().then(testimonials => testimonials.filter(t => !t.isApproved));
      default:
        return TestimonialService.getAllTestimonials();
    }
  },

  async getById(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.get(`/testimonials/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        const testimonials = await TestimonialService.getAllTestimonials();
        return testimonials.find(t => t._id.toString() === id);
      }
    }
    const testimonials = await TestimonialService.getAllTestimonials();
    return testimonials.find(t => t._id.toString() === id);
  },

  async create(data: any) {
    if (apiMode === 'http') {
      try {
        // Convert frontend field names to backend field names
        const backendData = {
          name: data.name,
          role: data.role,
          location: data.location,
          content: data.content,
          rating: data.rating,
          imageUrl: data.image_url || data.imageUrl,
          isApproved: data.is_approved ?? data.isApproved ?? true, // Default to approved when created by admin
          isFeatured: data.is_featured ?? data.isFeatured ?? false
        };
        return await httpClient.post('/testimonials', backendData);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return TestimonialService.createTestimonial(data);
      }
    }
    return TestimonialService.createTestimonial(data);
  },

  async update(id: string, data: any) {
    if (apiMode === 'http') {
      try {
        // Convert frontend field names to backend field names
        const backendData: any = {};
        if (data.name !== undefined) backendData.name = data.name;
        if (data.role !== undefined) backendData.role = data.role;
        if (data.location !== undefined) backendData.location = data.location;
        if (data.content !== undefined) backendData.content = data.content;
        if (data.rating !== undefined) backendData.rating = data.rating;
        if (data.image_url !== undefined || data.imageUrl !== undefined) {
          backendData.imageUrl = data.image_url || data.imageUrl;
        }
        if (data.is_approved !== undefined || data.isApproved !== undefined) {
          backendData.isApproved = data.is_approved ?? data.isApproved;
        }
        if (data.is_featured !== undefined || data.isFeatured !== undefined) {
          backendData.isFeatured = data.is_featured ?? data.isFeatured;
        }
        return await httpClient.put(`/testimonials/${id}`, backendData);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return TestimonialService.updateTestimonial(id, data);
      }
    }
    return TestimonialService.updateTestimonial(id, data);
  },

  async delete(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.delete(`/testimonials/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return TestimonialService.deleteTestimonial(id);
      }
    }
    return TestimonialService.deleteTestimonial(id);
  },

  async toggleApproval(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/testimonials/${id}/approval`, {});
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return TestimonialService.toggleApproval(id);
      }
    }
    return TestimonialService.toggleApproval(id);
  },

  async toggleFeatured(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/testimonials/${id}/featured`, {});
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return TestimonialService.toggleFeatured(id);
      }
    }
    return TestimonialService.toggleFeatured(id);
  },
};

export const galleryAPI = {
  async getAll() {
    console.log('GalleryAPI: getAll called, apiMode:', apiMode);
    if (apiMode === 'http') {
      try {
        const result = await httpClient.get('/gallery');
        console.log('GalleryAPI: HTTP result:', result);
        return result;
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        const localResult = await GalleryService.getActiveImages();
        console.log('GalleryAPI: localStorage result:', localResult);
        return localResult;
      }
    }
    const localResult = await GalleryService.getActiveImages();
    console.log('GalleryAPI: localStorage result:', localResult);
    return localResult;
  },

  async getAllAdmin(category?: string) {
    if (apiMode === 'http') {
      try {
        const endpoint = category && category !== 'all' ? `/gallery/admin?category=${category}` : '/gallery/admin';
        return await httpClient.get(endpoint);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        if (category && category !== 'all') {
          return GalleryService.getAllImages().then(images => images.filter(img => img.category === category));
        }
        return GalleryService.getAllImages();
      }
    }
    if (category && category !== 'all') {
      return GalleryService.getAllImages().then(images => images.filter(img => img.category === category));
    }
    return GalleryService.getAllImages();
  },

  async getById(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.get(`/gallery/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        const images = await GalleryService.getAllImages();
        return images.find(img => img._id.toString() === id);
      }
    }
    const images = await GalleryService.getAllImages();
    return images.find(img => img._id.toString() === id);
  },

  async create(data: any) {
    if (apiMode === 'http') {
      try {
        return await httpClient.post('/gallery', data);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return GalleryService.createImage(data);
      }
    }
    return GalleryService.createImage(data);
  },

  async update(id: string, data: any) {
    if (apiMode === 'http') {
      try {
        return await httpClient.put(`/gallery/${id}`, data);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return GalleryService.updateImage(id, data);
      }
    }
    return GalleryService.updateImage(id, data);
  },

  async delete(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.delete(`/gallery/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return GalleryService.deleteImage(id);
      }
    }
    return GalleryService.deleteImage(id);
  },

  async toggleActive(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/gallery/${id}/toggle`, {});
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return GalleryService.toggleActive(id);
      }
    }
    return GalleryService.toggleActive(id);
  },
};

export const contactAPI = {
  async submit(data: any) {
    if (apiMode === 'http') {
      try {
        // Contact form doesn't require authentication
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return ContactInquiryService.createInquiry(data);
      }
    }
    return ContactInquiryService.createInquiry(data);
  },

  async getAllAdmin(status?: string) {
    if (apiMode === 'http') {
      try {
        const endpoint = status && status !== 'all' ? `/contact/admin?status=${status}` : '/contact/admin';
        return await httpClient.get(endpoint);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        if (status && status !== 'all') {
          return ContactInquiryService.getAllInquiries().then(inquiries => inquiries.filter(i => i.status === status));
        }
        return ContactInquiryService.getAllInquiries();
      }
    }
    if (status && status !== 'all') {
      return ContactInquiryService.getAllInquiries().then(inquiries => inquiries.filter(i => i.status === status));
    }
    return ContactInquiryService.getAllInquiries();
  },

  async getById(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.get(`/contact/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        const inquiries = await ContactInquiryService.getAllInquiries();
        return inquiries.find(i => i._id.toString() === id);
      }
    }
    const inquiries = await ContactInquiryService.getAllInquiries();
    return inquiries.find(i => i._id.toString() === id);
  },

  async update(id: string, data: any) {
    if (apiMode === 'http') {
      try {
        return await httpClient.put(`/contact/${id}`, data);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return ContactInquiryService.updateInquiry(id, data);
      }
    }
    return ContactInquiryService.updateInquiry(id, data);
  },

  async updateStatus(id: string, status: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/contact/${id}/status`, { status });
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return ContactInquiryService.updateStatus(id, status);
      }
    }
    return ContactInquiryService.updateStatus(id, status);
  },

  async updateNotes(id: string, notes: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/contact/${id}/notes`, { notes });
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return ContactInquiryService.updateInquiry(id, { notes });
      }
    }
    return ContactInquiryService.updateInquiry(id, { notes });
  },

  async delete(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.delete(`/contact/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return ContactInquiryService.deleteInquiry(id);
      }
    }
    return ContactInquiryService.deleteInquiry(id);
  },
};

export const usersAPI = {
  async getAll() {
    if (apiMode === 'http') {
      try {
        return await httpClient.get('/users');
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return UserService.getAllUsers();
      }
    }
    return UserService.getAllUsers();
  },

  async getById(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.get(`/users/${id}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        const users = await UserService.getAllUsers();
        return users.find(u => u._id.toString() === id);
      }
    }
    const users = await UserService.getAllUsers();
    return users.find(u => u._id.toString() === id);
  },

  async updateRoles(id: string, roles: string[]) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/users/${id}/roles`, { roles });
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        if (roles.includes('admin')) {
          return UserService.promoteToAdmin(id);
        } else {
          return UserService.demoteFromAdmin(id);
        }
      }
    }
    if (roles.includes('admin')) {
      return UserService.promoteToAdmin(id);
    } else {
      return UserService.demoteFromAdmin(id);
    }
  },

  async addRole(id: string, role: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.post(`/users/${id}/roles`, { role });
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        if (role === 'admin') {
          return UserService.promoteToAdmin(id);
        }
        return Promise.resolve();
      }
    }
    if (role === 'admin') {
      return UserService.promoteToAdmin(id);
    }
    return Promise.resolve();
  },

  async removeRole(id: string, role: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.delete(`/users/${id}/roles/${role}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        if (role === 'admin') {
          return UserService.demoteFromAdmin(id);
        }
        return Promise.resolve();
      }
    }
    if (role === 'admin') {
      return UserService.demoteFromAdmin(id);
    }
    return Promise.resolve();
  },

  async deactivate(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/users/${id}/deactivate`, {});
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return UserService.deleteUser(id);
      }
    }
    return UserService.deleteUser(id);
  },

  async activate(id: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.patch(`/users/${id}/activate`, {});
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  },
};

export const settingsAPI = {
  async getAll() {
    console.log('Settings API getAll called, mode:', apiMode);
    if (apiMode === 'http') {
      try {
        const result = await httpClient.get('/settings');
        console.log('Settings from backend:', result);
        return result;
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return SettingsService.getAllSettings();
      }
    }
    return SettingsService.getAllSettings();
  },

  async getByKey(key: string, defaultValue = '') {
    if (apiMode === 'http') {
      try {
        const response = await httpClient.get(`/settings/${key}?default=${defaultValue}`);
        return response.value || defaultValue;
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        const value = await SettingsService.getSetting(key);
        return value || defaultValue;
      }
    }
    const value = await SettingsService.getSetting(key);
    return value || defaultValue;
  },

  async update(settings: Record<string, any>) {
    console.log('Settings API update called, mode:', apiMode, 'data:', settings);
    if (apiMode === 'http') {
      try {
        const result = await httpClient.put('/settings', settings);
        console.log('Settings update result:', result);
        return result;
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return SettingsService.updateSettings(settings);
      }
    }
    return SettingsService.updateSettings(settings);
  },

  async updateByKey(key: string, value: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.put(`/settings/${key}`, { value });
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return SettingsService.updateSetting(key, value);
      }
    }
    return SettingsService.updateSetting(key, value);
  },

  async delete(key: string) {
    if (apiMode === 'http') {
      try {
        return await httpClient.delete(`/settings/${key}`);
      } catch (error) {
        console.warn('HTTP API failed, falling back to localStorage:', error);
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  },
};

