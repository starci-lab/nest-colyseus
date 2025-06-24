import { Global, Module } from '@nestjs/common';
import {
  CACHE_MODULE_OPTIONS,
  CacheModuleClass,
} from './cache.module-definition';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [],
  providers: [
    CacheService,
    {
      provide: CACHE_MODULE_OPTIONS,
      useValue: {},
    },
  ],
  exports: [CacheService],
})
export class CacheModule extends CacheModuleClass {}
