import { User, IUser } from '../../models/User.js';

export const authRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  },

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password');
  },

  async create(userData: { name: string; email: string; password: string }): Promise<IUser> {
    return User.create(userData);
  },
};
