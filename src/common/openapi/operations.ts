import { ApiOperationOptions } from '@nestjs/swagger';
import { CONSTANTS } from '../config/configuration';

const signup: ApiOperationOptions = {
  tags: [ CONSTANTS.ROUTES.USER.SIGNUP.TAG ],
  description: 'This API is used to signup / register a new user to the quiz app database. It creates a new User inside User collection database.',
  summary: 'This API signsup / registers a new user.',
};

const login: ApiOperationOptions = {
  tags: [ CONSTANTS.ROUTES.USER.LOGIN.TAG ],
  description: 'This API is used to login / verify the user. It checks for email ID and password to match with the data in database.',
  summary: 'This API logins the user.',
};

export const operations = { singup: signup, login: login };
