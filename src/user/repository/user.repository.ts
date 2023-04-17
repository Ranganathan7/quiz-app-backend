import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { EditProfileDto, LoginDto, SignupDto } from '../dto/user.dto';
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
    try {
      //checking if email ID is unique
      const existingEmailId = await this.findUserWithEmailId(
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
      const existingUserName = await this.findUserWithUserName(
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
      //hashing the password
      const hashedPassword = await bcrypt.hash(signupDto.password, 12);
      const newUser = new this.userModel({
        ...signupDto,
        password: hashedPassword,
      });
      //creating the user
      await newUser.save();
      //logging in the user
      return await this.getUser(
        { emailId: signupDto.emailId, password: signupDto.password },
        requestId,
      );
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
      const user = await this.userModel
        .findOne({
          emailId: loginDto.emailId,
        })
        .lean();
      if (!user) {
        throw new HttpException(
          {
            message: 'Invalid credentials.',
            requestId: requestId,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.info('[UserRepository]: Checking if password is matching.', [
        requestId,
      ]);
      if (!(await bcrypt.compare(loginDto.password, user.password))) {
        throw new HttpException(
          {
            message: 'Invalid credentials.',
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

  async findUserWithUserName(userName: string, requestId: string) {
    this.logger.info(
      '[UserRepository]: Api called to fetch user with user name',
      [requestId],
    );
    try {
      return await this.userModel.findOne({ userName: userName })
        .select('-password')
        .lean();
    } catch (error) {
      this.logger.error(`[UserRepository]: ${error.message}`, [requestId]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserWithEmailId(emailId: string, requestId: string) {
    this.logger.info(
      '[UserRepository]: Api called to fetch user with email ID',
      [requestId],
    );
    try {
      return await this.userModel.findOne({ emailId: emailId })
        .select('-password')
        .lean();
    } catch (error) {
      this.logger.error(`[UserRepository]: ${error.message}`, [requestId]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editProfile(editProfileDto: EditProfileDto, requestId: string) {
    this.logger.info(
      '[UserRepository]: Api called to edit profile of an user',
      [requestId],
    );
    try {
      //checking if new username is unique
      const existingUserName = await this.findUserWithUserName(
        editProfileDto.userName,
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
      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { emailId: editProfileDto.emailId },
          { $set: { userName: editProfileDto.userName } },
          { strict: true, new: true },
        )
        .select('-password emailId')
        .lean();
      return updatedUser;
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
