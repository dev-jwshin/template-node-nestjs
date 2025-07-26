<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# ForYourBiz NestJS Template

이 프로젝트는 [NestJS](https://nestjs.com/)와 [@dataui/crud](https://github.com/dataui/crud)를 사용하여 구축된 RESTful API 템플릿입니다.

## 특징

- 🔌 **자동 CRUD 생성**: @dataui/crud를 사용하여 자동으로 CRUD 엔드포인트 생성
- 🗄️ **TypeORM 통합**: PostgreSQL 데이터베이스와 TypeORM을 사용한 ORM 지원
- 🔍 **쿼리 파싱**: 필터링, 페이지네이션, 정렬, 관계 조인 등 풍부한 쿼리 기능
- ✅ **검증**: class-validator를 사용한 DTO 및 엔티티 검증
- 🔐 **JWT 인증**: JWT 기반 로그인/로그아웃 및 Refresh Token 지원
- 📱 **소셜 로그인**: Google, Apple, Kakao, Naver 소셜 로그인 지원
- 📚 **Swagger**: 자동 API 문서 생성 (추가 설정 필요)
- 🚀 **Railway PostgreSQL**: Railway 호스팅 PostgreSQL 데이터베이스 연결

## 설치된 패키지

### 핵심 패키지
- `@dataui/crud`: 핵심 CRUD 패키지
- `@dataui/crud-request`: 요청 빌더/파서
- `@dataui/crud-typeorm`: TypeORM 통합
- `@nestjs/typeorm`: NestJS TypeORM 통합
- `typeorm`: TypeORM ORM
- `pg`: PostgreSQL 데이터베이스 드라이버
- `class-validator`: 검증 라이브러리
- `class-transformer`: 변환 라이브러리

### 인증 관련 패키지
- `@nestjs/jwt`: JWT 토큰 처리
- `@nestjs/passport`: Passport 통합
- `passport`: Passport 인증 프레임워크
- `passport-jwt`: JWT 전략
- `passport-local`: 로컬 전략
- `bcrypt`: 비밀번호 해싱

### 소셜 로그인 패키지
- `passport-google-oauth20`: Google OAuth 2.0 전략
- `passport-apple`: Apple 로그인 전략
- `passport-kakao`: Kakao 로그인 전략
- `passport-naver-v2`: Naver 로그인 전략

### 타입 정의 (개발 의존성)
- `@types/pg`: PostgreSQL 타입 정의
- `@types/passport-jwt`: Passport JWT 타입 정의
- `@types/passport-local`: Passport Local 타입 정의
- `@types/bcrypt`: bcrypt 타입 정의
- `@types/passport-google-oauth20`: Google OAuth 타입 정의

## 데이터베이스 설정

이 프로젝트는 Railway에서 호스팅되는 PostgreSQL 데이터베이스를 사용합니다.

### 데이터베이스 연결 정보

연결 정보는 `src/app.module.ts`에서 설정되어 있습니다:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'ballast.proxy.rlwy.net',
  port: 42554,
  username: 'postgres',
  password: 'kphuEHFQlgWjhpdgXBbcBqzEdVHkFJvn',
  database: 'railway',
  entities: [User],
  synchronize: true, // 개발 환경에서만 사용하세요
  logging: true,
  ssl: {
    rejectUnauthorized: false, // Railway에서 SSL 연결을 위해 필요
  },
})
```

⚠️ **주의**: 프로덕션 환경에서는 `synchronize: false`로 설정하고 마이그레이션을 사용하세요.

## 환경변수 설정

### 필수 환경변수

프로젝트 실행을 위해 다음 환경변수들이 필요합니다:

```bash
# 서버 설정
PORT=3000
NODE_ENV=development

# API 설정
API_VERSION=1
API_PREFIX=api/v

# JWT 설정 (필수)
JWT_SECRET=your-jwt-secret-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# 데이터베이스 설정 (필수)
DATABASE_TYPE=postgres
DATABASE_HOST=ballast.proxy.rlwy.net
DATABASE_PORT=42554
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=kphuEHFQlgWjhpdgXBbcBqzEdVHkFJvn
DATABASE_NAME=railway
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true

# SSL 설정 (Railway용)
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 소셜 로그인 선택적 설정

소셜 로그인은 선택적으로 사용할 수 있습니다. 필요한 플랫폼의 환경변수만 설정하면 해당 소셜 로그인이 활성화됩니다:

```bash

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Kakao OAuth
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_CALLBACK_URL=http://localhost:3000/auth/kakao/callback

# Naver OAuth
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
NAVER_CALLBACK_URL=http://localhost:3000/auth/naver/callback

# Apple OAuth
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key
APPLE_CALLBACK_URL=http://localhost:3000/auth/apple/callback
```

