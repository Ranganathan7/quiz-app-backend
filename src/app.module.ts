import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration, { CONSTANTS } from './common/config/configuration';
import { CoreModule } from './common/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './common/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CoreModule.forRoot({ loggerLabel: CONSTANTS.LOG.LABEL}),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const mongoConnectionObject = configService.get('database.mongodb');
        // console.log(`MongoDB connection settings [URI: ${mongoConnectionObject.uri}]`)
        return mongoConnectionObject;
      },
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
