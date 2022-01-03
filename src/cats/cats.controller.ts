import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
  // UseFilters,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.Interceptor';
import { PositiveIntPipe } from 'src/common/pipes/positiveInt.pipe';
import { CatsService } from './cats.service';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
// @UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getAllCat() {
    return { cats: 'get all cats api' };
  }

  @Get(':id')
  getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) param: number) {
    console.log(param);
    return 'get One Cat';
  }

  @Post()
  createCat() {
    return 'create Cat';
  }

  @Put(':id')
  updateCat() {
    return 'update Cat';
  }

  @Delete(':id')
  deleteCat() {
    return 'delete Cat';
  }
}
