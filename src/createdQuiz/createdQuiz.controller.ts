import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
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
import { CreateQuizDto, EditQuizOptionsDto, EditQuizQuestionsDto, GetAllCreatedQuizDto } from './dto/createdQuiz.dto';

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

  @Post(CONSTANTS.ROUTES.CREATED_QUIZ.ATTEND_QUIZ.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.attendQuiz)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.attendQuiz))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async attendQuiz(
    @Query('quizId') quizId: string,
    @Body('emailId') emailId: string,
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[CreatedQuizController]: Api called to attend the quiz with quiz ID.', [
      requestId,
    ]);
    try {
      const response = await this.createdQuizService.attendQuiz(
        quizId,
        emailId,
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

  @Delete(CONSTANTS.ROUTES.CREATED_QUIZ.DELETE_QUIZ.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.deleteQuiz)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.deleteQuiz))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async deleteQuiz(
    @Query('quizId') quizId: string
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[CreatedQuizController]: Api called to delete the quiz with quiz ID.', [
      requestId,
    ]);
    try {
      const response = await this.createdQuizService.deleteQuiz(
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

  @Patch(CONSTANTS.ROUTES.CREATED_QUIZ.EDIT_QUIZ_OPTIONS.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.editQuizOptions)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.editQuizOptions))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async editQuizOptions(
    @Body() editQuizOptionsDto: EditQuizOptionsDto
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[CreatedQuizController]: Api called to edit a quiz options.', [
      requestId,
    ]);
    try {
      const response = await this.createdQuizService.editQuiz(editQuizOptionsDto, requestId);
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

  @Patch(CONSTANTS.ROUTES.CREATED_QUIZ.EDIT_QUIZ_QUESTIONS.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.editQuizQuestions)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.editQuizQuestions))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async editQuizQuestions(
    @Body() editQuizQuestionsDto: EditQuizQuestionsDto
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info('[CreatedQuizController]: Api called to edit a quiz questions.', [
      requestId,
    ]);
    try {
      const response = await this.createdQuizService.editQuiz(editQuizQuestionsDto, requestId);
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
