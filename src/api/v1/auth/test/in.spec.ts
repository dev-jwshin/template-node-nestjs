import * as request from 'supertest';
import { app, dataSource } from '../../../../config/test/jest.setup';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { hash } from 'bcrypt';
import { Post } from '../../posts/post.entity';

describe('AuthController (E2E) - In', () => {
  const API_ENDPOINT = '/api/v1/auth/in';
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = dataSource.getRepository(User);
  });

  describe('POST /api/v1/auth/in', () => {
    it('유효한 로그인 정보로 로그인 시 사용자 정보를 반환해야 함', async () => {
      // 테스트용 비밀번호
      const rawPassword = 'password123';
      const hashedPassword = await hash(rawPassword, 10);

      // 테스트용 사용자 생성
      const testUser = await userRepository.save({
        email: 'test@example.com',
        name: '홍길동',
        password: hashedPassword,
        isActive: true,
      });

      // 로그인 데이터 준비
      const loginData = {
        email: 'test@example.com',
        password: rawPassword,
      };

      // HTTP 요청 및 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(loginData)
        .expect(200);

      // 응답에 적절한 사용자 정보가 포함되어 있는지 확인
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(testUser.id);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);

      // 비밀번호는 응답에 포함되지 않아야 함
      expect(response.body.password).toBeUndefined();
    });

    it('존재하지 않는 이메일로 로그인 시 에러가 발생해야 함', async () => {
      // 존재하지 않는 이메일로 로그인 시도
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(loginData)
        .expect(401);

      // 에러 메시지 확인
      expect(response.body.message).toBe('존재하지 않는 이메일입니다.');
    });

    it('잘못된 비밀번호로 로그인 시 에러가 발생해야 함', async () => {
      // 테스트용 비밀번호
      const rawPassword = 'password123';
      const hashedPassword = await hash(rawPassword, 10);

      // 테스트용 사용자 생성
      await userRepository.save({
        email: 'test@example.com',
        name: '홍길동',
        password: hashedPassword,
        isActive: true,
      });

      // 잘못된 비밀번호로 로그인 시도
      const loginData = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(loginData)
        .expect(401);

      // 에러 메시지 확인
      expect(response.body.message).toBe('비밀번호가 일치하지 않습니다.');
    });

    it('필수 필드가 누락된 경우 에러가 발생해야 함', async () => {
      // 비밀번호 필드가 누락된 로그인 데이터
      const loginDataWithoutPassword = {
        email: 'test@example.com',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await request(app.getHttpServer())
        .post(API_ENDPOINT)
        .send(loginDataWithoutPassword)
        .expect(400);

      // 에러 메시지 확인 - 메시지가 배열로 오는 경우 처리
      const errorMessages = Array.isArray(response.body.message)
        ? response.body.message
        : [response.body.message];

      // 비밀번호 관련 에러 메시지가 하나라도 포함되어 있는지 확인
      expect(errorMessages.some(msg => msg.includes('비밀번호'))).toBe(true);
    });

    it('로그인 성공 시 세션에 사용자 정보가 저장되어야 함', async () => {
      // 테스트용 비밀번호
      const rawPassword = 'password123';
      const hashedPassword = await hash(rawPassword, 10);

      // 테스트용 사용자 생성
      const testUser = await userRepository.save({
        email: 'test@example.com',
        name: '홍길동',
        password: hashedPassword,
        isActive: true,
      });

      // 로그인 데이터 준비
      const loginData = {
        email: 'test@example.com',
        password: rawPassword,
      };

      // 세션이 유지되는 에이전트 생성
      const agent = request.agent(app.getHttpServer());

      // 로그인 요청
      await agent.post(API_ENDPOINT).send(loginData).expect(200);

      // 세션이 유지되는지 확인하기 위해 인증이 필요한 엔드포인트 접근
      // 이 테스트에서는 직접적으로 세션을 확인할 수 없으므로, 로그아웃 엔드포인트를 통해 간접적으로 확인
      const logoutResponse = await agent.post('/api/v1/auth/out').expect(200);

      // 로그아웃이 성공적으로 이루어졌다면 세션에 사용자 정보가 있었다는 의미
      expect(logoutResponse.status).toBe(200);
    });
  });
});
