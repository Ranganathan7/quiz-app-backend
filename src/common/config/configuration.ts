export default () => ({
  app: {
    host: process.env.APP_HOST || '127.0.0.1',
    port: parseInt(process.env.APP_PORT, 10) || 5000,
    protocol: process.env.APP_PROTOCOL || 'http',
    name: process.env.APP_NAME || 'quiz-app',
  },
  database: {
    mongodb: {
      uri: `mongodb+srv://${process.env.MONGO_CLUSTER_USERNAME}:${process.env.MONGO_CLUSTER_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      // uri: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_DB}`,
      // useNewUrlParser: process.env.MONGO_NEW_URL_PARSER || true,
      // useUnifiedTopology: process.env.MONGO_UNIFIED_TOPOLOGY || true,
      // serverSelectionTimeoutMS:
      //   parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT, 10) || 50,
      // connectTimeoutMS:
      //   parseInt(process.env.MONGO_CONNECT_TIMEOUT, 10) || 50,
    },
  },
  log: {
    app: {
      level: process.env.LOG_LEVEL || 'info',
      directoryMount: process.env.LOG_DIRECTORY_MOUNT || 'logs',
      subDirectory: process.env.LOG_SUB_DIRECTORY || '',
      filePrefix: process.env.LOG_FILE_PREFIX || 'combined',
      errorFilePrefix: process.env.LOG_ERROR_FILE_PREFIX || 'error',
      datePattern: process.env.LOG_DATE_PATTERN || 'MM-DD-YYYY',
      maxSize: process.env.LOG_MAX_SIZE || '100m',
      maxFile: process.env.LOG_MAX_FILE || '30d',
      zippedArchive: process.env.LOG_ZIPPED_ARCHIVE === 'true' || true,
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'quiz-app-api_jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  cookie: {
    field: process.env.COOKIE_FIELD || 'quiz-app',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 86400000,
  }
});

export const config = {
  error: {
    enableStack: process.env.ENABLE_ERROR_STACK === 'true' || true,
    enableStackLog: process.env.ENABLE_ERROR_STACK_LOG === 'true' || true,
  },
};

export const CONSTANTS = {
  MESSAGE: 'message',
  REQUEST_ID: 'requestId',
  CONFIG: {
    APP: 'app',
    HOST: 'app.host',
    PORT: 'app.port',
    DATABASE: 'database',
    LOG: 'log',
  },
  ROUTES: {
    BASE: '',
    API: 'api',
    GET: 'GET',
    USER: {
      CONTROLLER: 'user',
      TAG: 'user',
      LOGIN: {
        PATH: 'login',
        TAG: 'login',
      },
      SIGNUP: {
        PATH: 'signup',
        TAG: 'signup',
      },
      EDIT_PROFILE: {
        PATH: 'edit-profile',
        TAG: 'edit-profile edit-userName',
      },
      LOGOUT: {
        PATH: 'logout',
        TAG: 'logout'
      },
      ALREADY_LOGGEDIN: {
        PATH: 'already-loggedin',
        TAG: 'already-loggedin'
      }
    },
    CREATED_QUIZ: {
      CONTROLLER: 'created-quiz',
      TAG: 'created-quiz',
      GET_ALL_QUIZ: {
        PATH: 'get-all',
        TAG: 'get-all-created-quizzes',
      },
      CREATE_QUIZ: {
        PATH: 'create',
        TAG: 'create-quiz'
      },
      ATTEND_QUIZ: {
        PATH: 'attend-quiz',
        TAG: 'attend-quiz ?quizId'
      },
      DELETE_QUIZ: {
        PATH: 'delete-quiz',
        TAG: 'delete-quiz ? quizId'
      }
    },
    ATTENDED_QUIZ: {
      CONTROLLER: 'attended-quiz',
      TAG: 'attended-quiz',
      EXAMPLE: {
        PATH: 'example',
        TAG: 'example',
      },
    },
  },
  LOG: {
    LABEL: 'quiz-app-api',
    ERROR_LOG_FIELD: 'log',
  },
  SWAGGER: {
    DOCS: 'docs',
    TITLE: 'API Docs',
    HEADER: 'Quiz App Api',
    DESCRIPTION: 'Quiz App Api - Used by Quiz App Frontend Application',
    TAG: 'swagger-docs',
  },
};
