import { CacheService } from '@libs/cache/cache.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { MessageResponseDto } from './dto/message.response.dto';
import { VerifyResponseDto } from './dto/verify.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly cache: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  async generateMessage(): Promise<MessageResponseDto> {
    const message = randomUUID();
    await this.cache.set(`auth-message:${message.toLowerCase()}`, '1', 30);
    return { message };
  }

  async verifySignature(
    message: string,
    signature: string,
    address: string,
  ): Promise<VerifyResponseDto> {
    const redisKey = `auth-message:${message.toLowerCase()}`;

    // Kiểm tra message còn hợp lệ
    const validKey = await this.cache.get(redisKey);
    if (!validKey) {
      throw new BadRequestException('Message expired or invalid');
    }

    // verify chữ ký
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (error) {
      throw new BadRequestException('Signature verification failed');
    }

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new BadRequestException('Recovered address does not match');
    }

    // Xóa message sau dùng
    await this.cache.del(redisKey);

    // Tìm | Tạo mới user
    const normalizedAddress = address.toLowerCase();
    let user = await this.userModel.findOne({
      wallet_address: normalizedAddress,
    });

    if (!user) {
      user = new this.userModel({
        wallet_address: normalizedAddress,
        last_active_at: new Date(),
      });
      await user.save();
    } else {
      user.last_active_at = new Date();
      await user.save();
    }

    const accessToken = this.jwtService.sign(
      {
        sub: user._id,
        wallet: user.wallet_address,
        type: 'access',
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: user._id,
        wallet: user.wallet_address,
        type: 'refresh',
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    await this.cache.set(
      `refresh-token:${user.wallet_address}`,
      refreshToken,
      60 * 60 * 24 * 7,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      wallet_address: user.wallet_address,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (payload.type !== 'refresh') {
        throw new BadRequestException('Invalid token type');
      }

      const stored = await this.cache.get(`refresh-token:${payload.wallet}`);
      if (!stored || stored !== token) {
        throw new UnauthorizedException('Invalid or revoked token');
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          wallet: payload.wallet,
          type: 'access',
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Refresh token invalid');
    }
  }

  async logout(walletAddress: string) {
    await this.cache.del(`refresh-token:${walletAddress.toLowerCase()}`);
    return { status: 'Logged out' };
  }
}
