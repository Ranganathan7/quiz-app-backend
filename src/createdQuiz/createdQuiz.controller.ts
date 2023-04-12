import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
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
import { CommonApiResponse } from '../common/models/api.models';
import { randomUUID } from 'crypto';
import { Logger } from 'winston';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { LOGGER } from '../common/core.module';
import { operations } from '../common/openapi/operations';
import { responses } from '../common/openapi/responses';
import * as sampleResponses from './reqres/sample-responses.json';
import { AuthGuard } from '../common/auth/auth.guard';
import { CreatedQuizService } from './createdQuiz.service';
import { CreateQuizDto, GetAllCreatedQuizDto } from './dto/createdQuiz.dto';

@Controller(CONSTANTS.ROUTES.CREATED_QUIZ.CONTROLLER)
@ApiTags(CONSTANTS.ROUTES.CREATED_QUIZ.TAG)
@UseFilters(CommonExceptionFilter)
@UseGuards(AuthGuard)
export class CreatedQuizController {
  constructor(
    private readonly createdQuizService: CreatedQuizService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post(CONSTANTS.ROUTES.CREATED_QUIZ.GET_ALL_QUIZ.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.getAllCreatedQuizzes)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.getAllQuiz))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async getAll(
    @Body() getAllCreatedQuizDto: GetAllCreatedQuizDto,
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info(
      '[CreatedQuizController]: Api called to get all created quizzes of an user.',
      [requestId],
    );
    try {
      const response = await this.createdQuizService.getAll(
        getAllCreatedQuizDto.emailId,
        requestId,
      );
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[CreatedQuizController]: ${error.message}`, [
        requestId,
      ]);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  @Post(CONSTANTS.ROUTES.CREATED_QUIZ.CREATE_QUIZ.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.createQuiz)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.createQuiz))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async create(
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[CreatedQuizController]: Api called to create a quiz.', [
      requestId,
    ]);
    try {
      const response = await this.createdQuizService.create(
        createQuizDto,
        requestId,
      );
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[CreatedQuizController]: ${error.message}`, [
        requestId,
      ]);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  @Get(CONSTANTS.ROUTES.CREATED_QUIZ.GET_ONE_WITH_QUIZ_ID.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.getQuizWithQuizId)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.getQuizWithQuizId))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async getQuizWithQuizId(
    @Query('quizId') quizId: string
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[CreatedQuizController]: Api called to create a quiz.', [
      requestId,
    ]);
    try {
      const response = await this.createdQuizService.getQuizWithQuizId(
        quizId,
        requestId,
      );
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[CreatedQuizController]: ${error.message}`, [
        requestId,
      ]);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
