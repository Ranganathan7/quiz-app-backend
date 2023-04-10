import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignupDto {
  @IsEmail(undefined, { message: "Please provide a valid email address." })
  @IsNotEmpty()
  emailId: string;

  @IsStrongPassword(undefined, { message: "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  userName: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  emailId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
