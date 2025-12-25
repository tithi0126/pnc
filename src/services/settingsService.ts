import { localDB } from '../integrations/supabase/client';

interface ISetting {
  _id: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SettingsService {
  private static readonly COLLECTION = 'settings';

  static async getAllSettings(): Promise<Record<string, string>> {
    try {
      const settings = await localDB.find(this.COLLECTION);
      const settingsMap: Record<string, string> = {};
      settings.forEach((setting: ISetting) => {
        settingsMap[setting.key] = setting.value;
      });
      return settingsMap;
    } catch (error) {
      throw new Error('Failed to fetch settings');
    }
  }

  static async getSetting(key: string): Promise<string | null> {
    try {
      const setting = await localDB.findOne(this.COLLECTION, { key });
      return setting ? setting.value : null;
    } catch (error) {
      throw new Error('Failed to fetch setting');
    }
  }

  static async updateSetting(key: string, value: string): Promise<ISetting> {
    try {
      // Check if setting exists
      const existing = await localDB.findOne(this.COLLECTION, { key });
      if (existing) {
        return await localDB.findOneAndUpdate(this.COLLECTION, { key }, { value });
      } else {
        return await localDB.insertOne(this.COLLECTION, { key, value });
      }
    } catch (error) {
      throw new Error('Failed to update setting');
    }
  }

  static async updateSettings(settings: Record<string, string>): Promise<void> {
    try {
      for (const [key, value] of Object.entries(settings)) {
        await this.updateSetting(key, value);
      }
    } catch (error) {
      throw new Error('Failed to update settings');
    }
  }
}
