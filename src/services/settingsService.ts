interface ISetting {
  _id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export class SettingsService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

  static async getAllSettings(token: string): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const settings = await response.json();
      // Backend returns an object (settingsMap), not an array
      if (Array.isArray(settings)) {
        const settingsMap: Record<string, string> = {};
        settings.forEach((setting: ISetting) => {
          settingsMap[setting.key] = setting.value;
        });
        return settingsMap;
      }
      // If it's already an object, return it directly
      return settings as Record<string, string>;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      throw new Error('Failed to fetch settings');
    }
  }

  static async getPublicSettings(): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/settings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const settings = await response.json();
      // Backend returns an object (settingsMap), not an array
      if (Array.isArray(settings)) {
        const settingsMap: Record<string, string> = {};
        settings.forEach((setting: ISetting) => {
          settingsMap[setting.key] = setting.value;
        });
        return settingsMap;
      }
      // If it's already an object, return it directly
      return settings as Record<string, string>;
    } catch (error) {
      console.error('Failed to fetch public settings:', error);
      throw new Error('Failed to fetch public settings');
    }
  }

  static async getSetting(key: string, token: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/settings/${key}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const setting = await response.json();
      return setting.value;
    } catch (error) {
      console.error('Failed to fetch setting:', error);
      throw new Error('Failed to fetch setting');
    }
  }

  static async updateSetting(key: string, value: string, token: string): Promise<ISetting> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update setting:', error);
      throw new Error('Failed to update setting');
    }
  }

  static async updateSettings(settings: Record<string, string>, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw new Error('Failed to update settings');
    }
  }
}
