import { AuthService } from './auth.service';
import { prisma } from '../../config/database';
import bcrypt from 'bcryptjs';
import { ConflictError } from '../../errors/conflict-error';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import * as jwtUtils from '../../utils/jwt';

jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../../utils/jwt', () => ({
  signToken: jest.fn(),
}));

describe('AuthService.register', () => {
  const mockUserInput = {
    email: 'test@example.com',
    password: 'securePass123',
    name: 'Test User',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register user successfully', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: mockUserInput.email,
      name: mockUserInput.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: 'hashed-password',
    });

    const result = await AuthService.register(mockUserInput);

    expect(result).toHaveProperty('email', mockUserInput.email);
    expect(result).not.toHaveProperty('password');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUserInput.email },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
  });

  it('should throw ConflictError if email is already registered', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'existing-id',
    });

    await expect(AuthService.register(mockUserInput)).rejects.toThrow(
      ConflictError
    );
  });
});

describe('AuthService.login', () => {
  const mockLoginInput = {
    email: 'test@example.com',
    password: 'securePass123',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully and return token', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: mockLoginInput.email,
      password: 'hashed-password',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwtUtils.signToken as jest.Mock).mockReturnValue('mocked-token');

    const result = await AuthService.login(mockLoginInput);

    expect(result).toEqual({ accessToken: 'mocked-token' });
    expect(jwtUtils.signToken).toHaveBeenCalledWith({ userId: 'user-id' });
  });

  it('should throw UnauthorizedError if email not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(AuthService.login(mockLoginInput)).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if password is invalid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: mockLoginInput.email,
      password: 'hashed-password',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(AuthService.login(mockLoginInput)).rejects.toThrow(UnauthorizedError);
  });
});

