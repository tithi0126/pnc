// Browser-compatible authentication service using localStorage
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    isAdmin: boolean;
  };
  token: string;
}

export class AuthService {
  private static readonly USERS_KEY = 'auth_users';

  private static getUsers(): any[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private static saveUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private static hashPassword(password: string): string {
    // Simple hash for demo purposes - in production, use proper server-side hashing
    return btoa(password + 'salt');
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return btoa(password + 'salt') === hash;
  }

  private static generateToken(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  static async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const users = this.getUsers();

    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      _id: Date.now().toString(),
      email,
      password: this.hashPassword(password),
      fullName,
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      user: {
        id: userWithoutPassword._id,
        email: userWithoutPassword.email,
        fullName: userWithoutPassword.fullName,
        roles: userWithoutPassword.roles,
        isAdmin: userWithoutPassword.roles.includes('admin')
      },
      token: this.generateToken()
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user || !this.verifyPassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: {
        id: userWithoutPassword._id,
        email: userWithoutPassword.email,
        fullName: userWithoutPassword.fullName,
        roles: userWithoutPassword.roles,
        isAdmin: userWithoutPassword.roles.includes('admin')
      },
      token: this.generateToken()
    };
  }

  static async getUserById(id: string): Promise<any | null> {
    const users = this.getUsers();
    return users.find(u => u._id === id) || null;
  }

  static async verifyToken(token: string): Promise<any> {
    // Simple token verification for demo
    return { valid: true };
  }

  static async promoteToAdmin(userId: string): Promise<void> {
    const users = this.getUsers();
    const user = users.find(u => u._id === userId);
    if (user && !user.roles.includes('admin')) {
      user.roles.push('admin');
      this.saveUsers(users);
    }
  }

  static async demoteFromAdmin(userId: string): Promise<void> {
    const users = this.getUsers();
    const user = users.find(u => u._id === userId);
    if (user) {
      user.roles = user.roles.filter((role: string) => role !== 'admin');
      if (user.roles.length === 0) user.roles = ['user'];
      this.saveUsers(users);
    }
  }
}
