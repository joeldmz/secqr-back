import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { CryptGuard } from './guards/crypt.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [ 
    PrismaModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'ALTERNATIVE_KEY',
      signOptions: { expiresIn: '7d'}
    }) 
  ],
  controllers: [AuthController],
  providers: [ 
    AuthService, 
    AuthGuard,
    CryptGuard,
    UserService,
    MailService
  ],
  exports: [ AuthGuard , AuthService, CryptGuard ]
})
export class AuthModule {}
