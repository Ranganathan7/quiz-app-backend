import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LOGGER } from '../../common/core.module';
import { Logger } from 'winston';
import { AttendedQuiz } from '../entity/attendedQuiz.entity';
import { SubmitQuizDto } from '../dto/attendedQuiz.dto';

export class AttendedQuizRepository {
  constructor(
    @InjectModel(AttendedQuiz.name)
    private readonly attendedQuizModel: Model<AttendedQuiz>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  async getAllWithEmailId(emailId: string, requestId: string) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to get all attended quizzes of an user.',
      [requestId],
    );
    try {
      const attendedQuizzes = await this.attendedQuizModel
        .find({
          attendedByEmailId: emailId,
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

  async getAllWithQuizId(quizId: string, requestId: string) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to get all attended quizzes with quiz ID.',
      [requestId],
    );
    try {
      const attendedQuizzes = await this.attendedQuizModel
        .find({
          quizId: quizId,
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

  async getOneWithQuizIdAndEmailId(
    quizId: string,
    emailId: string,
    requestId: string,
  ) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to get one attended quiz with Quiz ID and email ID.',
      [requestId],
    );
    try {
      return await this.attendedQuizModel
        .findOne({
          quizId: quizId,
          attendedByEmailId: emailId,
        })
        .lean();
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

  async deleteAllWithQuizId(quizId: string, requestId: string) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to delete all attended quizzes with quiz ID.',
      [requestId],
    );
    try {
      await this.attendedQuizModel.deleteMany({ quizId: quizId }).exec();
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

  async submitQuiz(submitQuizDto: SubmitQuizDto, requestId: string) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to submit a quiz.',
      [requestId],
    );
    try {
      //removing the emailId
      const { emailId, ...filteredSubmitQuizDto } = submitQuizDto;
      const submitQuiz = { ...filteredSubmitQuizDto, attemptedByEmailId: emailId}
      //write all the logic
      
      const submitQuizModel = new this.attendedQuizModel(submitQuiz);
      return submitQuizModel.save();
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
