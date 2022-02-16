## 미들웨어

라우트 핸들러 이전에 호출 = Express 미들웨어

@Injectable
DI 를 통해 미들웨어 적용이 가능함

```js
// nestcli
nest g middleware ~~
```

```js
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => { // Response 가 완료가 되었을때, Log를 남김
      this.logger.log(
        `${req.ip} ${req.method} ${res.statusCode}`,
        req.originalUrl,
      );
    });
    next();
  }
}
```

`@Module` 데코레이터에서는 미들웨어를 사용할 수 없음
`configure` 모듈 클래스의 메서드를 사용해야함

```js
// app.module.ts
// Middleware 는 configure 을 통해 추가하도록 한다
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // * 을 넣으면 전체 Router에 적용 가능하다
  }
}
```

## 예외처리

### Exception Filter

Nest 에서 기본적으로 제공하는 `HttpException` 과 `Exception Filter` 를 활용하여 Exception 응답값 형태를 컨트롤 할 수 있음

```js
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as  //Error 를 string 과 json 두 형태로 받음
      | string
      | { error: string; statusCode: number; message: string | string[] };

    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...error,
      });
    }
  }
}

```

특정 함수에 대해서만 Filter 처리를 할 수 있고,

```js
@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getAllCat() {
    return { cats: 'get all cats api' };
  }
...
```

전역적으로 Filter 처리를 할 수 있다

```js
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(8000);
}
```

## Pipes

### 클리이언트 요청에서 들어오는 데이터를 유효성 검사 및 변환을 수행

`Pipes and Filter Pattern` [[링크](https://docs.microsoft.com/en-us/azure/architecture/patterns/pipes-and-filters)]

```js
@Get(':id')
getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) param: number) {
  console.log(param);
  return 'get One Cat';
}
// ParseIntPipe 의 경우, 숫자형태의 string을 int로 변환시켜주고, int 변환이 불가능한 경우, Validation Error를 낸다

//PositiveIntPipe -> ID값이 항상 양의 정수임을 Validate 해주는 CustomPipe
@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: number) {
    if (value < 0) {
      throw new HttpException('value must be over 0', 400);
    }
    return value;
  }
}
```

## 인터셉터

### AOP 관점 지향 프로그래밍

[[관점지향 프로그래밍 참고 블로그](https://velog.io/@gillog/AOP%EA%B4%80%EC%A0%90-%EC%A7%80%ED%96%A5-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)]
=> `모듈성을 증가`시키는데에 목적을 둠

인터셉터에서는 컨트롤러가 시작하기 전과 끝났을 때 처리를 구분지을 수 있다.

### Nest 의 Request Life Cycle

1. Incoming request
2. Globally bound middleware
3. Module bound middleware
4. Global guards
5. Controller guards
6. Route guards
7. <u>Global interceptors (pre-controller)</u>
8. <u>Controller interceptors (pre-controller)</u>
9. <u>Route interceptors (pre-controller)</u>
10. Global pipes
11. Controller pipes
12. Route pipes
13. Route parameter pipes
14. Controller (method handler)
15. Service (if exists)
16. <u>Route interceptor (post-request)</u>
17. <u>Controller interceptor (post-request)</u>
18. <u>Global interceptor (post-request)</u>
19. Exception filters (route, then controller, then global)
20. Server response

```js
// 성공 응답값을 통일화 하기위한 Interceptor
// success.interceptor.ts
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
```