### 소셜 로그인 설정 가이드

1. **Google OAuth 설정**
   - [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
   - OAuth 2.0 클라이언트 ID 생성
   - 승인된 리디렉션 URI에 콜백 URL 추가

2. **Kakao OAuth 설정**  
   - [카카오 개발자](https://developers.kakao.com/)에서 앱 생성
   - 플랫폼 설정에서 Web 플랫폼의 사이트 도메인 등록
   - Redirect URI 설정

3. **Naver OAuth 설정**
   - [네이버 개발자 센터](https://developers.naver.com/)에서 애플리케이션 등록
   - 서비스 URL과 Callback URL 설정

4. **Apple OAuth 설정**
   - [Apple Developer](https://developer.apple.com/)에서 App ID 및 Service ID 생성
   - Sign in with Apple 키 생성
   - 개인키(.p8 파일) 다운로드하여 환경변수에 설정

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run start:dev
```

### 3. 빌드

```bash
npm run build
```

### 4. 프로덕션 실행

```bash
npm run start:prod
```

## API 엔드포인트

### 인증 API

#### 일반 로그인/회원가입
- `POST /auth/sign/up` - 회원가입
- `POST /auth/sign/in` - 로그인
- `POST /auth/sign/refresh` - Access Token 갱신
- `POST /auth/sign/out` - 로그아웃

#### 소셜 로그인
- `GET /auth/google` - Google 로그인 시작
- `GET /auth/google/callback` - Google 로그인 콜백
- `GET /auth/kakao` - Kakao 로그인 시작  
- `GET /auth/kakao/callback` - Kakao 로그인 콜백
- `GET /auth/naver` - Naver 로그인 시작
- `GET /auth/naver/callback` - Naver 로그인 콜백
- `GET /auth/apple` - Apple 로그인 시작
- `GET /auth/apple/callback` - Apple 로그인 콜백

#### 요청/응답 예시

**회원가입**
```bash
POST /auth/sign/up
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123",
  "phone": "010-1234-5678",
  "role": "user"
}
```

**로그인**
```bash
POST /auth/sign/in
{
  "email": "hong@example.com",
  "password": "password123"
}

# 응답
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**토큰 갱신**
```bash
POST /auth/sign/refresh
Authorization: Bearer {refresh_token}

# 응답
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 사용자 API

기본 CRUD 엔드포인트가 자동으로 생성됩니다:

- `GET /users` - 모든 사용자 조회 (페이지네이션, 필터링 지원)
- `GET /users/:id` - 특정 사용자 조회
- `GET /users/me` - 현재 로그인한 사용자 정보 조회 (인증 필요)
- `POST /users` - 사용자 생성
- `PUT /users/:id` - 사용자 업데이트
- `DELETE /users/:id` - 사용자 삭제

**인증이 필요한 요청 예시**
```bash
GET /users/me
Authorization: Bearer {access_token}
```

### 쿼리 파라미터 예시

```bash
# 페이지네이션
GET /users?page=1&limit=10

# 필터링
GET /users?filter=name||$cont||John

# 정렬
GET /users?sort=name,ASC

# 복합 쿼리
GET /users?filter=status||$eq||active&sort=createdAt,DESC&limit=5
```

## 프로젝트 구조

```
src/
├── controllers/        # 컨트롤러
│   └── user.controller.ts
├── entities/          # 데이터베이스 엔티티
│   └── user.entity.ts
├── modules/           # 모듈
│   └── user.module.ts
├── services/          # 서비스
│   └── user.service.ts
├── app.module.ts      # 루트 모듈
└── main.ts           # 진입점
```

## 커스터마이징

### 새로운 엔티티 추가

1. `src/entities/`에 새로운 엔티티 생성
2. `src/services/`에 해당 서비스 생성
3. `src/controllers/`에 해당 컨트롤러 생성
4. `src/modules/`에 해당 모듈 생성
5. `app.module.ts`에 새로운 모듈 추가

### 커스텀 메서드 추가

컨트롤러에서 @dataui/crud가 제공하는 기본 메서드 외에 커스텀 메서드를 추가할 수 있습니다.

```typescript
@Get('active')
async getActiveUsers(): Promise<User[]> {
  return this.service.findActiveUsers();
}
```

## 참고 자료

- [NestJS Documentation](https://docs.nestjs.com/)
- [@dataui/crud Documentation](https://github.com/dataui/crud/wiki)
- [TypeORM Documentation](https://typeorm.io/)
- [Railway PostgreSQL Documentation](https://docs.railway.app/databases/postgresql)

## 라이선스

[MIT licensed](LICENSE).

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
