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

const attendQuiz: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.CREATED_QUIZ.ATTEND_QUIZ.TAG],
  description: 'This API is used fetch the quiz details with quiz ID for attending it. The emailId in the request body comes from the cookie. The fields to be edited comes along with the request body.',
  summary: 'This API returns the quiz details of provided quizId for attending it.',
};

const deleteQuiz: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.CREATED_QUIZ.DELETE_QUIZ.TAG],
  description: 'This API is used delete a quiz with its quiz ID.',
  summary: 'This API deletes a quiz.',
};

const editQuizOptions: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.CREATED_QUIZ.EDIT_QUIZ_OPTIONS.TAG],
  description: 'This API is used to edit the quiz options. The emailId in the request body comes from the cookie. The fields to be edited comes along with the request body.',
  summary: 'This API edits the quiz options.',
};

const editQuizQuestions: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.CREATED_QUIZ.EDIT_QUIZ_OPTIONS.TAG],
  description: 'This API is used to edit the quiz questions. The emailId in the request body comes from the cookie. The fields to be edited comes along with the request body. Editing a quiz with this option deletes its respective attended quiz details as well.',
  summary: 'This API edits the quiz questions.',
};

const getAllattendedQuizzes: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.ATTENDED_QUIZ.GET_ALL_QUIZ.TAG],
  description: 'This API is used get all the attended quizzes of an user. The emailId in the request body comes from the cookie.',
  summary: 'This API returns all the attended quizzes of the user.',
};

const submitQuiz: ApiOperationOptions = {
  tags: [CONSTANTS.ROUTES.ATTENDED_QUIZ.SUBMIT_QUIZ.TAG],
  description: 'This API is used to submit an attended quiz. The emailId in the request body comes from the cookie.',
  summary: 'This API submits an attended quiz.',
};

export const operations = {
  singup: signup,
  login: login,
  editProfile: editProfile,
  logout: logout,
  alreadyLoggedin: alreadyLoggedin,
  getAllCreatedQuizzes: getAllCreatedQuizzes,
  createQuiz: createQuiz,
  attendQuiz: attendQuiz,
  deleteQuiz: deleteQuiz,
  editQuizOptions: editQuizOptions,
  editQuizQuestions: editQuizQuestions,
  getAllAttendedQuizzes: getAllattendedQuizzes,
  submitQuiz: submitQuiz,
};
