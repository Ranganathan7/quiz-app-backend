import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { MaxLengthArrayConstraint } from '../../common/constraint/maxLengthArray.constraint';

export class GetAllCreatedQuizDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ default: 'This is a question?' })
  question: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty()
  @Validate(MaxLengthArrayConstraint, [200])
  @ApiProperty({ default: ['option1', 'option2', 'option3', 'option4'] })
  options: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty()
  @Validate(MaxLengthArrayConstraint, [200])
  @ApiProperty({ default: ['option3'] })
  answer: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  @ApiProperty({ default: 1 })
  mark: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(10)
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
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ default: 'sample quiz 1' })
  quizName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
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
  @Max(18000)
  @IsNotEmpty()
  @ApiProperty()
  timeLimitSec: number;

  @IsNumber()
  @Min(1)
  @Max(5)
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
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => QuestionDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [QuestionDto] })
  questions: QuestionDto[];
}

export class EditQuizOptionsDto {
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
  @IsOptional()
  @MaxLength(100)
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
  @Max(18000)
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
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({ default: 'example1-QfXq8Uj' })
  quizId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiProperty({ default: 2 })
  maxAttempts?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  negativeMarking?: boolean;

  @IsArray({ message: 'questions must be an array' })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => QuestionDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [QuestionDto] })
  @IsOptional()
  questions?: QuestionDto[];
}
