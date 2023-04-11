import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { LOGGER } from '../core.module';
import { Logger } from 'winston';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(LOGGER) private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtConstants = await this.configService.get('jwt');
    const token = await this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.error(`[AuthGuard]: No access token in header.`);
      throw new HttpException(
        {
          message: 'Unauthorized request made to API without a valid access token.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request body object here
      // so that we can access it in our route handlers
      request.body['emailId'] = payload.emailId;
    } catch(error) {
      this.logger.error(`[AuthGuard]: ${error.message}`);
      throw new HttpException(
        {
          message: 'Unauthorized request made to API without a valid access token.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  private async extractTokenFromHeader(request: Request): Promise<string | undefined> {
    const cookie = await this.configService.get('cookie');
    const token = request.cookies[cookie.field];
    return token;
  }
}
