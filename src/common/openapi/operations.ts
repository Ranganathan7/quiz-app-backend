import { ApiOperationOptions } from '@nestjs/swagger';
import { CONSTANTS } from '../config/configuration';

const signup: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.USER.SIGNUP.TAG],
  description:
    'This API is used to signup / register a new user to the quiz app database. It creates a new User inside User collection database.',
  summary: 'This API signsup / registers a new user.',
};

const login: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.USER.LOGIN.TAG],
  description:
    'This API is used to login / verify the user. It checks for email ID and password to match with the data in database.',
  summary: 'This API logins the user.',
};

const editProfile: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.USER.EDIT_PROFILE.TAG],
  description: 'This API is used to edit the userName of an user. The emailId in the request body comes from the cookie.',
  summary: 'This API edits the profile of an user.',
};

const logout: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.USER.LOGOUT.TAG],
  description: 'This API is used to logout the user.',
  summary: 'This API logouts the user.',
};

const alreadyLoggedin: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.USER.ALREADY_LOGGEDIN.TAG],
  description: 'This API is used check if an user is already logged in. The emailId in the request body comes from the cookie.',
  summary: 'This API checks if an user is already logged in or not.',
};

const getAllCreatedQuizzes: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.CREATED_QUIZ.GET_ALL_QUIZ.TAG],
  description: 'This API is used get all the created quizzes of an user. The emailId in the request body comes from the cookie.',
  summary: 'This API returns all the created quizzes of the user.',
};

const createQuiz: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.CREATED_QUIZ.CREATE_QUIZ.TAG],
  description: 'This API is used to create a new quiz. The emailId in the request body comes from the cookie.',
  summary: 'This API creates a new quiz.',
};

export const operations = {
  singup: signup,
  login: login,
  editProfile: editProfile,
  logout: logout,
  alreadyLoggedin: alreadyLoggedin,
  getAllCreatedQuizzes: getAllCreatedQuizzes,
  createQuiz: createQuiz,
};
