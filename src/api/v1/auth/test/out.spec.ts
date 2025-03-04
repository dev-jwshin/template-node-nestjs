import { app, dataSource } from '../../../../config/test/jest.setup';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { hash } from 'bcrypt';
import { api } from '../../../../config/test/test-utils';
import * as request from 'supertest';

describe('AuthController (E2E) - Out', () => {
  const API_ENDPOINT = '/api/v1/auth/out';
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = dataSource.getRepository(User);
  });

  describe('POST /api/v1/auth/out', () => {
    it('로그인된 상태에서 로그아웃 요청 시 성공해야 함', async () => {
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
      await agent.post('/api/v1/auth/in').send(loginData).expect(200);

      // 로그아웃 요청
      const response = await agent.post(API_ENDPOINT).expect(200);

      // 응답 확인
      expect(response.status).toBe(200);
    });

    it('로그아웃 후 인증이 필요한 엔드포인트 접근 시 실패해야 함', async () => {
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
      await agent.post('/api/v1/auth/in').send(loginData).expect(200);

      // 로그아웃 요청
      await agent.post(API_ENDPOINT).expect(200);

      // 인증이 필요한 엔드포인트 접근
      const response = await agent.get('/api/v1/users/me');

      // 인증 실패로 4xx 에러가 발생해야 함
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    });
  });
});
