import {
  Controller,
  Post,
  Body,
  Session,
  HttpCode,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InDto, UpDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('up')
  @HttpCode(200)
  async up(@Body() data: UpDto, @Session() session: Record<string, any>) {
    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 일치 여부 확인
    if (data.password !== data.passwordConfirm) {
      throw new BadRequestException('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }

    // 비밀번호 암호화
    const hashedPassword = await hash(data.password, 10);

    // 사용자 생성
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // 사용자 저장
    await this.userRepository.save(user);

    // 세션에 사용자 저장
    session.user = user;

    // 사용자 반환
    return user;
  }

  @Post('in')
  @HttpCode(200)
  async in(@Body() data: InDto, @Session() session: Record<string, any>) {
    // 이메일 존재 여부 확인
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 세션에 사용자 저장
    session.user = user;

    // 사용자 반환
    return user;
  }

  @Post('out')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async out(@Session() session: Record<string, any>) {
    // 세션 제거
    session.destroy();
  }
}
