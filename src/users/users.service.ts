import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '12', 10);
    const hashed = await bcrypt.hash(data.password, saltRounds);
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        phone: data.phone,
        role: data.role || undefined,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // create refresh token record (token should be hashed already)
  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({
      data: {
        token: tokenHash,
        expiresAt,
        userId,
      },
    });
  }

  // find a refresh token by comparing hash (iterate tokens for user & bcrypt.compare)
  async findRefreshTokenByUserAndRawToken(userId: string, rawToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    for (const t of tokens) {
      const match = await bcrypt.compare(rawToken, t.token);
      if (match) return t;
    }
    return null;
  }

  async deleteRefreshToken(id: string) {
    return this.prisma.refreshToken.delete({ where: { id } });
  }

  async deleteRefreshTokensForUser(userId: string) {
    return this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
