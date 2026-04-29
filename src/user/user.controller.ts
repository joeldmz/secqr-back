import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseInterceptors, ClassSerializerInterceptor, HttpException, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/prisma/client/client';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuario creado exitosamente.' })
  create(@Body() userDto: User) {
    try {
      if(!userDto.email || !userDto.password || !userDto.fullName) {
        throw new HttpException('Email, password, and full name are required.', HttpStatus.BAD_REQUEST);
      } 
      return this.userService.create(userDto);
    } catch (error) {
      throw error; 
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() request) {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
