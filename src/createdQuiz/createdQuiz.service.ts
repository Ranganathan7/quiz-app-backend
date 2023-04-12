import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LOGGER } from '../common/core.module';
import {
  ApiSuccessResponse,
  CommonApiResponse,
} from 'src/common/models/api.models';
import { CreatedQuizRepository } from './repository/createdQuiz.repository';
import { CreateQuizDto } from './dto/createdQuiz.dto';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class CreatedQuizService {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly createdQuizRepository: CreatedQuizRepository,
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
    try {
      // generating unique quiz ID
      let quizId: string;
      while (true) {
        quizId = this.generateRandomQuizId(
          7,
          createQuizDto.createdByUserName,
          requestId,
        );
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

  async getQuizWithQuizId(
    quizId: string,
    requestId: string,
  ): Promise<CommonApiResponse> {
    this.logger.info(
      '[CreatedQuizService]: Api called to fetch quiz with quiz ID.',
      [requestId],
    );
    try {
      const quiz = await this.createdQuizRepository.findQuizWithQuizId(
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
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        message: 'Quiz created successfully!',
        data: quiz,
      };
      return apiResult;
    } catch (error) {
      this.logger.error(`[CreatedQuizService]: ${error.message}`, [requestId]);
      throw error;
    }
  }

  private generateRandomQuizId(
    length: number,
    userName: string,
    requestId: string,
  ): string {
    this.logger.info(
      '[CreatedQuizService]: Api called to generate a quiz ID.',
      [requestId],
    );
    //the generated ID has only uppercase, lowercase and numbers
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id: string = userName + '-';
    const maxLength: number = chars.length;
    let randomIndex: number;
    for (let i = 0; i < length; i++) {
      randomIndex = Math.floor(Math.random() * maxLength);
      id += chars[randomIndex];
    }
    return id;
  }
}
