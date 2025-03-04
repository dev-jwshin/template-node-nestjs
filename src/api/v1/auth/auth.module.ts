import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { ConfigurationModule } from 'src/config/config.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [ConfigurationModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
