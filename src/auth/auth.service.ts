import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(registerDto: any) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) throw new BadRequestException('Email already in use');
    const user = await this.usersService.create(registerDto);

    const tokens = await this.getTokensForUser(user);
    return { user: this.withoutPassword(user), ...tokens };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    return user;
  }

  withoutPassword(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokensForUser(user);
    return { user: this.withoutPassword(user), ...tokens };
  }

  private async getTokensForUser(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // access token (uses JwtModule default secret)
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshSecret = this.config.get<string>('REFRESH_TOKEN_SECRET');
    const refreshExpiresIn =
      this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';
    const rawRefreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      },
    );

    // hash refresh token before storing
    const saltRounds = parseInt(
      this.config.get<string>('BCRYPT_SALT') || '12',
      10,
    );
    const hashedRefresh = await bcrypt.hash(rawRefreshToken, saltRounds);

    // compute expiresAt for DB
    const expiresMs = parseInt(
      this.config.get<string>('REFRESH_TOKEN_EXPIRES_MS') || '604800000',
      10,
    );
    const expiresAt = new Date(Date.now() + expiresMs);

    await this.usersService.createRefreshToken(
      user.id,
      hashedRefresh,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  // refresh flow: verify refresh JWT signature and check DB record
  async refreshTokens(rawToken: string) {
    try {
      const payload: any = await this.jwtService.verifyAsync(rawToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const userId = payload.sub;
      if (!userId) throw new UnauthorizedException('Invalid token');

      const tokenRecord =
        await this.usersService.findRefreshTokenByUserAndRawToken(
          userId,
          rawToken,
        );
      if (!tokenRecord)
        throw new UnauthorizedException('Refresh token not found');

      if (tokenRecord.expiresAt < new Date()) {
        // remove expired token
        await this.usersService.deleteRefreshToken(tokenRecord.id);
        throw new UnauthorizedException('Refresh token expired');
      }

      // rotation: delete used token
      await this.usersService.deleteRefreshToken(tokenRecord.id);

      const user = await this.usersService.findById(userId);
      if (!user) throw new UnauthorizedException('User not found');

      const tokens = await this.getTokensForUser(user);
      return tokens;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(rawToken: string) {
    try {
      const payload: any = await this.jwtService.verifyAsync(rawToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });
      const userId = payload.sub;
      if (!userId) return;

      const tokenRecord =
        await this.usersService.findRefreshTokenByUserAndRawToken(
          userId,
          rawToken,
        );
      if (tokenRecord) {
        await this.usersService.deleteRefreshToken(tokenRecord.id);
      }
      return { success: true };
      // @eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { error: e };
    }
  }
}
