import { AuthService } from './auth.service';
import { prisma } from '../../config/database';
import bcrypt from 'bcryptjs';
import { ConflictError } from '../../errors/conflict-error';

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
