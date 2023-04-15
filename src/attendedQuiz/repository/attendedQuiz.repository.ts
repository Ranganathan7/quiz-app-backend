import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LOGGER } from '../../common/core.module';
import { Logger } from 'winston';
import { AttendedQuiz } from '../entity/attendedQuiz.entity';
import { SubmitQuizDto } from '../dto/attendedQuiz.dto';
import { CreatedQuiz } from '../../createdQuiz/entity/createdQuiz.entity';
import { calculateScore } from '../../common/utils/attendedQuiz.helper';
import { EditQuizOptionsDto } from 'src/createdQuiz/dto/createdQuiz.dto';

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

  async submitQuiz(
    submitQuizDto: SubmitQuizDto,
    existingQuiz: CreatedQuiz,
    requestId: string,
  ) {
    this.logger.info('[AttendedQuizRepository]: Api called to submit a quiz.', [
      requestId,
    ]);
    try {
      //removing the emailId
      const { emailId, ...filteredSubmitQuizDto } = submitQuizDto;
      const submitQuiz: any = {
        ...filteredSubmitQuizDto,
        attendedByEmailId: emailId,
      };
      //calculating attempts left
      submitQuiz.attemptsLeft = existingQuiz.maxAttempts - 1;
      if (submitQuiz.attemptsLeft < 0) {
        throw new HttpException(
          {
            message: 'Max number of attemps allowed for the quiz is reached.',
            requestId: requestId,
          },
          HttpStatus.FORBIDDEN,
        );
      }
      //checking if all answers are sent for all the questions in quiz
      if (existingQuiz.questions.length !== submitQuiz.answers.length) {
        throw new HttpException(
          {
            message:
              'The answers array should contain all the questions including attended/not-attended [OR] the quiz you are trying to submit has been edited.',
            requestId: requestId,
          },
          HttpStatus.CONFLICT,
        );
      }
      //calculating the score
      submitQuiz.attempts = [
        calculateScore(existingQuiz.questions, submitQuiz.answers, requestId),
      ];
      //adding the missing fields
      submitQuiz.quizName = existingQuiz.quizName;
      submitQuiz.quizDescription = existingQuiz.quizDescription;
      submitQuiz.createdByEmailId = existingQuiz.createdByEmailId;
      submitQuiz.createdByUserName = existingQuiz.createdByUserName;
      submitQuiz.showAnswer = existingQuiz.showAnswer;
      submitQuiz.timeLimitSec = existingQuiz.timeLimitSec;
      submitQuiz.maxScore = existingQuiz.maxScore;
      //removing the answers array as it is added into attemps array
      delete submitQuiz.answers;
      const propersubmitQuiz: AttendedQuiz = { ...submitQuiz };
      const submitQuizModel = new this.attendedQuizModel(propersubmitQuiz);
      return await submitQuizModel.save();
    } catch (error) {
      this.logger.error(`[AttendedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async reSubmitQuiz(
    submitQuizDto: SubmitQuizDto,
    existingQuiz: CreatedQuiz,
    attemptsLeft: number,
    requestId: string,
  ) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to re-submit a quiz.',
      [requestId],
    );
    try {
      //calculating attempts left
      const updatedAttemptsLeft: number = attemptsLeft - 1;
      if (updatedAttemptsLeft < 0) {
        throw new HttpException(
          {
            message: 'Max number of attemps allowed for the quiz is reached.',
            requestId: requestId,
          },
          HttpStatus.FORBIDDEN,
        );
      }
      //checking if all answers are sent for all the questions in quiz
      if (existingQuiz.questions.length !== submitQuizDto.answers.length) {
        throw new HttpException(
          {
            message:
              'The answers array should contain all the questions including attended/not-attended [OR] the quiz you are trying to submit has been edited.',
            requestId: requestId,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      //calculating the score
      const answers = calculateScore(
        existingQuiz.questions,
        submitQuizDto.answers,
        requestId,
      );
      //updating existing field
      const filter = {
        quizId: submitQuizDto.quizId,
        attendedByEmailId: submitQuizDto.emailId,
      };
      const update = {
        $push: { attempts: answers },
        $set: { attemptsLeft: updatedAttemptsLeft },
      };
      const options = { new: true };
      return await this.attendedQuizModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
    } catch (error) {
      this.logger.error(`[AttendedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { message: error.message, requestId: requestId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editAllWithQuizId(
    quizId: string,
    editedQuiz: CreatedQuiz,
    requestId: string,
  ) {
    this.logger.info(
      '[AttendedQuizRepository]: Api called to edit all attended quizzes with quiz ID.',
      [requestId],
    );
    try {
      // criteria for selecting documents to update
      const filter = { quizId: quizId };
      // fields to update
      const update = {
        $set: {
          quizName: editedQuiz.quizName,
          quizDescription: editedQuiz.quizDescription,
          showAnswer: editedQuiz.showAnswer,
          timeLimitSec: editedQuiz.timeLimitSec,
        },
      };
      await this.attendedQuizModel.updateMany(filter, update);
    } catch (error) {
      this.logger.error(`[AttendedQuizRepository]: ${error.message}`, [
        requestId,
      ]);
      if (error instanceof HttpException) throw error;
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
