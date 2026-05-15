import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { CryptoService } from './services/crypto.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [ 
    PrismaModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'ALTERNATIVE_KEY'
    }) 
  ],
  controllers: [AuthController],
  providers: [ 
    AuthService, 
    JwtAuthGuard,
    CryptoService,
    TokenService,
    UserService,
    MailService
  ],
  exports: [ 
    AuthService,
    CryptoService,
    TokenService,
    JwtAuthGuard
  ]
})
export class AuthModule {}
