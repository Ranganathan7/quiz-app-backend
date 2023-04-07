import { ApiOperationOptions } from '@nestjs/swagger';
import { CONSTANTS } from '../config/configuration';

const operation1: ApiOperationOptions = {
  tags: [],
  description: '',
  summary: '',
};

export const operations = { operation1: operation1 };
