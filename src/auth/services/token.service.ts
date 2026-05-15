// src/auth/services/token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  createAccessToken(payload: JwtPayload) {
    return this.jwt.signAsync(payload, { expiresIn: '15m' });
  }

  createRefreshToken(payload: JwtPayload) {
    return this.jwt.signAsync(payload, { expiresIn: '7d' });
  }

  createEmailVerificationToken(payload: JwtPayload) {
    return this.jwt.signAsync(payload, { expiresIn: '1d' });
  }

  verifyAccessToken(token: string) {
    return this.jwt.verifyAsync<JwtPayload>(token);
  }

}