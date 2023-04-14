import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LOGGER } from '../../common/core.module';
import { Logger } from 'winston';
import { CreatedQuiz } from '../entity/createdQuiz.entity';
import {
  CreateQuizDto,
  EditQuizQuestionsDto,
  EditQuizOptionsDto,
} from '../dto/createdQuiz.dto';
import {
  calculateMaxScore,
  createQuizDescription,
  generateQuestionIdsForQuestions,
  setNegativeMarksTo0,
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
    try {
      //formatting createQuizDto to make it similar to create quiz entity
      const properCreateQuizDto: any = createQuizDto;
      const emailId = properCreateQuizDto.emailId;
      properCreateQuizDto.createdByEmailId = emailId;
      properCreateQuizDto.quizId = quizId;
      properCreateQuizDto.maxScore = calculateMaxScore(createQuizDto.questions);
      properCreateQuizDto.quizDescription =
        createQuizDescription(createQuizDto);
      //removing the emailId which comes from the DTO
      delete properCreateQuizDto.emailId;
      //setting negative marks to 0 for all questions if negativeMarking is false
      if (!properCreateQuizDto.negativeMarking) {
        properCreateQuizDto.questions = setNegativeMarksTo0(
          properCreateQuizDto.questions,
        );
        this.logger.info(
          '[CreatedQuizRepository]: updated questions (set negative mark to 0) of the quiz.',
          [requestId],
        );
      }
      //creating questionIds for all the questions
      properCreateQuizDto.questions = generateQuestionIdsForQuestions(
        properCreateQuizDto.questions,
        quizId,
      );
      this.logger.info(
        '[CreatedQuizRepository]: generated quizIds for all questions.',
        [requestId],
      );
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
      await this.createdQuizModel.deleteMany({ quizId: quizId }).exec();
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

  async editQuiz(
    editQuizDto: EditQuizQuestionsDto | EditQuizOptionsDto,
    requestId: string,
  ) {
    this.logger.info('[CreatedQuizRepository]: Api called to edit a quiz.', [
      requestId,
    ]);
    try {
      //checking if request made is valid by
      this.logger.info(
        '[CreatedQuizRepository]: Checking if the emailId of the user is same as the createdByEmailId of the quiz.',
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
      //creating questionIds for all the questions
      if ('questions' in filteredEditQuizDto) {
        const questions: any = filteredEditQuizDto.questions;
        filteredEditQuizDto.questions = generateQuestionIdsForQuestions(
          questions,
          filteredEditQuizDto.quizId,
        );
        this.logger.info(
          '[CreatedQuizRepository]: generated quizIds for all questions.',
          [requestId],
        );
      }
      //updating the sent fields
      const updatedQuiz = await this.createdQuizModel.findOneAndUpdate(
        { quizId: editQuizDto.quizId },
        { $set: filteredEditQuizDto },
        { strict: true, new: true },
      );
      this.logger.info(
        '[CreatedQuizRepository]: updated the quiz with sent fields.',
        [requestId],
      );
      //updating quiz description
      updatedQuiz.quizDescription = createQuizDescription(updatedQuiz);
      //updating quiz score if editQuestionsDto is sent
      if ('questions' in editQuizDto) {
        updatedQuiz.maxScore = calculateMaxScore(updatedQuiz.questions);
        this.logger.info(
          '[CreatedQuizRepository]: updated maxScore of the quiz.',
          [requestId],
        );
      }
      //setting negative marks to 0 for all questions if negativeMarking is false
      if (
        'questions' in editQuizDto &&
        'negativeMarking' in editQuizDto &&
        !editQuizDto.negativeMarking
      ) {
        updatedQuiz.questions = setNegativeMarksTo0(updatedQuiz.questions);
        this.logger.info(
          '[CreatedQuizRepository]: updated questions (set negative mark to 0) of the quiz.',
          [requestId],
        );
      }
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
