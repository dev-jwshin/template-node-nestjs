import * as request from 'supertest';
import { app, dataSource } from '../../../../config/test/jest.setup';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { hash } from 'bcrypt';
import { Post } from '../../posts/post.entity';

describe('AuthController (E2E) - Out', () => {
  const API_ENDPOINT = '/api/v1/auth/out';
  const LOGIN_ENDPOINT = '/api/v1/auth/in';
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = dataSource.getRepository(User);
  });

  describe('POST /api/v1/auth/out', () => {
    it('로그인된 상태에서 로그아웃 요청 시 세션이 제거되어야 함', async () => {
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

      // 먼저 로그인
      await agent.post(LOGIN_ENDPOINT).send(loginData).expect(200);

      // 로그아웃 요청
      await agent.post(API_ENDPOINT).expect(200);

      // 로그아웃 후 인증이 필요한 엔드포인트에 접근 시 인증 실패해야 함
      // 다시 로그아웃 엔드포인트에 접근해보면 인증 실패로 401이 나와야 함
      const unauthorizedResponse = await agent.post(API_ENDPOINT).expect(401);
      expect(unauthorizedResponse.status).toBe(401);
    });

    it('로그인되지 않은 상태에서 로그아웃 요청 시 401 에러가 발생해야 함', async () => {
      // 로그인하지 않고 바로 로그아웃 요청
      const response = await request(app.getHttpServer()).post(API_ENDPOINT).expect(401);

      // 에러 메시지 확인
      expect(response.status).toBe(401);
    });

    it('여러 번 로그인 및 로그아웃을 반복해도 정상적으로 동작해야 함', async () => {
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

      // 첫 번째 로그인
      await agent.post(LOGIN_ENDPOINT).send(loginData).expect(200);

      // 첫 번째 로그아웃
      await agent.post(API_ENDPOINT).expect(200);

      // 두 번째 로그인
      await agent.post(LOGIN_ENDPOINT).send(loginData).expect(200);

      // 두 번째 로그아웃
      await agent.post(API_ENDPOINT).expect(200);

      // 세 번째 로그인
      await agent.post(LOGIN_ENDPOINT).send(loginData).expect(200);

      // 세 번째 로그아웃
      await agent.post(API_ENDPOINT).expect(200);

      // 로그아웃 후 인증이 필요한 엔드포인트에 접근 시 인증 실패해야 함
      const unauthorizedResponse = await agent.post(API_ENDPOINT).expect(401);
      expect(unauthorizedResponse.status).toBe(401);
    });
  });
});
