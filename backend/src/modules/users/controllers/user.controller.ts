import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Req() req: any) {
    return this.usersService.findById(req.user.userId);
  }
}
