import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class GetAllCreatedQuizDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;
}


export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'This is a question?' })
  question: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ default: ['option1', 'option2', 'option3', 'option4'] })
  options: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ default: ['option3'] })
  answer: string[];

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

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'sample quiz 1' })
  quizName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1' })
  createdByUserName: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  active: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  protected: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  showAnswer?: boolean;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  timeLimitSec: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  maxAttempts: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  negativeMarking: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  shuffleOptions?: boolean;

  @IsArray({ message: 'questions must be an array' })
  @Type(() => QuestionDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [QuestionDto] })
  questions: QuestionDto[];
}

export class EditQuizOptionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1-QfXq8Uj' })
  quizId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'edited sample quiz 1' })
  quizName?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: true })
  active?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: true })
  protected?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  showAnswer?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ default: 1000 })
  timeLimitSec?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: true })
  shuffleOptions?: boolean;
}

export class EditQuizQuestionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1-QfXq8Uj' })
  quizId: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty({ default: 2 })
  maxAttempts?: number;
  
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  negativeMarking?: boolean;

  @IsArray({ message: 'questions must be an array' })
  @Type(() => QuestionDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [QuestionDto] })
  @IsOptional()
  questions?: QuestionDto[];
}
