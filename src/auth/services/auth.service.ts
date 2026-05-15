import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/prisma/client/client';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { CryptoService } from './crypto.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        private cryptoService: CryptoService,
        private tokenService: TokenService,
        private userService: UserService,
        private mailService: MailService
      ) {}
      
    private logger = new Logger('Auth service');
    
    async register(userModel: User) {
        this.logger.log(`Initiating signin process.`);
        try {
            userModel.password = await this.cryptoService.hashPassword(userModel.password);
            const user = await this.userService.create(userModel)

            const payload = { 
                sub: user.id,
                email: user.email,
                role: user.role 
            }

            const token = await this.tokenService.createEmailVerificationToken(payload)
            await this.mailService.sendEmail(
                {
                    to: user.email,
                    subject: 'Welcome to Secqrity - Confirm your account',
                    template: 'signup-confirmation-template',
                    context: {
                        name: user.alias,
                        verificationLink: `${process.env.CLIENT_URL}/confirm/${token}`
                    },
                }
            )

            return {
                message: `Account created successfully.`,
            }
        } catch (error) {
            this.logger.log(`Operation failed while signin user:`, error);
            throw error;
        }
    }

    async login(email: string, password: string) {
        this.logger.log(`Initiating login process.`);
        try {
            const user = await this.userService.findByEmail(email)

            if (!user) {
                throw new HttpException(`Email or password incorrect.`, HttpStatus.UNAUTHORIZED);
            }

            if(!user.active) {
                throw new HttpException(`User inactive.`, HttpStatus.UNAUTHORIZED);
            }

            if(!user.confirmed) {
                throw new HttpException(`Account not confirmed.`, HttpStatus.UNAUTHORIZED);
            }

            const isValidPassword = await this.cryptoService.comparePassword(password, user.password);

            if(!isValidPassword) {
                throw new HttpException(`Email or password incorrect.`, HttpStatus.UNAUTHORIZED);
            }

            const payload = { 
                sub: user.id,
                email: user.email,
                role: user.role 
            }

            return { access_token: await this.tokenService.createAccessToken(payload) };
        } catch (error) {
            this.logger.log(`Operation failed while login user:`, error);
            throw error;
        }
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        this.logger.log(`Changing password for user ${userId}...`);
        try {
            const user = await this.userService.findOne(userId);
            if (!user) {
                throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
            }

            const isMatch = await this.cryptoService.comparePassword(currentPassword, user.password);
            if (!isMatch) {
                throw new HttpException(`Incorrect current password.`, HttpStatus.UNAUTHORIZED);
            }

            const newPasswordHash = await this.cryptoService.hashPassword(newPassword);

            await this.userService.updatePassword(userId, newPasswordHash);
            
            return { message: `Password updated successfully.` };
        } catch (error) {
            this.logger.error(`Operation failed while change password:`, error);
            throw error;
        }
    }

    async forgotPassword(email: string) {
        this.logger.log(`Initiating forgot password precess.`);
        try {
            const user = await this.userService.findByEmail(email);

            if (!user) {
                throw new HttpException(`User not found for email: ${email}`, HttpStatus.UNAUTHORIZED);
            }

            const payload = { 
                sub: user.id,
                email: user.email,
                role: user.role
            }

            const token = await this.tokenService.createEmailVerificationToken(payload);

            // update new token
            user.token = token;
            await this.userService.update(user.id,user);

            await this.mailService.sendEmail(
                {
                    to: user.email,
                    subject: 'Recover password request',
                    template: 'forgot-password-template',
                    context: {
                        name: user.alias,
                        verificationLink: `${process.env.CLIENT_URL}/recover-password/${token}`
                    },
                }
            )

            return {
                message: `Email instructions send successfully`
            };
        } catch (error) {
            this.logger.error(`Operation failed while forgot password process:`, error);
            throw error;
        }
    }

    async resetPassword(token: string, password: string): Promise<any> {
        this.logger.log(`Initiating password reset`);
        try {
            const payload = await this.tokenService.verifyAccessToken(token);
            const user = await this.userService.findByEmail(payload.email);
            if(!user) {
                throw new HttpException(`User not found for email: ${payload.email}`, HttpStatus.UNAUTHORIZED);
            }

            if(!user.active) {
                throw new HttpException(`User is inactive for email: ${payload.email}`, HttpStatus.BAD_REQUEST);
            }

            // update new password and reset token
            user.password = await this.cryptoService.hashPassword(password);
            user.token = null;
            await this.userService.update(user.id, user);

            return {
                message: `Password reset succesfully.`
            }

        } catch (error) {
            this.logger.error(`Operation failed while reset password:`, error);
            throw error;
        }
    }

    async confirmAccount(token: string) {
        this.logger.log(`Initiating confirm account process.`);
        try {
            const payload = await this.tokenService.verifyAccessToken(token);
            const user = await this.userService.findByEmail(payload.email);

            if(!user) {
                throw new HttpException(`User not found for email: ${payload.email}`, HttpStatus.UNAUTHORIZED);
            }

            if(!user.active) {
                throw new HttpException(`User is inactive for email: ${payload.email}`, HttpStatus.BAD_REQUEST);
            }

            user.confirmed = true;
            await this.userService.update(user.id, user);

            return {
                message: `Account confirmed successfully.`
            };
        } catch (error) {
            this.logger.error(`Operation failed while confirm account:`, error);
            throw error;
        }
    }
}
