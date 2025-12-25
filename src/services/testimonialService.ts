import { localDB } from '../integrations/supabase/client';

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
  createdAt: Date;
  updatedAt: Date;
}

export class TestimonialService {
  private static readonly COLLECTION = 'testimonials';

  static async getAllTestimonials(): Promise<ITestimonial[]> {
    try {
      const testimonials = await localDB.find(this.COLLECTION);
      return testimonials.sort((a: ITestimonial, b: ITestimonial) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      throw new Error('Failed to fetch testimonials');
    }
  }

  static async getApprovedTestimonials(): Promise<ITestimonial[]> {
    try {
      const testimonials = await localDB.find(this.COLLECTION, { isApproved: true });
      return testimonials.sort((a: ITestimonial, b: ITestimonial) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      throw new Error('Failed to fetch approved testimonials');
    }
  }

  static async createTestimonial(testimonialData: Partial<ITestimonial>): Promise<ITestimonial> {
    try {
      return await localDB.insertOne(this.COLLECTION, testimonialData);
    } catch (error) {
      throw new Error('Failed to create testimonial');
    }
  }

  static async updateTestimonial(id: string, updates: Partial<ITestimonial>): Promise<ITestimonial | null> {
    try {
      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, updates);
    } catch (error) {
      throw new Error('Failed to update testimonial');
    }
  }

  static async deleteTestimonial(id: string): Promise<boolean> {
    try {
      return await localDB.deleteOne(this.COLLECTION, { _id: id });
    } catch (error) {
      throw new Error('Failed to delete testimonial');
    }
  }

  static async toggleApproval(id: string): Promise<ITestimonial | null> {
    try {
      const testimonial = await localDB.findOne(this.COLLECTION, { _id: id });
      if (!testimonial) return null;

      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, { isApproved: !testimonial.isApproved });
    } catch (error) {
      throw new Error('Failed to toggle approval');
    }
  }

  static async toggleFeatured(id: string): Promise<ITestimonial | null> {
    try {
      const testimonial = await localDB.findOne(this.COLLECTION, { _id: id });
      if (!testimonial) return null;

      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, { isFeatured: !testimonial.isFeatured });
    } catch (error) {
      throw new Error('Failed to toggle featured status');
    }
  }
}
