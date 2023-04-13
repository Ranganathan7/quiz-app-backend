import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LOGGER } from '../../common/core.module';
import { Logger } from 'winston';
import { CreatedQuiz } from '../entity/createdQuiz.entity';
import { CreateQuizDto, EditQuizDto } from '../dto/createdQuiz.dto';
import {
  calculateMaxScore,
  createQuizDescription,
} from '../../common/utils/createdQuiz.helper';

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
          createdByEmailId: emailId,
        })
        .sort({ updatedAt: -1 })
        .lean();
      return createdQuizzes;
    } catch (error) {
      this.logger.error(`[CreatedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createQuizDto: CreateQuizDto,
    quizId: string,
    requestId: string,
  ) {
    this.logger.info('[CreatedQuizRepository]: Api called to create a quiz.', [
      requestId,
    ]);
    //formatting createQuizDto to make it similar to create quiz entity
    const properCreateQuizDto: any = createQuizDto;
    const emailId = properCreateQuizDto.emailId;
    properCreateQuizDto.createdByEmailId = emailId;
    properCreateQuizDto.quizId = quizId;
    properCreateQuizDto.maxScore = calculateMaxScore(createQuizDto.questions);
    properCreateQuizDto.quizDescription = createQuizDescription(createQuizDto);
    //removing the emailId which comes from the DTO
    delete properCreateQuizDto.emailId;
    try {
      const createdQuiz = new this.createdQuizModel(properCreateQuizDto);
      return await createdQuiz.save();
    } catch (error) {
      this.logger.error(`[CreatedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findQuizWithQuizIdForAttendingIt(quizId: string, requestId: string) {
    this.logger.info(
      '[CreatedQuizRepository]: Api called to fetch quiz for attending it with quiz ID.',
      [requestId],
    );
    try {
      return await this.createdQuizModel
        .findOne({ quizId: quizId })
        .select('-questions.answer')
        .lean();
    } catch (error) {
      this.logger.error(`[CreatedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findQuizWithQuizId(quizId: string, requestId: string) {
    this.logger.info(
      '[CreatedQuizRepository]: Api called to fetch quiz with quiz ID.',
      [requestId],
    );
    try {
      return await this.createdQuizModel.findOne({ quizId: quizId }).lean();
    } catch (error) {
      this.logger.error(`[CreatedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteQuiz(quizId: string, requestId: string) {
    this.logger.info(
      '[CreatedQuizRepository]: Api called to delete the quiz with quiz ID.',
      [requestId],
    );
    try {
      return await this.createdQuizModel.deleteMany({ quizId: quizId }).exec();
    } catch (error) {
      this.logger.error(`[CreatedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editQuiz(editQuizDto: EditQuizDto, requestId: string) {
    this.logger.info('[CreatedQuizRepository]: Api called to edit a quiz.', [
      requestId,
    ]);
    try {
      //checking if request made is valid by
      this.logger.info(
        '[CreatedQuizRepository]: Checking if the emailId of the user is same the createdByEmailId of the quiz.',
        [requestId],
      );
      const existingQuiz = await this.findQuizWithQuizId(
        editQuizDto.quizId,
        requestId,
      );
      if (
        !existingQuiz ||
        existingQuiz.createdByEmailId !== editQuizDto.emailId
      ) {
        throw new HttpException(
          {
            message: 'No quiz created with the given quiz ID and emailId.',
            requestId: requestId,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      //removing the emailId 
      const { emailId, ...filteredEditQuizDto } = editQuizDto;
      //updating the sent fields
      const updatedQuiz =  await this.createdQuizModel.findOneAndUpdate(
        { quizId: editQuizDto.quizId },
        { $set: filteredEditQuizDto },
        { strict: true, new: true },
      );
      //updating quiz description
      updatedQuiz.quizDescription = createQuizDescription(updatedQuiz);
      return await updatedQuiz.save();
    } catch (error) {
      this.logger.error(`[CreatedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // for unit testing
  public getModel(): Model<CreatedQuiz> {
    return this.createdQuizModel;
  }
}
