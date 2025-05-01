import { prisma } from '../../config/database';
import { ConflictError } from '../../errors/conflict-error';
import { RegisterInput } from './auth.validator';
import bcrypt from 'bcryptjs';

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
}
