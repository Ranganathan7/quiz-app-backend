import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User, UserSchema } from "../user/entity/user.entity";
import { UserRepository } from "../user/repository/user.repository";
import { CreatedQuiz, CreatedQuizSchema } from "../createdQuiz/entity/createdQuiz.entity";
import { AttendedQuiz, AttendedQuizSchema } from "./entity/attendedQuiz.entity";

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
  controllers: [ ],
  providers: [ UserRepository ]
})
export class AttendedQuizModule {}