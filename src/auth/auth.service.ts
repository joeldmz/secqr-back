import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/prisma/client/client';
import { CryptGuard } from './guards/crypt.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private crypto: CryptGuard,
        private jwtService: JwtService,
        private userService: UserService
      ) {}
      
    private logger = new Logger('Auth service');
    
    async register(userModel: User) {
        this.logger.log('singing up...');
        try {
            userModel.password = await this.crypto.hashPassword(userModel.password);
            const user = await this.userService.create(userModel)

            const payload = { 
                sub: user.id,
                alias: user.alias,
                role: user.role 
            }

            return {
                access_token: await this.jwtService.signAsync(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    alias: user.alias
                }
            }

        } catch (error) {
            this.logger.log('Error to signup user:', error);
            throw error;
        }
    }

    async login(email: string, password: string) {
        this.logger.log('logging user...');
        try {
            const user = await this.userService.findByEmail(email)

            if (!user) {
                throw new HttpException('Email or password incorrect.', HttpStatus.UNAUTHORIZED);
            }

            if(!user.isActive) {
                throw new HttpException('User inactive.', HttpStatus.UNAUTHORIZED);
            }

            const isValidPassword = await this.crypto.comparePassword(password, user.password);

            if(!isValidPassword) {
                throw new HttpException('Email or password incorrect.', HttpStatus.UNAUTHORIZED);
            }

            const payload = { 
                sub: user.id,
                alias: user.alias,
                role: user.role 
            }

            return { access_token: await this.jwtService.signAsync(payload) };
        } catch (error) {
            this.logger.log('Error to logging user:', error);
            throw error;
        }
    }
}
