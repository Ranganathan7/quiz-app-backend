import {
  Body,
  Controller,
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
import { GetAllAttendedQuizDto } from './dto/attendedQuiz.dto';
import { AttendedQuizService } from './attendedQuiz.service';

@Controller(CONSTANTS.ROUTES.ATTENDED_QUIZ.CONTROLLER)
@ApiTags(CONSTANTS.ROUTES.ATTENDED_QUIZ.TAG)
@UseFilters(CommonExceptionFilter)
@UseGuards(AuthGuard)
export class AttendedQuizController {
  constructor(
    private readonly attendedQuizService: AttendedQuizService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post(CONSTANTS.ROUTES.ATTENDED_QUIZ.GET_ALL_QUIZ.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(operations.getAllAttendedQuizzes)
  @ApiOkResponse(responses.apiOkResponse(sampleResponses.getAllQuiz))
  @ApiBadRequestResponse(responses.apiBadRequestResponse)
  @ApiUnauthorizedResponse(responses.apiUnauthorizedResponse)
  @ApiForbiddenResponse(responses.apiForbiddenResponse)
  @ApiNotFoundResponse(responses.apiNotFoundResponse)
  @ApiInternalServerErrorResponse(responses.apiInternalServerErrorResponse)
  async getAll(
    @Body() getAllattendedQuizDto: GetAllAttendedQuizDto,
  ): Promise<CommonApiResponse> {
    const requestId = randomUUID();
    const session = await this.connection.startSession();
    session.startTransaction();
    this.logger.info(
      '[AttendedQuizController]: Api called to get all attended quizzes of an user.',
      [requestId],
    );
    try {
      const response = await this.attendedQuizService.getAll(
        getAllattendedQuizDto.emailId,
        requestId,
      );
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[AttendedQuizController]: ${error.message}`, [
        requestId,
      ]);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
