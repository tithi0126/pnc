// Authentication service using MongoDB backend API
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    avatarUrl?: string;
  };
  token: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
}

export class AuthService {
  private static readonly API_BASE_URL = 'http://localhost:5000/api';

  static async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        roles: data.user.roles,
        avatarUrl: data.user.avatarUrl,
      },
      token: data.token,
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        roles: data.user.roles,
        avatarUrl: data.user.avatarUrl,
      },
      token: data.token,
    };
  }

  static async getProfile(token: string): Promise<User> {
    const response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }

    const data = await response.json();
    return {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      roles: data.user.roles,
      avatarUrl: data.user.avatarUrl,
    };
  }

  static async updateProfile(token: string, updates: Partial<User>): Promise<User> {
    const response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    const data = await response.json();
    return {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      roles: data.user.roles,
      avatarUrl: data.user.avatarUrl,
    };
  }

  static async verifyToken(token: string): Promise<boolean> {
    try {
      // Try to get profile - if it works, token is valid
      await this.getProfile(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async promoteToAdmin(token: string, userId: string): Promise<void> {
    const response = await fetch(`${this.API_BASE_URL}/users/${userId}/promote`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to promote user');
    }
  }

  static async demoteFromAdmin(token: string, userId: string): Promise<void> {
    const response = await fetch(`${this.API_BASE_URL}/users/${userId}/demote`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to demote user');
    }
  }
}
