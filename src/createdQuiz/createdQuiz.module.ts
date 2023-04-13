import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CreatedQuiz, CreatedQuizSchema } from "./entity/createdQuiz.entity";
import { CreatedQuizController } from "./createdQuiz.controller";
import { CreatedQuizService } from "./createdQuiz.service";
import { CreatedQuizRepository } from "./repository/createdQuiz.repository";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User, UserSchema } from "../user/entity/user.entity";
import { UserRepository } from "../user/repository/user.repository";
import { AttendedQuizRepository } from "../attendedQuiz/repository/attendedQuiz.repository";
import { AttendedQuiz, AttendedQuizSchema } from "../attendedQuiz/entity/attendedQuiz.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreatedQuiz.name, schema: CreatedQuizSchema, },
      { name: User.name, schema: UserSchema },
      { name: AttendedQuiz.name, schema: AttendedQuizSchema, }
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ CreatedQuizController ],
  providers: [ CreatedQuizService, CreatedQuizRepository, UserRepository, AttendedQuizRepository ]
})
export class CreatedQuizModule {}