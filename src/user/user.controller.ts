import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/prisma/client/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() request) {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
