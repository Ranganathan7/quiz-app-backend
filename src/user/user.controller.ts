import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CONSTANTS } from '../common/config/configuration';
import { CommonExceptionFilter } from '../common/filters/common-exception.filter';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AlreadyLoggedinDto, EditProfileDto, LoginDto, SignupDto } from './dto/user.dto';
import {
  ApiSuccessResponse,
  CommonApiResponse,
} from '../common/models/api.models';
import { randomUUID } from 'crypto';
import { Logger } from 'winston';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { FastifyReply } from 'fastify';
import { LOGGER } from '../common/core.module';
import { UserService } from './user.service';
import { operations } from '../common/openapi/operations';
import { responses } from '../common/openapi/responses';
import * as sampleResponses from './reqres/sample-responses.json';
import { AuthGuard } from '../common/auth/auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller(CONSTANTS.ROUTES.USER.CONTROLLER)
@ApiTags(CONSTANTS.ROUTES.USER.TAG)
@UseFilters(CommonExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post(CONSTANTS.ROUTES.USER.SIGNUP.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.singup)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.signup))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    const cookie = await this.configService.get('cookie');
    session.startTransaction();
    this.logger.info('[UserController]: Api called to signup an user', [
      requestId,
    ]);
    try {
      const response: CommonApiResponse = await this.userService.signup(
        signupDto,
        requestId,
      );
      //setting the cookie
      res.setCookie(cookie.field, response.data.access_token);
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[UserController]: ${error.message}`, [requestId]);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  @Post(CONSTANTS.ROUTES.USER.LOGIN.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.login)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.login))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    const cookie = await this.configService.get('cookie');
    session.startTransaction();
    this.logger.info('[UserController]: Api called to login an user', [
      requestId,
    ]);
    try {
      const response: CommonApiResponse = await this.userService.login(
        loginDto,
        requestId,
      );
      //setting the cookie
      res.setCookie(cookie.field, response.data.access_token);
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[UserController]: ${error.message}`, [requestId]);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  // @Patch(CONSTANTS.ROUTES.USER.EDIT_PROFILE.PATH)
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard)
  // @ApiOperation(operations.editProfile)
  // @ApiOkResponse(responses.apiOkResponse(sampleResponses.editProfile))
  // @ApiBadRequestResponse(responses.apiBadRequestResponse)
  // @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  // @ApiForbiddenResponse(responses.apiForbiddenResponse)
  // @ApiNotFoundResponse(responses.apiNotFoundResponse)
  // @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  // async editProfile(
  //   @Body() editProfileDto: EditProfileDto,
  // ): Promise<CommonApiResponse> {
  //   const requestId = randomUUID();
  //   const session = await this.connection.startSession();
  //   session.startTransaction();
  //   this.logger.info(
  //     '[UserController]: Api called to edit profile of an user',
  //     [requestId],
  //   );
  //   try {
  //     const user: CommonApiResponse = await this.userService.editProfile(
  //       editProfileDto,
  //       requestId,
  //     );
  //     await session.commitTransaction();
  //     return user;
  //   } catch (error) {
  //     await session.abortTransaction();
  //     this.logger.error(`[UserController]: ${error.message}`, [requestId]);
  //     throw error;
  //   } finally {
  //     await session.endSession();
  //   }
  // }

  @Get(CONSTANTS.ROUTES.USER.LOGOUT.PATH)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation(operations.logout)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.logout))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async logout(
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const cookie = await this.configService.get('cookie');
    this.logger.info('[UserController]: Api called to logout an user', [
      requestId,
    ]);
    try {
      const response: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Logout successful!',
        data: {
          message: 'All cookies of quiz-app cleared.',
        },
      };
      //clearing the cookie
      // res.clearCookie(cookie.field);
      const expiredDate = new Date(0);
      res.setCookie(cookie.field, null, {
        expires: expiredDate,
      });
      return response;
    } catch (error) {
      this.logger.error(`[UserController]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  @Post(CONSTANTS.ROUTES.USER.ALREADY_LOGGEDIN.PATH)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation(operations.alreadyLoggedin)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.alreadyLoggedin))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async isAlreadyLoggedIn(
    @Body() alreadyLoggedinDto: AlreadyLoggedinDto
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info(
      '[UserController]: Api called to check if an user is already logged in',
      [requestId],
    );
    try {
      const user: CommonApiResponse = await this.userService.alreadyLoggedin(
        alreadyLoggedinDto.emailId,
        requestId,
      );
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[UserController]: ${error.message}`, [requestId]);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
