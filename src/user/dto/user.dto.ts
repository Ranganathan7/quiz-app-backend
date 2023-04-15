import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail(undefined, { message: 'Please provide a valid email address.' })
  @IsNotEmpty()
  @ApiProperty({ default: 'example1@gmail.com' })
  @MaxLength(50)
  emailId: string;

  @IsStrongPassword(undefined, {
    message:
      'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ default: 'aA1!1111' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ default: 'example1' })
  userName: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ default: 'aA1!1111' })
  password: string;
}

export class EditProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ default: 'edited example1' })
  userName: string;
}

export class AlreadyLoggedinDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ default: 'example1@gmail.com' })
  emailId: string;
}
