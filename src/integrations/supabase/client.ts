// Browser-compatible localStorage-based database simulation
class LocalStorageDB {
  private getStorageKey(collection: string): string {
    return `vitality_hub_${collection}`;
  }

  private getCollection(collection: string): any[] {
    const data = localStorage.getItem(this.getStorageKey(collection));
    return data ? JSON.parse(data) : [];
  }

  private saveCollection(collection: string, data: any[]): void {
    localStorage.setItem(this.getStorageKey(collection), JSON.stringify(data));
  }

  // Generate simple ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  async find(collection: string, query: any = {}): Promise<any[]> {
    const items = this.getCollection(collection);

    // Simple query implementation
    return items.filter(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  }

  async findOne(collection: string, query: any = {}): Promise<any | null> {
    const items = await this.find(collection, query);
    return items.length > 0 ? items[0] : null;
  }

  async insertOne(collection: string, data: any): Promise<any> {
    const items = this.getCollection(collection);
    const newItem = { ...data, _id: this.generateId(), createdAt: new Date(), updatedAt: new Date() };
    items.push(newItem);
    this.saveCollection(collection, items);
    return newItem;
  }

  async updateOne(collection: string, query: any, update: any): Promise<any | null> {
    const items = this.getCollection(collection);
    const index = items.findIndex(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] !== value) return false;
      }
      return true;
    });

    if (index === -1) return null;

    items[index] = { ...items[index], ...update, updatedAt: new Date() };
    this.saveCollection(collection, items);
    return items[index];
  }

  async deleteOne(collection: string, query: any): Promise<boolean> {
    const items = this.getCollection(collection);
    const filteredItems = items.filter(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] === value) return false;
      }
      return true;
    });

    if (filteredItems.length === items.length) return false;

    this.saveCollection(collection, filteredItems);
    return true;
  }

  async findOneAndUpdate(collection: string, query: any, update: any): Promise<any | null> {
    return this.updateOne(collection, query, update);
  }

  async findOneAndDelete(collection: string, query: any): Promise<any | null> {
    const item = await this.findOne(collection, query);
    if (!item) return null;

    await this.deleteOne(collection, query);
    return item;
  }
}

// Initialize and log database connection
export const localDB = new LocalStorageDB();

// Database connection status checker
export class DatabaseStatus {
  static checkConnection(): { connected: boolean; type: string; message: string } {
    try {
      // Test localStorage availability
      const testKey = 'vitality_hub_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);

      // Count existing data
      const collections = ['services', 'testimonials', 'gallery', 'contact_inquiries', 'settings', 'users'];
      let totalRecords = 0;

      collections.forEach(collection => {
        const data = localStorage.getItem(`vitality_hub_${collection}`);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            totalRecords += Array.isArray(parsed) ? parsed.length : 1;
          } catch (e) {
            // Ignore parse errors
          }
        }
      });

      const message = `✅ localStorage Database Connected - ${totalRecords} records across ${collections.length} collections`;

      console.log('🔍 Database Connection Status:', {
        type: 'localStorage',
        connected: true,
        collections: collections.length,
        totalRecords,
        timestamp: new Date().toISOString()
      });

