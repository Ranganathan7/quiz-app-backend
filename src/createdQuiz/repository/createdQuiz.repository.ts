import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LOGGER } from '../../common/core.module';
import { Logger } from 'winston';
import { CreatedQuiz } from '../entity/createdQuiz.entity';

export class CreatedQuizRepository {
  constructor(
    @InjectModel(CreatedQuiz.name)
    private readonly createdQuizModel: Model<CreatedQuiz>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  async getAll(emailId: string, requestId: string) {
    this.logger.info(
      '[CreatedQuizRepository]: Api called to get all created quizzes of an user.',
      [requestId],
    );
    try {
      const createdQuizzes = await this.createdQuizModel
        .find({
          createdBy: emailId,
        })
        .sort({ updatedAt: -1 })
        .lean();
      return createdQuizzes;
    } catch (error) {
      this.logger.error(`[CreatedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
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

  // for unit testing
  public getModel(): Model<CreatedQuiz> {
    return this.createdQuizModel;
  }
}
