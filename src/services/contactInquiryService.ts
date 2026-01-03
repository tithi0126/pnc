interface IContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class ContactInquiryService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL 
  || 'https://api.pncpriyamnutritioncare.com/api'
  // || 'http://localhost:5003/api'
  ;
  
  static async getAllInquiries(token: string): Promise<IContactInquiry[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/contact/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const inquiries = await response.json();
      return inquiries.sort((a: IContactInquiry, b: IContactInquiry) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch contact inquiries:', error);
      throw new Error('Failed to fetch contact inquiries');
    }
  }

  static async createInquiry(inquiryData: Partial<IContactInquiry>): Promise<IContactInquiry> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create contact inquiry:', error);
      throw new Error('Failed to create contact inquiry');
    }
  }

  static async updateInquiry(id: string, updates: Partial<IContactInquiry>, token: string): Promise<IContactInquiry> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/contact/${id}`, {
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
      console.error('Failed to update contact inquiry:', error);
      throw new Error('Failed to update contact inquiry');
    }
  }

  static async deleteInquiry(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/contact/${id}`, {
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
      console.error('Failed to delete contact inquiry:', error);
      throw new Error('Failed to delete contact inquiry');
    }
  }

  static async updateStatus(id: string, status: string, token: string): Promise<IContactInquiry> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
      throw new Error('Failed to update inquiry status');
    }
  }

  static async updateNotes(id: string, notes: string, token: string): Promise<IContactInquiry> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/contact/${id}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update inquiry notes:', error);
      throw new Error('Failed to update inquiry notes');
    }
  }
}
