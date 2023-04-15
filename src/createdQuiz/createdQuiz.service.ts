import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LOGGER } from '../common/core.module';
import {
  ApiSuccessResponse,
  CommonApiResponse,
} from 'src/common/models/api.models';
import { CreatedQuizRepository } from './repository/createdQuiz.repository';
import {
  CreateQuizDto,
  EditQuizQuestionsDto,
  EditQuizOptionsDto,
} from './dto/createdQuiz.dto';
import { UserRepository } from 'src/user/repository/user.repository';
import {
  generateRandomQuizId,
  shuffleQuestionsAndOptions,
} from '../common/utils/createdQuiz.helper';
import { AttendedQuizRepository } from 'src/attendedQuiz/repository/attendedQuiz.repository';

@Injectable()
export class CreatedQuizService {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly createdQuizRepository: CreatedQuizRepository,
    private readonly attendedQuizRepository: AttendedQuizRepository,
  ) {}

  async getAll(emailId: string, requestId: string): Promise<CommonApiResponse> {
    this.logger.info(
      '[CreatedQuizService]: Api called to get all created quizzes of an user.',
      [requestId],
    );
    try {
      const createdQuizzes = await this.createdQuizRepository.getAll(
        emailId,
        requestId,
      );
      this.logger.info(
        '[CreatedQuizService]: Fetched all created Quizzes successfully.',
        [requestId],
      );
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

  async create(
    createQuizDto: CreateQuizDto,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info('[CreatedQuizService]: Api called to create a quiz.', [
      requestId,
    ]);
    try {
      //validating user request (comparing provided username and actual username from emailId)
      const user = await this.userRepository.findUserWithEmailId(
        createQuizDto.emailId,
        requestId,
      );
      if (!user || user.userName !== createQuizDto.createdByUserName) {
        const errorMessage =
          'The createdByUserName provided in request body does not match with the user of provided email ID.';
        this.logger.error(`[CreatedQuizService]: ${errorMessage}`, [requestId]);
        throw new HttpException(
          { message: errorMessage, requestId: requestId },
          HttpStatus.CONFLICT,
        );
      }
      // generating unique quiz ID
      let quizId: string;
      while (true) {
        quizId = generateRandomQuizId(7, createQuizDto.createdByUserName);
        const quiz = await this.createdQuizRepository.findQuizWithQuizId(
          quizId,
          requestId,
        );
        if (!quiz) break;
      }
      const createdQuiz = await this.createdQuizRepository.create(
        createQuizDto,
        quizId,
        requestId,
      );
      this.logger.info('[CreatedQuizService]: Created the quiz successfully.', [
        requestId,
      ]);
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Quiz created successfully!',
        data: createdQuiz,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[CreatedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  async attendQuiz(
    quizId: string,
    emailId: string,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info(
      '[CreatedQuizService]: Api called to fetch quiz for attending it with quiz ID.',
      [requestId],
    );
    try {
      const quiz =
        await this.createdQuizRepository.findQuizWithQuizIdForAttendingIt(
          quizId,
          requestId,
        );
      if (!quiz) {
        throw new HttpException(
          {
            message: 'No quiz found with given quiz ID.',
            requestId: requestId,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.info('[CreatedQuizService]: Fetched quiz successfully.', [
        requestId,
      ]);
      //checking if quiz is active
      if (!quiz.active) {
        throw new HttpException(
          {
            message: 'The quiz you are trying to attend is not active now.',
            requestId: requestId,
          },
          HttpStatus.FORBIDDEN,
        );
      }
      //checking if max attempts exhausted
      const attendedQuiz =
        await this.attendedQuizRepository.getOneWithQuizIdAndEmailId(
          quizId,
          emailId,
          requestId,
        );
      if (attendedQuiz) {
        if (attendedQuiz.attemptsLeft === 0) {
          throw new HttpException(
            {
              message: 'Max number of attemps allowed for the quiz is reached.',
              requestId: requestId,
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
      //shuffling questions and options if those are true
      quiz.questions = shuffleQuestionsAndOptions(
        quiz.questions,
        quiz.shuffleQuestions,
        quiz.shuffleOptions,
      );
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Quiz details fetched successfully!',
        data: quiz,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[CreatedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  async deleteQuiz(
    quizId: string,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info(
      '[CreatedQuizService]: Api called to delete the quiz with quiz ID.',
      [requestId],
    );
    try {
      await this.createdQuizRepository.deleteQuiz(quizId, requestId);
      this.logger.info('[CreatedQuizService]: Deleted quiz successfully.', [
        requestId,
      ]);
      //deleting all its respective attended quiz records
      await this.attendedQuizRepository.deleteAllWithQuizId(quizId, requestId);
      this.logger.info(
        '[CreatedQuizService]: Deleted its corresponding attended quiz records successfully.',
        [requestId],
      );
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Deleted quiz successfully!',
        data: {
          message:
            'Deleted quiz and all its corresponding attendees records as well.',
        },
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[CreatedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  async editQuiz(
    editQuizDto: EditQuizQuestionsDto | EditQuizOptionsDto,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info('[CreatedQuizService]: Api called to edit a quiz.', [
      requestId,
    ]);
    // checking for empty object request
    if (Object.entries(editQuizDto).length === 2) {
      this.logger.error(
        `[CreatedQuizService]: No fields to update are sent in the request body.`,
        [requestId],
      );
      throw new HttpException(
        {
          message: 'Add the fields to update in the request body.',
          requestId: requestId,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const editedQuiz = await this.createdQuizRepository.editQuiz(
        editQuizDto,
        requestId,
      );
      this.logger.info('[CreatedQuizService]: Edited quiz successfully.', [
        requestId,
      ]);
      //deleting all its respective attended quiz records if the quiz questions are edited
      if (
        'questions' in editQuizDto ||
        'negativeMarking' in editQuizDto ||
        'maxAttempts' in editQuizDto
      ) {
        await this.attendedQuizRepository.deleteAllWithQuizId(
          editQuizDto.quizId,
          requestId,
        );
        this.logger.info(
          '[CreatedQuizService]: Deleted its corresponding attended quiz records successfully.',
          [requestId],
        );
      } else {
        //editing all its respective atteneded quiz records if the quiz options are edited
        await this.attendedQuizRepository.editAllWithQuizId(editQuizDto.quizId, editedQuiz, requestId);
        this.logger.info(
          '[CreatedQuizService]: Edited its corresponding attended quiz records successfully.',
          [requestId],
        );
      }
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Edited quiz successfully!',
        data: editedQuiz,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[CreatedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }
}
