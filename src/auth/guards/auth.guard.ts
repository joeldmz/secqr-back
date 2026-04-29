// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('CryptGuard');
  
  constructor(private readonly jwtService: JwtService, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
          throw new HttpException('Authorization token missing', HttpStatus.UNAUTHORIZED);
        }

        const payload = await this.jwtService.verifyAsync(token);
        const userId = payload.sub;

        const user = await this.userService.findOne(userId)

        if(!user || !user.isActive) {
          throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }
        
        request['user'] = { 
            userId: payload.sub,
            alias: payload.alias,
            role: payload.role 
        };

        return true; 

    } catch (e: any) {
        this.logger.error('JWT Validation Error:', e.message);
        throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }
}