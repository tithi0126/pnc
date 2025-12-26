interface IUser {
  _id: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  private static readonly API_BASE_URL = 'http://localhost:5000/api';

  static async getAllUsers(token: string): Promise<IUser[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      return users.sort((a: IUser, b: IUser) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  static async promoteToAdmin(userId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: 'admin' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to promote user to admin:', error);
      throw new Error('Failed to promote user to admin');
    }
  }

  static async demoteFromAdmin(userId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/roles/admin`, {
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
      console.error('Failed to demote user from admin:', error);
      throw new Error('Failed to demote user from admin');
    }
  }

  static async activateUser(userId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/activate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
      throw new Error('Failed to activate user');
    }
  }

  static async deactivateUser(userId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      throw new Error('Failed to deactivate user');
    }
  }
}
