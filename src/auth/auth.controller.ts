import { Body, Controller, Post, Res } from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: express.Response) {
    const { user, accessToken, refreshToken } = await this.auth.register(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ user, accessToken });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: express.Response) {
    const { user, refreshToken, accessToken } = await this.auth.login(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ user, accessToken });
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto, @Res() res: express.Response) {
    const { accessToken, refreshToken } = await this.auth.refreshTokens(
      dto.refreshToken,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }

  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    return this.auth.logout(dto.refreshToken);
  }
}