      return {
        connected: true,
        type: 'localStorage',
        message
      };
    } catch (error) {
      const message = `❌ localStorage Database Error: ${error instanceof Error ? error.message : 'Unknown error'}`;

      console.error('🔍 Database Connection Status:', {
        type: 'localStorage',
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });

      return {
        connected: false,
        type: 'localStorage',
        message
      };
    }
  }

  static async checkMongoDBConnection(): Promise<{ connected: boolean; type: string; message: string }> {
    // MongoDB is configured to use localhost:27017/vitality-hub
    const mongoURI = 'mongodb://localhost:27017/vitality-hub';
    const apiUrl = 'http://localhost:5000/api';

    try {
      console.log('🔍 Testing MongoDB Connection via Backend API...');

      // Test backend health endpoint
      const healthResponse = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();

        // Test actual database operations
        try {
          const servicesResponse = await fetch(`${apiUrl}/services`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(3000)
          });

          if (servicesResponse.ok) {
            const services = await servicesResponse.json();
            const message = `✅ MongoDB Connected: ${mongoURI} - ${Array.isArray(services) ? services.length : 'unknown'} services loaded`;

            console.log('🔍 MongoDB Connection Status:', {
              configured: true,
              type: 'mongodb',
              connected: true,
              uri: mongoURI,
              apiUrl,
              servicesCount: Array.isArray(services) ? services.length : 'unknown',
              message,
              timestamp: new Date().toISOString()
            });

            return {
              connected: true,
              type: 'mongodb',
              message
            };
          } else {
            throw new Error(`Services API returned ${servicesResponse.status}`);
          }
        } catch (dbError) {
          const message = `⚠️ Backend API running but MongoDB operations failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`;

          console.log('🔍 MongoDB Connection Status:', {
            configured: true,
            type: 'mongodb',
            connected: false,
            uri: mongoURI,
            apiUrl,
            message,
            error: dbError instanceof Error ? dbError.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });

          return {
            connected: false,
            type: 'mongodb',
            message
          };
        }
      } else {
        throw new Error(`Health check failed with status ${healthResponse.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      let message = '';

      if (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        message = '❌ Backend server not running - MongoDB unavailable';
        console.log('💡 To start MongoDB backend:');
        console.log('   1. Open new terminal');
        console.log('   2. cd backend');
        console.log('   3. npm install');
        console.log('   4. npm start');
        console.log('   5. Make sure MongoDB is running on localhost:27017');
      } else {
        message = `❌ MongoDB Connection Error: ${errorMessage}`;
      }

      console.log('🔍 MongoDB Connection Status:', {
        configured: true,
        type: 'mongodb',
        connected: false,
        uri: mongoURI,
        apiUrl,
        message,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      return {
        connected: false,
        type: 'mongodb',
        message
      };
    }
  }

  static async logAllConnections() {
    console.log('🚀 === DATABASE CONNECTION STATUS ===');

    const localStorageStatus = this.checkConnection();
    console.log(localStorageStatus.message);

    const mongoStatus = await this.checkMongoDBConnection();
    console.log(mongoStatus.message);

    console.log('📊 === SUMMARY ===');
    console.log(`Active Database: ${localStorageStatus.connected ? 'localStorage' : 'None'}`);
    console.log(`MongoDB Configured: ${mongoStatus.type === 'mongodb' ? 'Yes' : 'No'}`);
    console.log('=====================================');

    return {
      localStorage: localStorageStatus,
      mongodb: mongoStatus
    };
  }
}

// Simple authentication using localStorage
class AuthService {
  private readonly USERS_KEY = 'auth_users';
  private readonly CURRENT_USER_KEY = 'auth_current_user';

  private saveUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private hashPassword(password: string): string {
    // Simple hash for demo purposes - in production, use proper hashing
    return btoa(password);
  }

  private verifyPassword(password: string, hash: string): boolean {
    return btoa(password) === hash;
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  getUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  async register(email: string, password: string, fullName: string) {
    const users = this.getUsers();

    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      _id: this.generateId(),
      email,
      password: this.hashPassword(password),
      fullName,
      roles: ['user'],
      createdAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      token: this.generateToken()
    };
  }

  async login(email: string, password: string) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user || !this.verifyPassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: this.generateToken()
    };
  }

  getCurrentUser() {
    const userData = localStorage.getItem(this.CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user: any) {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  promoteToAdmin(userId: string) {
    const users = this.getUsers();
    const user = users.find(u => u._id === userId);
    if (user && !user.roles.includes('admin')) {
      user.roles.push('admin');
      this.saveUsers(users);
    }
  }

  demoteFromAdmin(userId: string) {
    const users = this.getUsers();
    const user = users.find(u => u._id === userId);
    if (user) {
      user.roles = user.roles.filter((role: string) => role !== 'admin');
      if (user.roles.length === 0) user.roles = ['user'];
      this.saveUsers(users);
    }
  }
}

export const authService = new AuthService();
