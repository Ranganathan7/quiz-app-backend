import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LOGGER } from '../common/core.module';
import {
  ApiSuccessResponse,
  CommonApiResponse,
} from 'src/common/models/api.models';
import { EditProfileDto, LoginDto, SignupDto } from './dto/user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async signup(
    signupDto: SignupDto,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info('[UserService]: Api called to signup an user.', [
      requestId,
    ]);
    try {
      const createdUser = await this.userRepository.createUser(
        signupDto,
        requestId,
      );
      this.logger.info('[UserService]: Signup successful', [requestId]);
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'User registered successfully!',
        data: createdUser,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[UserService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  async login(
    loginDto: LoginDto,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info('[UserService]: Api called to login an user.', [
      requestId,
    ]);
    try {
      const getUser = await this.userRepository.getUser(loginDto, requestId);
      this.logger.info('[UserService]: Login successful', [requestId]);
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Login successful!',
        data: getUser,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[UserService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  async editProfile(
    editProfileDto: EditProfileDto,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info('[UserService]: Api called to edit profile of an user.', [
      requestId,
    ]);
    try {
      const getUser = await this.userRepository.editProfile(
        editProfileDto,
        requestId,
      );
      this.logger.info('[UserService]: Edited profile successfully', [
        requestId,
      ]);
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'User name updated successfully!',
        data: getUser,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[UserService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  async alreadyLoggedin(
    emailId: string,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info(
      '[UserService]: Api called to check if an user is already loggedin.',
      [requestId],
    );
    try {
      const user = await this.userRepository.findUserWithEmailId(
        emailId,
        requestId,
      );
      //if user exists it means the user is already logged in
      if (user) {
        //removing emailID and password before sending response
        const { emailId, password, ...filteredUser } = user;
        const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
          statusCode: HttpStatus.OK,
          timestamp: new Date().toISOString(),
          requestId: requestId,
          message: 'User is already logged in!',
          data: filteredUser,
        };
        return apiResult;
      } else {
        this.logger.error(`[UserService]: No access token in header.`);
        throw new HttpException(
          {
            message:
              'Unauthorized request made to API without a valid access token.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      this.logger.error(`[UserService]: ${error.message}`, [requestId]);
      throw error;
    }
  }
}
