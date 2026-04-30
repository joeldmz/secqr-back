import { Body, Controller, HttpException, HttpStatus, Param, Post, Request } from '@nestjs/common';
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
      if(!userDto.email || !userDto.password || !userDto.firstName || !userDto.lastName) {
        throw new HttpException('Email, password, and full name are required.', HttpStatus.BAD_REQUEST);
      } 
      return this.authService.register(userDto);
    } catch (error) {
      throw error; 
    }
  }

  @Post('signin')
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged.' })
  login(@Body() { email, password } : { email: string, password: string }) {
      try {
          if(!email || !password) {
            throw new HttpException('Email and password are required.', HttpStatus.BAD_REQUEST);
          }
          return this.authService.login(email, password)
      } catch (error) {
        throw error;
      }
  }

  @Post('change-password/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Change password success.' })
  changePassword(
    @Param('id') id: string, 
    @Body() { currentPassword, newPassword } : { currentPassword: string, newPassword: string }
  ) {
     try {
        if(!currentPassword || !newPassword) {
            throw new HttpException('Passwords are required.', HttpStatus.BAD_REQUEST);
        }
        return this.authService.changePassword(id, currentPassword, newPassword);
     } catch (error) {
        throw error;
     }
  }

  @Post('forgot-password')
  @ApiResponse({ status: HttpStatus.OK, description: 'Send reset password success.' })
  forgotPassword(@Body() { email }: { email: string }) {
     try {
        if(!email) {
            throw new HttpException('Email is required.', HttpStatus.BAD_REQUEST);
        }
        return this.authService.forgotPassword(email);
     } catch (error) {
        throw error;
     }
  }

  @Post('reset-password')
  @ApiResponse({ status: HttpStatus.OK, description: 'Reset password success.' })
  resetPassword(
    @Body() { token, password }: { token: string, password: string }
  ) {
     try {
        if(!token || !password) {
            throw new HttpException('Recover data is required.', HttpStatus.BAD_REQUEST);
        }
        return this.authService.resetPassword(token, password);
     } catch (error) {
        throw error;
     }
  }

  @Post('confirm')
  @ApiResponse({ status: HttpStatus.OK, description: 'Confirm account success.' })
  confirmAccount(
    @Body() { token }: { token: string }
  ) {
     try {
        if(!token) {
            throw new HttpException('Authentication data is required.', HttpStatus.BAD_REQUEST);
        }
        return this.authService.confirmAccount(token);
     } catch (error) {
        throw error;
     }
  }

}
