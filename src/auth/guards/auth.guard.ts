// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new HttpException('Authorization token missing', HttpStatus.UNAUTHORIZED);
      }

      const payload = await this.jwtService.verifyAsync(token);

      request['user'] = { 
          userId: payload.sub,
          fullName: payload.username,
          role: payload.role 
      };

      return true; 

    } catch (e: any) {
      console.error('JWT Validation Error:', e.message);
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }
}