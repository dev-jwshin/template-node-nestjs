import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

import configuration from './config/configuration';
import { validationSchema } from './config/env.validation';
import { ConfigurationModule } from './config/config.module';
import { EnvConfigService } from './config/env.config';
import { SessionModule } from './session/session.module';
import { ResponseFilterInterceptor } from './common/interceptors/response-filter.interceptor';
import { QueryParserModule } from './common/query-parser/query-parser.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { UsersModule } from './api/v1/users/users.module';
import { PostsModule } from './api/v1/posts/posts.module';
import { FileLogger } from './config/typeorm/file-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema,
    }),
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [EnvConfigService],
      useFactory: (configService: EnvConfigService) => ({
        type: 'mysql',
        host: configService.databaseHost || 'localhost',
        port: configService.databasePort || 3306,
        username: configService.databaseUsername || 'root',
        password: configService.databasePassword || '',
        database: configService.databaseName || 'manito-dev',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: !configService.isProduction,
        logging: !configService.isProduction ? ['query', 'error', 'schema', 'migration'] : false,
        logger: !configService.isProduction ? new FileLogger() : undefined,
      }),
    }),
    SessionModule.register(),
    QueryParserModule,
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFilterInterceptor,
    },
  ],
})
export class AppModule {}
