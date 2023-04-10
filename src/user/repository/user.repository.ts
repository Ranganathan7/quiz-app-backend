import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { LoginDto, SignupDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entity/user.entity';
import { Model } from 'mongoose';
import { LOGGER } from '../../common/core.module';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';

export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  async createUser(signupDto: SignupDto, requestId: string) {
    this.logger.info('[UserRepository]: Api called to signup an user', [
      requestId,
    ]);
    //checking if email ID is unique
    const existingEmailId = await this.isEmailIdUnique(
      signupDto.emailId,
      requestId,
    );
    if (existingEmailId) {
      throw new HttpException(
        {
          message: 'Provided email ID already exists.',
          requestId: requestId,
        },
        HttpStatus.CONFLICT,
      );
    }
    //checking if username is unique
    const existingUserName = await this.isUserNameUnique(
      signupDto.userName,
      requestId,
    );
    if (existingUserName) {
      throw new HttpException(
        {
          message: 'Provided user name already exists.',
          requestId: requestId,
        },
        HttpStatus.CONFLICT,
      );
    }
    try {
      //hashing the password
      signupDto.password = await bcrypt.hash(signupDto.password, 12);
      const newUser = new this.userModel({
        ...signupDto,
        createdQuizzes: [],
        attendedQuizzes: [],
      });
      return await newUser.save();
    } catch (error) {
      this.logger.error(`[UserRepository]: ${error.message}`, [requestId]);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          { message: error.message, requestId: requestId },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getUser(loginDto: LoginDto, requestId: string) {
    this.logger.info(
      '[UserRepository]: Api called to fetch user with email ID and password',
      [requestId],
    );
    try {
      const user = await this.userModel.findOne({
        emailId: loginDto.emailId,
      });
      if (!user) {
        throw new HttpException(
          {
            message: 'No user found with given credentials.',
            requestId: requestId,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (!(await bcrypt.compare(loginDto.password, user.password))) {
        throw new HttpException(
          {
            message: 'No user found with given credentials.',
            requestId: requestId,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      this.logger.error(`[UserRepository]: ${error.message}`, [requestId]);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isUserNameUnique(userName: string, requestId: string) {
    this.logger.info(
      '[UserRepository]: Api called to fetch user with user name',
      [requestId],
    );
    try {
      return this.userModel.findOne({ userName: userName });
    } catch (error) {
      this.logger.error(`[UserRepository]: ${error.message}`, [requestId]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isEmailIdUnique(emailId: string, requestId: string) {
    this.logger.info(
      '[UserRepository]: Api called to fetch user with email ID',
      [requestId],
    );
    try {
      return this.userModel.findOne({ emailId: emailId });
    } catch (error) {
      this.logger.error(`[UserRepository]: ${error.message}`, [requestId]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // for unit testing
  public getModel(): Model<User> {
    return this.userModel;
  }
}
