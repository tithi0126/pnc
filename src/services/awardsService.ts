interface IAward {
  _id: string;
  title: string;
  description?: string;
  organization?: string;
  date: string;
  type: 'award' | 'event';
  images: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export class AwardsService {
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

  static async getAllAwards(token: string): Promise<IAward[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/awards/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const awards = await response.json();
      return awards.sort((a: IAward, b: IAward) =>
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    } catch (error) {
      console.error('Failed to fetch awards:', error);
      throw new Error('Failed to fetch awards');
    }
  }

  static async getActiveAwards(): Promise<IAward[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/awards/active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const awards = await response.json();
      return awards.sort((a: IAward, b: IAward) =>
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    } catch (error) {
      console.error('Failed to fetch awards:', error);
      throw new Error('Failed to fetch awards');
    }
  }

  static async createAward(awardData: Partial<IAward>, token: string): Promise<IAward> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/awards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(awardData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create award:', error);
      throw new Error('Failed to create award');
    }
  }

  static async updateAward(id: string, awardData: Partial<IAward>, token: string): Promise<IAward> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/awards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(awardData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update award:', error);
      throw new Error('Failed to update award');
    }
  }

  static async deleteAward(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/awards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete award:', error);
      throw new Error('Failed to delete award');
    }
  }

  static async toggleAwardStatus(id: string, token: string): Promise<IAward> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/awards/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to toggle award status:', error);
      throw new Error('Failed to toggle award status');
    }
  }
}
