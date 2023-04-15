import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { MaxLengthArrayConstraint } from '../../common/constraint/maxLengthArray.constraint';

export class GetAllAttendedQuizDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;
}

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @ApiProperty({ default: 'example1-QfXq8Uj-i8712yF' })
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(10)
  @Validate(MaxLengthArrayConstraint, [200])
  @ApiProperty({ default: ['option3'] })
  chosenAnswer: string[];
}

export class SubmitQuizDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({ default: 'example1-QfXq8Uj' })
  quizId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ default: 'example1' })
  attendedByUserName: string;

  @IsArray({ message: 'answers must be an array' })
  @ArrayMinSize(0)
  @ArrayMaxSize(100)
  @Type(() => AnswerDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [AnswerDto] })
  answers: AnswerDto[];
}
