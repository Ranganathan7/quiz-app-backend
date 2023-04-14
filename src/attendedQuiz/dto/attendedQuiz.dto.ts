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


export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'This is a question?' })
  question: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1-QfXq8Uj-i8712yF' })
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ default: ['option1', 'option2', 'option3', 'option4'] })
  options: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ default: ['option3'] })
  chosenAnswer: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({ default: 1 })
  mark: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  negativeMark: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  multipleAnswer: boolean;
}

export class AnswersDto {
  @IsObject()
  @IsDefined()
  @ValidateNested({ each: true })
  @ApiProperty()
  answers: AnswerDto[]
}

export class SubmitQuizDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1-QfXq8Uj' })
  quizId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1' })
  attemptedByUserName: string;

  @IsArray({ message: 'answers must be an array' })
  @Type(() => AnswerDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [AnswerDto] })
  answers: AnswerDto[];
}
