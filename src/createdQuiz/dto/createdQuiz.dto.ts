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

export class GetAllCreatedQuizDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;
}

export class QuestionTypeDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({ default: 1 })
  mark: number

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  negativeMark: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  multipleAnswer: boolean
}

export class QuestionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'This is a question?' })
  question: string

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ default: ['option1', 'option2', 'option3', 'option4'] })
  options: string[]

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ default: ['option3'] })
  answer: string[]

  @IsObject()
  @IsDefined()
  @Type(() => QuestionTypeDto)
  @ValidateNested()
  @ApiProperty({ type: QuestionTypeDto })
  questionType: QuestionTypeDto
};

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'sample quiz 1' })
  quizName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'example1' })
  createdByUserName: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  active: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  protected: boolean

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  showAnswer?: boolean

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  timeLimitSec: number

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  maxAttempts: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  negativeMarking: boolean

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  shuffleQuestions?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  shuffleOptions?: boolean

  @IsArray({ message: 'questions must be an array' })
  @Type(() => QuestionsDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [QuestionsDto] })
  questions: QuestionsDto[]
}
