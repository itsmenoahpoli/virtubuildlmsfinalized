import { UsersService } from '@/modules/users/users.service';
import { usersRepository } from '@/database';
import { encryptPassword } from '@/utils';

jest.mock('@/database');
jest.mock('@/utils');

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUsersRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    usersService = new UsersService();
    mockUsersRepository = usersRepository as jest.Mocked<typeof usersRepository>;
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = {
        id: 1,
        email: 'student@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userRoleId: 2
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser as any);

      const result = await usersService.findByEmail('student@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ email: 'student@example.com' });
    });

    it('should return null for non-existent email', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      const result = await usersService.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create new user with encrypted password', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'Password123!',
        userRoleId: 2,
        isEnabled: true,
        isEmailVerified: false,
        twoFactorEnabled: false,
        failedLoginAttempts: 0
      };

      const mockCreatedUser = {
        id: 3,
        ...userData,
        password: 'encrypted-password'
      };

      (encryptPassword as jest.Mock).mockResolvedValue('encrypted-password');
      mockUsersRepository.create.mockReturnValue(mockCreatedUser as any);
      mockUsersRepository.save.mockResolvedValue(mockCreatedUser as any);

      const result = await usersService.createUser(userData);

      expect(result).toEqual(mockCreatedUser);
      expect(encryptPassword).toHaveBeenCalledWith(userData.password);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'encrypted-password'
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith(mockCreatedUser);
    });
  });

  describe('fetchList', () => {
    it('should fetch users with default pagination', async () => {
      const mockUsers = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 2])
      };

      mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const filters = { page: 1, limit: 10, withDeleted: false };
      const result = await usersService.fetchList(filters);

      expect(result).toEqual({
        data: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1
        }
      });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should filter users by search term', async () => {
      const mockUsers = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 1])
      };

      mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const filters = { page: 1, limit: 10, search: 'John', withDeleted: false };
      const result = await usersService.fetchList(filters);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
        { search: '%John%' }
      );
    });

    it('should filter users by userRoleId', async () => {
      const mockUsers = [{ id: 1, firstName: 'John', lastName: 'Doe', userRoleId: 2 }];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 1])
      };

      mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const filters = { page: 1, limit: 10, userRoleId: 2, withDeleted: false };
      const result = await usersService.fetchList(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.userRoleId = :userRoleId', { userRoleId: 2 });
    });

    it('should filter users by isEnabled status', async () => {
      const mockUsers = [{ id: 1, firstName: 'John', lastName: 'Doe', isEnabled: true }];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 1])
      };

      mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const filters = { page: 1, limit: 10, isEnabled: true, withDeleted: false };
      const result = await usersService.fetchList(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.isEnabled = :isEnabled', { isEnabled: true });
    });

    it('should handle pagination correctly', async () => {
      const mockUsers = [{ id: 3, firstName: 'Bob', lastName: 'Johnson' }];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 25])
      };

      mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const filters = { page: 3, limit: 10, withDeleted: false };
      const result = await usersService.fetchList(filters);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.pagination.totalPages).toBe(3);
    });
  });

  describe('fetchById', () => {
    it('should find user by id', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        userRoleId: 2
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser as any);

      const result = await usersService.fetchById(1);

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null for non-existent id', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      const result = await usersService.fetchById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateById', () => {
    it('should update user by id', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        save: jest.fn().mockResolvedValue(undefined)
      };

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser as any);

      const result = await usersService.updateById(1, updateData);

      expect(result?.firstName).toBe('Updated');
      expect(result?.lastName).toBe('Name');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should encrypt password when updating', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        password: 'old-password',
        save: jest.fn().mockResolvedValue(undefined)
      };

      const updateData = {
        password: 'NewPassword123!'
      };

      (encryptPassword as jest.Mock).mockResolvedValue('encrypted-new-password');
      mockUsersRepository.findOneBy.mockResolvedValue(mockUser as any);

      const result = await usersService.updateById(1, updateData);

      expect(encryptPassword).toHaveBeenCalledWith('NewPassword123!');
      expect(result?.password).toBe('encrypted-new-password');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return null for non-existent user', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      const updateData = { firstName: 'Updated' };
      const result = await usersService.updateById(999, updateData);

      expect(result).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('should delete user by id', async () => {
      mockUsersRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await usersService.deleteById(1);

      expect(result).toBe(true);
      expect(mockUsersRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return false if user not found', async () => {
      mockUsersRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await usersService.deleteById(999);

      expect(result).toBe(false);
    });
  });
});
