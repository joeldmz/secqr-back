import { ConflictException, HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from 'src/prisma/client/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaErrorService } from 'src/prisma/error.service';
@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}
  
  private logger = new Logger('User service');
  
  async create(userModel: User) {
    this.logger.log('creating user...');
    try {
      return await this.prisma.user.create({
        data: {
          email: userModel.email,
          password: userModel.password,
          fullName: userModel.fullName,
          role: UserRole.ADMIN
        },
      });
    } catch (error) {
        console.error('Error to create user:', error);
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

  async findAll() {
    this.logger.log('getting all users...');
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      console.error('Error to get users:', error);
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

  async findOne(id: string) {
    this.logger.log('getting user...');
    try {
      return this.prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error to get user:', error);
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

  async update(id: string, userModel: User) {
    this.logger.log('updating user...');
    try {
      return this.prisma.user.update({
        where: { id },
        data: userModel,
      });
    } catch (error) {
      console.error('Error to update user:', error);
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

  async remove(id: string) {
    this.logger.log('deleting user...');
    try {
      return this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error to remove user:', error);
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
