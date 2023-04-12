import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class GetAllDto {
  @IsEmail()
  @IsNotEmpty()
  emailId: string;
}
