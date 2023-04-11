import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from 'winston';
import { config, CONSTANTS } from '../config/configuration';
import { LOGGER } from '../core.module';
import { ApiErrorResponse, CommonApiResponse } from '../models/api.models';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      error instanceof HttpException ? error.getResponse() : '';

    const errorResponse: CommonApiResponse<ApiErrorResponse> = {
      statusCode: status,
      message: error.name
        ? error.name === 'HttpException'
          ? exceptionResponse[CONSTANTS.MESSAGE]
          : error.name
        : '',
      timestamp: new Date().toISOString(),
      requestId: exceptionResponse[CONSTANTS.REQUEST_ID]
        ? exceptionResponse[CONSTANTS.REQUEST_ID]
        : '',
      error: {
        // errorCode: status,
        description: exceptionResponse[`error`]?.description
          ? exceptionResponse[`error`]?.description
          : error.message
          ? exceptionResponse[CONSTANTS.MESSAGE] instanceof Array
            ? exceptionResponse[CONSTANTS.MESSAGE].join(' | ')
            : error.message
          : '',
        ...(config.error.enableStack && {
          stack: error.stack ? error.stack : '',
        }),
      },
    };

    this.logger.error(
      `[CommonExceptionFilter]: ${
        exceptionResponse['error']?.description
          ? exceptionResponse['error']?.description
          : error.message
          ? exceptionResponse[CONSTANTS.MESSAGE] instanceof Array
            ? exceptionResponse[CONSTANTS.MESSAGE].join(' | ')
            : error.message
          : ''
      }`,
      [
        exceptionResponse[CONSTANTS.REQUEST_ID]
          ? exceptionResponse[CONSTANTS.REQUEST_ID]
          : '',
      ],
    );
    if (config.error.enableStackLog) this.logger.error(`Stack: ${error.stack}`);

    response.status(status);
    response.send(errorResponse);
  }
}
