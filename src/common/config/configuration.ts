export default () => ({
  app: {
    host: process.env.APP_HOST || '127.0.0.1',
    port: parseInt(process.env.APP_PORT, 10) || 5000,
    protocol: process.env.APP_PROTOCOL || 'http',
    name: process.env.APP_NAME || 'quiz-app',
  },
  database: {
    mongodb: {
      uri: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_DB}`,
      userNewUrlParser: process.env.MONGO_NEW_URL_PARSER || true,
      useUnifiedTopology: process.env.MONGO_UNIFIED_TOPOLOGY || true,
      serverSelectionTimeoutMs:
        parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT, 10) || 50,
      connectionTimeoutMs:
        parseInt(process.env.MONGO_CONNECTION_TIMEOUT, 10) || 50,
    },
  },
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
    EXAMPLE: {
      CONTROLLER: '',
      TAG: '',
      EXAMPLE_SERVICE: {
        PATH: '',
        TAG: '',
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
