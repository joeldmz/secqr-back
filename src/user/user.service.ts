import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from 'src/prisma/client/client';
@Injectable()
export class UserService {

  constructor(
    private readonly prisma: PrismaService
  ) {}
  
  private logger = new Logger('User service');
  
  async create(userModel: User) {
    this.logger.log(`Initiating user creation process.`);
    try {
      return await this.prisma.user.create({
        data: {
          email: userModel.email,
          password: userModel.password,
          firstName: userModel.firstName,
          lastName: userModel.lastName,
          alias: `@${userModel.firstName}${userModel.lastName}`.toLocaleLowerCase(),
          role: UserRole.ADMIN
        },
      });
    } catch (error) {
        this.logger.error(`Operation failed while creating user`, error);
        throw error;
    }
  }

  async findAll() {
    this.logger.log(`Getting all users.`);
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      this.logger.error(`Operation failed while getting user`, error);
      throw error;
    }
  }

  async findOne(id: string) {
    this.logger.log(`Searching for user with ID: ${id}`);
    try {
      return this.prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      this.logger.error(`Operation failed while finding user ID ${id}`, error);
      throw error;
    }
    
  }

  findByEmail(email: string) {
    this.logger.log(`Searching for user with Email: ${email}`);
    try {
      const user = this.prisma.user.findUnique({
        where: { email }
      })
      return user;
    } catch (error) {
      this.logger.error(`Operation failed while finding user Email ${email}`, error);
      throw error;
    }
  }

  async update(id: string, userModel: User) {
    this.logger.log(`Updating for user with ID: ${id}`);
    try {
      return this.prisma.user.update({
        where: { id },
        data: userModel,
      });
    } catch (error) {
      this.logger.error(`Operation failed while updating user`, error);
      throw error;
    }
  }

  async updatePassword(id: string, newPasswordHash: string) {
    this.logger.log(`Updating password for user ${id}`);
    try {
      return this.prisma.user.update({
        where: { id },
        data: { password: newPasswordHash }
      });
    } catch (error) {
      this.logger.error(`Operation failed while updating password`, error);
      throw error;
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing for user with ID: ${id}`);
    try {
      return this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Operation failed while removing user ID ${id}`, error);
      throw error;
    }
  }
}
