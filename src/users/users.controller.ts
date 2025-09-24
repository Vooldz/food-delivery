import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  // returns the authenticated user from the JWT (populated by JwtStrategy)
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Request() req) {
    // req.user is set by JwtStrategy.validate()
    return req.user;
  }
}
