import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseFilters,
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
import { LoginDto, SignupDto } from './dto/user.dto';
import { CommonApiResponse } from '../common/models/api.models';
import { randomUUID } from 'crypto';
import { Logger } from 'winston';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { LOGGER } from 'src/common/core.module';
import { UserService } from './user.service';
import { operations } from '../common/openapi/operations';
import { responses } from '../common/openapi/responses';
import * as sampleResponses from './reqres/sample-responses.json';

@Controller(CONSTANTS.ROUTES.USER.CONTROLLER)
@ApiTags(CONSTANTS.ROUTES.USER.TAG)
@UseFilters(CommonExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
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
  async signup(@Body() signupDto: SignupDto): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[UserController]: Api called to signup an user', [
      requestId,
    ]);
    try {
      const createdUser: CommonApiResponse = await this.userService.signup(
        signupDto,
        requestId,
      );
      await session.commitTransaction();
      return createdUser;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[UserController]: ${error.message}`, [requestId]);
      throw error;
    } finally {
      session.endSession();
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
  async login(@Body() loginDto: LoginDto): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[UserController]: Api called to login an user', [
      requestId,
    ]);
    try {
      const user: CommonApiResponse = await this.userService.login(
        loginDto,
        requestId,
      );
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[UserController]: ${error.message}`, [requestId]);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
