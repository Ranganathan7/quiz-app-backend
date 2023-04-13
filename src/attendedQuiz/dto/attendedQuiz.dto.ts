import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class GetAllAttendedQuizDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;
}