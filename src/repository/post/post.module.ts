import { Module } from '@nestjs/common';
import { PostService } from './post.service';

@Module({
  imports: [],
  providers: [PostService],
})
export class PostModule {}
