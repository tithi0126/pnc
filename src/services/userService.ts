import { localDB, authService } from '../integrations/supabase/client';

interface IUser {
  _id: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  private static readonly COLLECTION = 'users';

  static async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await localDB.find(this.COLLECTION);
      return users.sort((a: IUser, b: IUser) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  static async promoteToAdmin(userId: string): Promise<void> {
    authService.promoteToAdmin(userId);
  }

  static async demoteFromAdmin(userId: string): Promise<void> {
    authService.demoteFromAdmin(userId);
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      return await localDB.deleteOne(this.COLLECTION, { _id: userId });
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}
