import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log(context.getHandler()); // 호출되는 Handler Method를 실행전에 먼저 출력

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })), //rxjs 에서 제공하는 map 함수
    );
    // Controller 실행 후, 성공 응답값을 {success: true, data: ~~} 의 형태로 만들어줌
  }
}
