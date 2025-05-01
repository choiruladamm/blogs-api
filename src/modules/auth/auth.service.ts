import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { ConflictError } from '../../errors/conflict-error';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { signToken } from '../../utils/jwt';
import { LoginInput, RegisterInput } from './auth.validator';

export class AuthService {
  static async register(data: RegisterInput) {
    const { email, password, name } = data;

    // check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // dont return password
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  static async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = signToken({
      userId: user.id,
    });

    return {
      accessToken: token,
    };
  }
}
