import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  // 다른 서비스들을 providers 에 넣는 것은 좋은 방식이 아니다.
  // 기능 별 각 module 에서 exports: [] 에 provider를 (ex: CatsService) 넣어주는 방식으로 한다.
  providers: [AppService],
})

// Middleware 는 configure 을 통해 추가하도록 한다
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // * 을 넣으면 전체 Router에 적용 가능하다
  }
}
