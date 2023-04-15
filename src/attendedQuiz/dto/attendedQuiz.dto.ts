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
  @MaxLength(200)
  @ApiProperty({ default: 'This is a question?' })
  question: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @ApiProperty({ default: 'example1-QfXq8Uj-i8712yF' })
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @Validate(MaxLengthArrayConstraint, [200])
  @ApiProperty({ default: ['option1', 'option2', 'option3', 'option4'] })
  options: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(10)
  @Validate(MaxLengthArrayConstraint, [200])
  @ApiProperty({ default: ['option3'] })
  chosenAnswer: string[];

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
  attemptedByUserName: string;

  @IsArray({ message: 'answers must be an array' })
  @ArrayMinSize(0)
  @ArrayMaxSize(100)
  @Type(() => AnswerDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [AnswerDto] })
  answers: AnswerDto[];
}
