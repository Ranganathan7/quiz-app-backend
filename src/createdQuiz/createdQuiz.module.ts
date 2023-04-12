import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CreatedQuiz, CreatedQuizSchema } from "./entity/createdQuiz.entity";
import { CreatedQuizController } from "./createdQuiz.controller";
import { CreatedQuizService } from "./createdQuiz.service";
import { CreatedQuizRepository } from "./repository/createdQuiz.repository";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreatedQuiz.name, schema: CreatedQuizSchema }
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ CreatedQuizController ],
  providers: [ CreatedQuizService, CreatedQuizRepository ]
})
export class CreatedQuizModule {}