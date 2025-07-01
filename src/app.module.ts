import { monitor } from '@colyseus/monitor';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import * as morgan from 'morgan';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { CacheModule } from '@libs/cache/cache.module';
import { cacheConfig } from './config/cache.config';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { StoreItemModule } from './module/store-item/store-item.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    CacheModule.forRootAsync({
      useFactory: async () => ({
        ...cacheConfig,
      }),
    }),
    GameModule,
    AuthModule,
    UserModule,
    StoreItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('combined')).forRoutes('*');
    consumer.apply(monitor()).forRoutes('/monitor');
  }
}
