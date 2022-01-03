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
    console.log('Before...');

    // const now = Date.now();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
