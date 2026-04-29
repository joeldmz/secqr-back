import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User, UserRole } from 'src/prisma/client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptGuard } from './guards/crypt.guard';
import { PrismaErrorService } from 'src/prisma/error.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService, 
        private crypto: CryptGuard,
        private jwtService: JwtService
      ) {}
      
    private logger = new Logger('User service');
    
    async register(userModel: User) {
        this.logger.log('creating user...');
        try {
            const hashedPassword = await this.crypto.hashPassword(userModel.password);
            return await this.prisma.user.create({
                data: {
                    email: userModel.email,
                    password: hashedPassword,
                    fullName: userModel.fullName,
                    role: userModel.role
                },
            });
        } catch (error) {
            this.logger.log('Error to create user:', error);
            const dbError = PrismaErrorService.mapError(error)
            throw new HttpException(
                { 
                    statusCode: dbError.httpStatus, 
                    message: dbError.message 
                }, 
                dbError.httpStatus
            );
        }
    }

    async login(email: string, password: string) {
        this.logger.log('logging user...');
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            })

            if (!user?.password) {
                throw new HttpException('Email or password incorrect.', HttpStatus.UNAUTHORIZED);
            }

            const isValidPassword = await this.crypto.comparePassword(password, user.password);

            if(!isValidPassword) {
                throw new HttpException('Email or password incorrect.', HttpStatus.UNAUTHORIZED);
            }

             const payload = { 
                sub: user.id, 
                username: user.fullName, 
                role: user.role 
            }

            return { access_token: await this.jwtService.signAsync(payload) };
        } catch (error) {
            this.logger.log('Error to logging user:', error);
            const dbError = PrismaErrorService.mapError(error)
            throw new HttpException(
                { 
                    statusCode: dbError.httpStatus, 
                    message: dbError.message 
                }, 
                dbError.httpStatus
            );
        }
    }
}
