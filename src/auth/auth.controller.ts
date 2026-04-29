import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import type { User } from 'src/prisma/client/client';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created sucessfully.' })
  register(@Body() userDto: User) {
    try {
      if(!userDto.email || !userDto.password || !userDto.fullName) {
        throw new HttpException('Email, password, and full name are required.', HttpStatus.BAD_REQUEST);
      } 
      return this.authService.register(userDto);
    } catch (error) {
      throw error; 
    }
  }

  @Post('signin')
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged.' })
  login(@Body() userDto: User) {
      try {
          const { email , password } = userDto;
          if(!email || !password) {
            throw new HttpException('Email and password are required.', HttpStatus.BAD_REQUEST);
          }
          return this.authService.login(email, password)
      } catch (error) {
        throw error;
      }
  }
}
