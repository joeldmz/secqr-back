import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from 'src/prisma/client/client';
import { PrismaErrorService } from 'src/prisma/error.service';
@Injectable()
export class UserService {

  constructor(
    private readonly prisma: PrismaService
  ) {}
  
  private logger = new Logger('User service');
  
  async create(userModel: User) {
    this.logger.log('creating user...');
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
        this.logger.error('Error to create user:', error);
        throw error;
    }
  }

  async findAll() {
    this.logger.log('getting all users...');
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      this.logger.error('Error to get users:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    this.logger.log('getting user...');
    try {
      return this.prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      this.logger.error('Error to get user:', error);
      throw error;
    }
    
  }

  findByEmail(email: string) {
    this.logger.log('getting user...');
    try {
      const user = this.prisma.user.findUnique({
        where: { email }
      })
      return user;
    } catch (error) {
      this.logger.error('Error to get user:', error);
      throw error;
    }
  }

  async update(id: string, userModel: User) {
    this.logger.log('updating user...');
    try {
      return this.prisma.user.update({
        where: { id },
        data: userModel,
      });
    } catch (error) {
      this.logger.error('Error to update user:', error);
      throw error;
    }
    
  }

  async remove(id: string) {
    this.logger.log('deleting user...');
    try {
      return this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error('Error to remove user:', error);
      throw error;
    }
  }
}
