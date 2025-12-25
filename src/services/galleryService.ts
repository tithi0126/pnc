import { localDB } from '../integrations/supabase/client';

interface IGallery {
  _id: string;
  title: string;
  altText?: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export class GalleryService {
  private static readonly COLLECTION = 'gallery';

  static async getAllImages(): Promise<IGallery[]> {
    try {
      const images = await localDB.find(this.COLLECTION);
      return images.sort((a: IGallery, b: IGallery) => (a.sortOrder || 0) - (b.sortOrder || 0));
    } catch (error) {
      throw new Error('Failed to fetch gallery images');
    }
  }

  static async getActiveImages(): Promise<IGallery[]> {
    try {
      const images = await localDB.find(this.COLLECTION, { isActive: true });
      return images.sort((a: IGallery, b: IGallery) => (a.sortOrder || 0) - (b.sortOrder || 0));
    } catch (error) {
      throw new Error('Failed to fetch active gallery images');
    }
  }

  static async createImage(imageData: Partial<IGallery>): Promise<IGallery> {
    try {
      return await localDB.insertOne(this.COLLECTION, imageData);
    } catch (error) {
      throw new Error('Failed to create gallery image');
    }
  }

  static async updateImage(id: string, updates: Partial<IGallery>): Promise<IGallery | null> {
    try {
      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, updates);
    } catch (error) {
      throw new Error('Failed to update gallery image');
    }
  }

  static async deleteImage(id: string): Promise<boolean> {
    try {
      return await localDB.deleteOne(this.COLLECTION, { _id: id });
    } catch (error) {
      throw new Error('Failed to delete gallery image');
    }
  }

  static async toggleActive(id: string): Promise<IGallery | null> {
    try {
      const image = await localDB.findOne(this.COLLECTION, { _id: id });
      if (!image) return null;

      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, { isActive: !image.isActive });
    } catch (error) {
      throw new Error('Failed to toggle image active status');
    }
  }
}
