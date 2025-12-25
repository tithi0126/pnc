import { localDB } from '../integrations/supabase/client';

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
  createdAt: Date;
  updatedAt: Date;
  // Support for snake_case field names (for backward compatibility)
  short_description?: string;
  full_description?: string;
  ideal_for?: string;
  is_active?: boolean;
  sort_order?: number;
}

export class ServiceService {
  private static readonly COLLECTION = 'services';

  static async getAllServices(): Promise<IService[]> {
    try {
      const services = await localDB.find(this.COLLECTION);
      return services.sort((a: IService, b: IService) =>
        (a.sortOrder || a.sort_order || 0) - (b.sortOrder || b.sort_order || 0)
      );
    } catch (error) {
      throw new Error('Failed to fetch services');
    }
  }

  static async getActiveServices(): Promise<IService[]> {
    try {
      const services = await localDB.find(this.COLLECTION);
      // Filter services that are active (check both field formats)
      const activeServices = services.filter((s: IService) =>
        (s.isActive === true || s.is_active === true)
      );
      // Sort by sort order (check both field formats)
      return activeServices.sort((a: IService, b: IService) =>
        (a.sortOrder || a.sort_order || 0) - (b.sortOrder || b.sort_order || 0)
      );
    } catch (error) {
      throw new Error('Failed to fetch active services');
    }
  }

  static async createService(serviceData: Partial<IService>): Promise<IService> {
    try {
      return await localDB.insertOne(this.COLLECTION, serviceData);
    } catch (error) {
      throw new Error('Failed to create service');
    }
  }

  static async updateService(id: string, updates: Partial<IService>): Promise<IService | null> {
    try {
      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, updates);
    } catch (error) {
      throw new Error('Failed to update service');
    }
  }

  static async deleteService(id: string): Promise<boolean> {
    try {
      return await localDB.deleteOne(this.COLLECTION, { _id: id });
    } catch (error) {
      throw new Error('Failed to delete service');
    }
  }
}
