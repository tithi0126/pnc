interface IService {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  icon?: string;
  duration?: string;
  idealFor?: string;
  benefits: string[];
  isActive?: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export class ServiceService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pncapi.aangandevelopers.com/api';

  static async getAllServices(): Promise<IService[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/services`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const services = await response.json();
      return services.sort((a: IService, b: IService) =>
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw new Error('Failed to fetch services');
    }
  }

  static async getActiveServices(): Promise<IService[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/services/active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const services = await response.json();
      return services.sort((a: IService, b: IService) =>
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    } catch (error) {
      console.error('Failed to fetch active services:', error);
      throw new Error('Failed to fetch active services');
    }
  }

  static async createService(serviceData: Partial<IService>, token: string): Promise<IService> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create service:', error);
      throw new Error('Failed to create service');
    }
  }

  static async updateService(id: string, updates: Partial<IService>, token: string): Promise<IService> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/services/${id}`, {
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
      console.error('Failed to update service:', error);
      throw new Error('Failed to update service');
    }
  }

  static async deleteService(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/services/${id}`, {
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
      console.error('Failed to delete service:', error);
      throw new Error('Failed to delete service');
    }
  }
}
