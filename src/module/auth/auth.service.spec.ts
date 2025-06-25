import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../libs/cache/cache.service';
import { ethers } from 'ethers';
import { BadRequestException } from '@nestjs/common';
import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';

describe('AuthService - verifySignature()', () => {
  let service: AuthService;
  let cache: CacheService;
  let jwtService: JwtService;
  let userModel: jest.Mocked<Model<UserDocument>>;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt'),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockUserModel: Partial<jest.Mocked<Model<UserDocument>>> & {
    new (...args: any[]): any;
  } = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(true),
  }));

  mockUserModel.findOne = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get(AuthService);
    cache = module.get(CacheService);
    jwtService = module.get(JwtService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('✅ should verify and return tokens if user exists', async () => {
    const message = '123-abc';
    const address = '0x1234';
    const lowerAddr = address.toLowerCase();
    const signature = '0xSIGNATURE';

    mockCacheService.get.mockResolvedValue('1');
    jest.spyOn(ethers, 'verifyMessage').mockReturnValue(address);

    const fakeUser = {
      _id: 'uid123',
      wallet_address: lowerAddr,
      save: jest.fn(),
    };
    mockUserModel.findOne!.mockResolvedValue(fakeUser);

    const result = await service.verifySignature(message, signature, address);

    expect(result).toEqual({
      access_token: 'mocked-jwt',
      refresh_token: 'mocked-jwt',
      wallet_address: lowerAddr,
    });
    expect(fakeUser.save).toHaveBeenCalled();
    expect(mockCacheService.del).toHaveBeenCalledWith(
      `auth-message:${message}`,
    );
  });

  it('✅ should create new user if not exist', async () => {
    const message = '456-def';
    const address = '0xABCDEF';
    const lowerAddr = address.toLowerCase();
    const signature = '0xSIGNATURE';

    mockCacheService.get.mockResolvedValue('1');
    jest.spyOn(ethers, 'verifyMessage').mockReturnValue(address);
    mockUserModel.findOne!.mockResolvedValue(null);

    const newUser = {
      _id: 'new123',
      wallet_address: lowerAddr,
      save: jest.fn().mockResolvedValue(true),
    };

    // override constructor behavior
    (mockUserModel as jest.Mock).mockImplementation(() => newUser);

    const result = await service.verifySignature(message, signature, address);

    expect(newUser.save).toHaveBeenCalled();
    expect(result.access_token).toBeDefined();
    expect(result.refresh_token).toBeDefined();
    expect(result.wallet_address).toBe(lowerAddr);
  });

  it('❌ should throw if message expired', async () => {
    mockCacheService.get.mockResolvedValue(null);

    await expect(
      service.verifySignature('abc', 'sig', '0xaddr'),
    ).rejects.toThrow(BadRequestException);

    expect(mockCacheService.del).not.toBeCalled();
  });

  it('❌ should throw if signature verification fails', async () => {
    mockCacheService.get.mockResolvedValue('1');
    jest.spyOn(ethers, 'verifyMessage').mockImplementation(() => {
      throw new Error('bad sig');
    });

    await expect(
      service.verifySignature('abc', 'sig', '0xaddr'),
    ).rejects.toThrow(BadRequestException);
  });

  it('❌ should throw if recovered address mismatches', async () => {
    mockCacheService.get.mockResolvedValue('1');
    jest.spyOn(ethers, 'verifyMessage').mockReturnValue('0xWRONG');

    await expect(
      service.verifySignature('abc', 'sig', '0xRIGHT'),
    ).rejects.toThrow(BadRequestException);
  });
});
