import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LOGGER } from '../../common/core.module';
import { Logger } from 'winston';
import { AttendedQuiz } from '../entity/attendedQuiz.entity';

export class AttendedQuizRepository {
  constructor(
    @InjectModel(AttendedQuiz.name)
    private readonly attendedQuizModel: Model<AttendedQuiz>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  async getAll(emailId: string, requestId: string) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to get all attended quizzes of an user.',
      [requestId],
    );
    try {
      const attendedQuizzes = await this.attendedQuizModel
        .find({
          createdByEmailId: emailId,
        })
        .sort({ updatedAt: -1 })
        .lean();
      return attendedQuizzes;
    } catch (error) {
      this.logger.error(`[AttendedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // for unit testing
  public getModel(): Model<AttendedQuiz> {
    return this.attendedQuizModel;
  }
}
