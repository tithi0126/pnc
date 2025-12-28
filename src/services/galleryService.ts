interface IGallery {
  _id: string;
  title: string;
  altText?: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export class GalleryService {
  private static readonly API_BASE_URL = 'http://localhost:5000/api';

  static async getAllImages(token: string): Promise<IGallery[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/gallery/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const images = await response.json();
      return images.sort((a: IGallery, b: IGallery) => (a.sortOrder || 0) - (b.sortOrder || 0));
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      throw new Error('Failed to fetch gallery images');
    }
  }

  static async getActiveImages(): Promise<IGallery[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/gallery`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const images = await response.json();
      return images.sort((a: IGallery, b: IGallery) => (a.sortOrder || 0) - (b.sortOrder || 0));
    } catch (error) {
      console.error('Failed to fetch active gallery images:', error);
      throw new Error('Failed to fetch active gallery images');
    }
  }

  static async createImage(imageData: Partial<IGallery>, token: string): Promise<IGallery> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create gallery image:', error);
      throw new Error('Failed to create gallery image');
    }
  }

  static async updateImage(id: string, updates: Partial<IGallery>, token: string): Promise<IGallery> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/gallery/${id}`, {
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
      console.error('Failed to update gallery image:', error);
      throw new Error('Failed to update gallery image');
    }
  }

  static async deleteImage(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/gallery/${id}`, {
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
      console.error('Failed to delete gallery image:', error);
      throw new Error('Failed to delete gallery image');
    }
  }

  static async toggleActive(id: string, token: string): Promise<IGallery> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/gallery/${id}/toggle`, {
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
      console.error('Failed to toggle image active status:', error);
      throw new Error('Failed to toggle image active status');
    }
  }
}
