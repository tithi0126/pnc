interface ITestimonial {
  _id: string;
  name: string;
  role?: string;
  location?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export class TestimonialService {
  private static readonly API_BASE_URL = (() => {
    let baseUrl = import.meta.env.VITE_API_URL;
    if (!baseUrl) {
      baseUrl = 'https://api.pncpriyamnutritioncare.com/api';
    }
    // Ensure the URL ends with /api
    if (!baseUrl.endsWith('/api')) {
      baseUrl += '/api';
    }
    return baseUrl;
  })();

  static async getAllTestimonials(token: string): Promise<ITestimonial[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/testimonials/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const testimonials = await response.json();
      return testimonials.sort((a: ITestimonial, b: ITestimonial) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      throw new Error('Failed to fetch testimonials');
    }
  }

  static async getApprovedTestimonials(): Promise<ITestimonial[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/testimonials/approved`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const testimonials = await response.json();
      return testimonials.sort((a: ITestimonial, b: ITestimonial) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch approved testimonials:', error);
      throw new Error('Failed to fetch approved testimonials');
    }
  }

  static async createTestimonial(testimonialData: Partial<ITestimonial>): Promise<ITestimonial> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create testimonial:', error);
      throw new Error('Failed to create testimonial');
    }
  }

  static async updateTestimonial(id: string, updates: Partial<ITestimonial>, token: string): Promise<ITestimonial> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update testimonial:', error);
      throw new Error('Failed to update testimonial');
    }
  }

  static async deleteTestimonial(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      throw new Error('Failed to delete testimonial');
    }
  }

  static async toggleApproval(id: string, token: string): Promise<ITestimonial> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/testimonials/${id}/approval`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to toggle approval:', error);
      throw new Error('Failed to toggle approval');
    }
  }

  static async toggleFeatured(id: string, token: string): Promise<ITestimonial> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/testimonials/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
      throw new Error('Failed to toggle featured status');
    }
  }
}
