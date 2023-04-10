import { ApiResponseOptions } from '@nestjs/swagger';

const apiOkResponse = (sampleResponse: any): ApiResponseOptions => ({
  description: 'Successfull Operation.',
  schema: {
    example: {
      statusCode: 200,
      message: 'Response fetched successfully',
      timestamp: '2022-04-01T00:00:01Z',
      requestId: '36b8f84d-df4e-4d49-b662-bcde71a8764f',
      data: sampleResponse,
    },
  },
});

const apiBadRequestResponse: ApiResponseOptions = {
  description: 'Invalid/Incorrect details supplied.',
  schema: {
    example: {
      statusCode: 400,
      message: 'BadRequestException',
      timestamp: '2023-02-15T17:01:19.502Z',
      requestId: '36b8f84d-df4e-4d49-b662-bcde71a8764f',
      error: {
        description: 'firstName must contain only letters (a-zA-Z)',
        stack: {},
      },
    },
  },
};

const apiUnauthorizedResponse: ApiResponseOptions = {
  description: 'No Valid Service-Key provided.',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      timestamp: '2022-04-01T00:00:01Z',
      requestId: '36b8f84d-df4e-4d49-b662-bcde71a8764f',
      error: {
        description: 'No valid Service key provided',
        stack: {},
      },
    },
  },
};

const apiForbiddenResponse: ApiResponseOptions = {
  description:
    'The Service-Key does not have permissions to perform the operation.',
  schema: {
    example: {
      statusCode: 403,
      message: 'Forbidden',
      timestamp: '2022-04-01T00:00:01Z',
      requestId: '36b8f84d-df4e-4d49-b662-bcde71a8764f',
      error: {
        description:
          "The Service key doesn't have permissions to perform the request",
        stack: {},
      },
    },
  },
};

const apiNotFoundResponse: ApiResponseOptions = {
  description: 'Could not be found.',
  schema: {
    example: {
      statusCode: 404,
      timestamp: '2023-02-15T17:00:14.930Z',
      message: 'Not Found',
      requestId: '36b8f84d-df4e-4d49-b662-bcde71a8764f',
      error: {
        description: "The requested resource doesn't exist",
        stack: {},
      },
    },
  },
};

const apiInternalServerErrorResponse: ApiResponseOptions = {
  description: 'Something went wrong, Internal Server Error.',
  schema: {
    example: {
      statusCode: 500,
      message: 'Server Error',
      timestamp: '2022-04-01T00:00:01Z',
      requestId: '36b8f84d-df4e-4d49-b662-bcde71a8764f',
      error: {
        description: 'Something went wrong',
        stack: {},
      },
    },
  },
};

export const responses = {
  apiOkResponse: apiOkResponse,
  apiBadRequestResponse: apiBadRequestResponse,
  apiUnauthorizedResponse: apiUnauthorizedResponse,
  apiForbiddenResponse: apiForbiddenResponse,
  apiNotFoundResponse: apiNotFoundResponse,
  apiInternalServerErrorResponse: apiInternalServerErrorResponse,
};