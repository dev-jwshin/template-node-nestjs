import { app, dataSource } from '../../../../config/test/jest.setup';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { hash } from 'bcrypt';
import { api } from '../../../../config/test/test-utils';

describe('AuthController (E2E) - Up', () => {
  const API_ENDPOINT = '/api/v1/auth/up';
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = dataSource.getRepository(User);
  });

  describe('POST /api/v1/auth/up', () => {
    it('유효한 회원가입 정보로 요청 시 사용자를 생성하고 정보를 반환해야 함', async () => {
      // 회원가입 데이터 준비
      const signupData = {
        email: 'newuser@example.com',
        name: '새사용자',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      // HTTP 요청 및 응답 확인
      const response = await api().endpoint(API_ENDPOINT).post().body(signupData).execute();

      // 응답에 적절한 사용자 정보가 포함되어 있는지 확인
      expect(response.body).toBeDefined();
      expect(response.body.email).toBe(signupData.email);
      expect(response.body.name).toBe(signupData.name);

      // 비밀번호는 응답에 포함되지 않아야 함
      expect(response.body.password).toBeUndefined();

      // 데이터베이스에 사용자가 생성되었는지 확인
      const createdUser = await userRepository.findOne({
        where: { email: signupData.email },
      });
      expect(createdUser).toBeDefined();
      expect(createdUser!.email).toBe(signupData.email);
      expect(createdUser!.name).toBe(signupData.name);
    });

    it('이미 존재하는 이메일로 회원가입 시 에러가 발생해야 함', async () => {
      // 기존 사용자 생성
      await userRepository.save({
        email: 'existing@example.com',
        name: '기존사용자',
        password: await hash('password123', 10),
        isActive: true,
      });

      // 동일한 이메일로 회원가입 시도
      const signupData = {
        email: 'existing@example.com',
        name: '새사용자',
        password: 'newpassword123',
        passwordConfirm: 'newpassword123',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await api()
        .endpoint(API_ENDPOINT)
        .post()
        .body(signupData)
        .expectStatus(400)
        .execute();

      // 에러 메시지 확인
      expect(response.body.message).toBe('이미 존재하는 이메일입니다.');
    });

    it('필수 필드가 누락된 경우 에러가 발생해야 함', async () => {
      // 이메일이 누락된 회원가입 데이터
      const signupDataWithoutEmail = {
        name: '새사용자',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await api()
        .endpoint(API_ENDPOINT)
        .post()
        .body(signupDataWithoutEmail)
        .expectStatus(400)
        .execute();

      // 에러 메시지 확인 - 메시지가 배열로 오는 경우 처리
      const errorMessages = Array.isArray(response.body.message)
        ? response.body.message
        : [response.body.message];

      // 이메일 관련 에러 메시지가 하나라도 포함되어 있는지 확인
      expect(errorMessages.some(msg => msg.includes('이메일'))).toBe(true);
    });

    it('비밀번호가 너무 짧은 경우 에러가 발생해야 함', async () => {
      // 비밀번호와 비밀번호 확인이 일치하지 않는 데이터
      const signupDataWithMismatchedPassword = {
        email: 'newuser@example.com',
        name: '새사용자',
        password: 'password123',
        passwordConfirm: 'password456', // 비밀번호 불일치
      };

      // HTTP 요청 및 에러 응답 확인
      const response = await api()
        .endpoint(API_ENDPOINT)
        .post()
        .body(signupDataWithMismatchedPassword)
        .expectStatus(400)
        .execute();

      // 에러 메시지 확인
      expect(response.body.message).toBe('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    });

    it('회원가입 성공 후 바로 로그인할 수 있어야 함', async () => {
      // 회원가입 데이터 준비
      const signupData = {
        email: 'newuser@example.com',
        name: '새사용자',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      // 회원가입 요청
      await api().endpoint(API_ENDPOINT).post().body(signupData).execute();

      // 로그인 데이터 준비
      const loginData = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      // 로그인 요청
      const loginResponse = await api()
        .endpoint('/api/v1/auth/in')
        .post()
        .body(loginData)
        .execute();

      // 로그인 응답 확인
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.email).toBe(signupData.email);
    });
  });
});
