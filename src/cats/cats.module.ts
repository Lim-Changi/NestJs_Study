import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  // 상위 모듈에서 provider에 등록하는 방식이 아닌, 하위 모듈에서 Service를 exports 하는 방식으로 상위 모듈에선 [모듈]만 import 하도록 한다.
  exports: [CatsService],
})
export class CatsModule {}
