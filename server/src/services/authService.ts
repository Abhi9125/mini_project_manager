import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../utils/AppError.js';

interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface AuthResult {
  user: UserResponse;
  token: string;
}

const generateToken = (id: string, email: string, name: string): string => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production_123456';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
  return jwt.sign({ id, email, name }, secret, { expiresIn });
};

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('A user with this email address already exists.', 409);
    }

    const user = await userRepository.create({ name, email, password });
    const token = generateToken(user._id.toString(), user.email, user.name);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  },

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = generateToken(user._id.toString(), user.email, user.name);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  },

  async getMe(userId: string): Promise<UserResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};
