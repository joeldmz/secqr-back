import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseInterceptors, ClassSerializerInterceptor, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/prisma/client/client';
import { ApiResponse } from '@nestjs/swagger';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuario creado exitosamente.' })
  create(@Body() userDto: User) {
    try {
      return this.userService.create(userDto);
    } catch (error: any) {
      throw error; 
    }
    
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
