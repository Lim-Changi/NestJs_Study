import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

// Router URI 공통 설정시 @Controller("common") 안에 공통 주소값을 넣어주면 된다.
@Controller('common')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Decorator 패턴 -> 재사용성을 늘림 -> 붙여서 써야함
  // URI Naming 시, @Get("router") 안에 주소값을 넣어주면 된다. => 위의 예시와 연결할 경우, getHello -> localhost:8000/common/router 에서 실행이 된다.
  @Get('router')
  getHello(): string {
    return this.appService.getHello();
  }
}
