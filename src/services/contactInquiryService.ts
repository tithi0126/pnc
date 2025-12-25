import { localDB } from '../integrations/supabase/client';

interface IContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ContactInquiryService {
  private static readonly COLLECTION = 'contact_inquiries';

  static async getAllInquiries(): Promise<IContactInquiry[]> {
    try {
      const inquiries = await localDB.find(this.COLLECTION);
      return inquiries.sort((a: IContactInquiry, b: IContactInquiry) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      throw new Error('Failed to fetch contact inquiries');
    }
  }

  static async createInquiry(inquiryData: Partial<IContactInquiry>): Promise<IContactInquiry> {
    try {
      return await localDB.insertOne(this.COLLECTION, inquiryData);
    } catch (error) {
      throw new Error('Failed to create contact inquiry');
    }
  }

  static async updateInquiry(id: string, updates: Partial<IContactInquiry>): Promise<IContactInquiry | null> {
    try {
      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, updates);
    } catch (error) {
      throw new Error('Failed to update contact inquiry');
    }
  }

  static async deleteInquiry(id: string): Promise<boolean> {
    try {
      return await localDB.deleteOne(this.COLLECTION, { _id: id });
    } catch (error) {
      throw new Error('Failed to delete contact inquiry');
    }
  }

  static async updateStatus(id: string, status: string): Promise<IContactInquiry | null> {
    try {
      return await localDB.findOneAndUpdate(this.COLLECTION, { _id: id }, { status });
    } catch (error) {
      throw new Error('Failed to update inquiry status');
    }
  }
}
