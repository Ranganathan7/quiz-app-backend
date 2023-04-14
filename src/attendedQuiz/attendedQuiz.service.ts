import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LOGGER } from '../common/core.module';
import {
  ApiSuccessResponse,
  CommonApiResponse,
} from 'src/common/models/api.models';
import { UserRepository } from 'src/user/repository/user.repository';
import { AttendedQuizRepository } from './repository/attendedQuiz.repository';
import { SubmitQuizDto } from './dto/attendedQuiz.dto';

@Injectable()
export class AttendedQuizService {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly attendedQuizRepository: AttendedQuizRepository,
  ) {}

  async getAll(emailId: string, requestId: string): Promise<CommonApiResponse> {
    this.logger.info(
      '[AttendedQuizService]: Api called to get all attended quizzes of an user.',
      [requestId],
    );
    try {
      const attendedQuizzes = await this.attendedQuizRepository.getAllWithEmailId(
        emailId,
        requestId,
      );
      this.logger.info(
        '[AttendedQuizService]: Fetched all attended Quizzes successfully.',
        [requestId],
      );
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Fetched all attended quizzes successfully!',
        data: attendedQuizzes,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[AttendedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  async submitQuiz(submitQuizDto: SubmitQuizDto, requestId: string): Promise<CommonApiResponse> {
    this.logger.info(
      '[AttendedQuizService]: Api called to submit a quiz.',
      [requestId],
    );
    try {
      const submittedQuiz = await this.attendedQuizRepository.submitQuiz(
        submitQuizDto,
        requestId,
      );
      this.logger.info(
        '[AttendedQuizService]: Submitted quiz successfully!.',
        [requestId],
      );
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Submitted quiz successfully!',
        data: submittedQuiz,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[AttendedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }
}