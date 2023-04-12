import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LOGGER } from '../common/core.module';
import {
  ApiSuccessResponse,
  CommonApiResponse,
} from 'src/common/models/api.models';
import { CreatedQuizRepository } from './repository/createdQuiz.repository';

@Injectable()
export class CreatedQuizService {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly createdQuizRepository: CreatedQuizRepository,
  ) {}

  async getAll(emailId: string, requestId: string): Promise<CommonApiResponse> {
    this.logger.info('[CreatedQuizService]: Api called to get all created quizzes of an user.', [
      requestId,
    ]);
    try {
      const createdQuizzes = this.createdQuizRepository.getAll(emailId, requestId);
      this.logger.info('[CreatedQuizService]: Fetched all created Quizzes successfully.', [
        requestId,
      ]);
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Fetched all created quizzes successfully!',
        data: createdQuizzes,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[CreatedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }
}
