import * as request from 'supertest';
import { app, dataSource } from '../../../../config/test/jest.setup';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { userFactory } from '../../users/test/user.factory';
import { compare } from 'bcrypt';
import { Post } from '../../posts/post.entity';

describe('AuthController (E2E) - Up', () => {
  const API_ENDPOINT = '/api/v1/auth/up';
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = dataSource.getRepository(User);
  });

  describe('POST /api/v1/auth/up', () => {
    it('유효한 회원가입 데이터로 요청 시 새로운 사용자를 생성해야 함', async () => {
      // 회원가입 데이터 준비
      const signupData = {
        email: 'test@example.com',
        name: '홍길동',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      // HTTP 요청 및 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(signupData)
        .expect(200);

      // 응답에 사용자 정보가 포함되어 있는지 확인
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe(signupData.email);
      expect(response.body.name).toBe(signupData.name);

      // 비밀번호는 응답에 포함되지 않아야 함
      expect(response.body.password).toBeUndefined();

      // DB에 사용자가 실제로 저장되었는지 확인
      const createdUser = await userRepository.findOne({ where: { email: signupData.email } });
      expect(createdUser).not.toBeNull();

      if (createdUser) {
        expect(createdUser.email).toBe(signupData.email);
        expect(createdUser.name).toBe(signupData.name);

        // 비밀번호가 해시되었는지 확인
        const isPasswordMatched = await compare(signupData.password, createdUser.password);
        expect(isPasswordMatched).toBe(true);
      }
    });

    it('이미 존재하는 이메일로 회원가입 시 에러가 발생해야 함', async () => {
      // 기존 사용자 생성
      const existingUser = await userRepository.save({
        email: 'existing@example.com',
        name: '기존사용자',
        password: 'hashedPassword',
        isActive: true,
      });

      // 동일한 이메일로 회원가입 시도
      const signupData = {
        email: 'existing@example.com',
        name: '다른이름',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(signupData)
        .expect(400);

      // 에러 메시지 확인
      expect(response.body.message).toBe('이미 존재하는 이메일입니다.');

      // 사용자가 추가로 생성되지 않았는지 확인
      const userCount = await userRepository.count({ where: { email: existingUser.email } });
      expect(userCount).toBe(1);
    });

    it('비밀번호와 비밀번호 확인이 일치하지 않으면 에러가 발생해야 함', async () => {
      // 다른 비밀번호로 회원가입 시도
      const signupData = {
        email: 'test@example.com',
        name: '홍길동',
        password: 'password123',
        passwordConfirm: 'differentPassword',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(signupData)
        .expect(400);

      // 에러 메시지 확인 - 메시지가 배열로 오는 경우 처리
      const errorMessages = Array.isArray(response.body.message)
        ? response.body.message
        : [response.body.message];

      // 비밀번호 관련 에러 메시지가 하나라도 포함되어 있는지 확인
      expect(errorMessages.some(msg => msg.includes('비밀번호'))).toBe(true);

      // 사용자가 생성되지 않았는지 확인
      const userCount = await userRepository.count({ where: { email: signupData.email } });
      expect(userCount).toBe(0);
    });

    it('필수 필드가 누락된 경우 에러가 발생해야 함', async () => {
      // 이메일 필드가 누락된 회원가입 데이터
      const signupDataWithoutEmail = {
        name: '홍길동',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(signupDataWithoutEmail)
        .expect(400);

      // 에러 메시지 확인 - 메시지가 배열로 오는 경우 처리
      const errorMessages = Array.isArray(response.body.message)
        ? response.body.message
        : [response.body.message];

      // 이메일 관련 에러 메시지가 하나라도 포함되어 있는지 확인
      expect(errorMessages.some(msg => msg.includes('이메일'))).toBe(true);

      // 사용자가 생성되지 않았는지 확인
      const userCount = await userRepository.count();
      expect(userCount).toBe(0);
    });
  });
});
