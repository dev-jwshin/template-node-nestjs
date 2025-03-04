# NestJS API 템플릿

<p align="left">
  <a href="README.md">English</a> |
  <a href="README.ko.md">한국어</a>
</p>

TypeScript로 RESTful API를 구축하기 위한 강력하고 확장 가능하며 프로덕션에 즉시 사용할 수 있는 NestJS 템플릿입니다. 이 템플릿은 모범 사례, 모듈식 아키텍처 및 포괄적인 테스트 기능을 갖춘 백엔드 애플리케이션을 개발하기 위한 견고한 기반을 제공합니다.

## 기능

- **NestJS 프레임워크**: 효율적이고 확장 가능한 서버 측 애플리케이션을 구축하기 위한 진보적인 Node.js 프레임워크인 NestJS 11을 기반으로 구축
- **TypeScript**: 더 나은 개발자 경험과 코드 품질을 위한 완전한 타입 코드베이스
- **MySQL 데이터베이스**: 강력한 데이터 지속성을 위한 TypeORM을 통한 MySQL 통합
- **인증 시스템**:
  - 프로덕션 환경을 위한 Redis 스토어 기반 세션 인증
  - JWT 인증 기능
  - bcrypt를 사용한 안전한 비밀번호 해싱
- **API 버전 관리**: 더 나은 API 수명주기 관리를 위한 구조화된 API 버전 관리(현재 v1)
- **환경 설정**:
  - Joi를 사용한 유효성 검증을 포함한 포괄적인 환경 설정
  - 다양한 환경(개발, 테스트, 프로덕션) 지원
  - 중앙 집중식 설정 서비스
- **세션 관리**:
  - 프로덕션 환경을 위한 Redis 기반 세션 관리
  - 개발/테스트 환경을 위한 메모리 기반 세션
  - 구성 가능한 세션 옵션
- **쿼리 파싱**:
  - 고급 필터링, 페이지네이션 및 관계 포함을 위한 내장 쿼리 파서
  - 쿼리 기능 구현을 위한 데코레이터
- **응답 포맷팅**:
  - 인터셉터를 통한 일관된 응답 포맷팅
  - 데코레이터를 통한 응답 필터링
- **유효성 검증**: class-validator와 class-transformer를 사용한 요청 유효성 검증
- **동적 서비스 팩토리**: 공통 CRUD 작업을 위한 재사용 가능한 서비스 팩토리 패턴
- **테스트 프레임워크**:
  - 단위 및 통합 테스트를 위한 포괄적인 Jest 설정
  - 데이터베이스 작업, 인증 및 API 테스트를 위한 테스트 유틸리티
  - Fishery와 Faker를 사용한 테스트 데이터 생성을 위한 팩토리

## 프로젝트 구조

```
src/
├── api/                  # 버전별로 정리된 API 엔드포인트
│   └── v1/               # 버전 1 API 엔드포인트
│       ├── auth/         # 인증 관련 엔드포인트
│       │   ├── dto/      # 인증용 데이터 전송 객체
│       │   ├── guards/   # 인증 가드
│       │   └── test/     # 인증별 테스트
│       ├── users/        # 사용자 관리 엔드포인트
│       │   ├── test/     # 사용자별 테스트
│       │   └── user.entity.ts  # 사용자 엔티티 정의
│       └── posts/        # 게시물 관리 엔드포인트
│           ├── test/     # 게시물별 테스트
│           └── post.entity.ts  # 게시물 엔티티 정의
├── common/               # 공유 유틸리티, 인터셉터 및 데코레이터
│   ├── base/             # 기본 클래스 및 팩토리
│   │   └── dynamic-service.factory.ts  # 동적 서비스 팩토리
│   ├── decorators/       # 사용자 정의 데코레이터
│   │   └── response.decorator.ts  # 응답 필터링 데코레이터
│   ├── interceptors/     # 전역 인터셉터
│   │   └── response-filter.interceptor.ts  # 응답 포맷팅
│   └── query-parser/     # 쿼리 파싱 기능
│       ├── decorators/   # 쿼리 파서 데코레이터
│       ├── interceptors/ # 쿼리 파서 인터셉터
│       ├── interfaces/   # 쿼리 파서 인터페이스
│       └── services/     # 쿼리 파서 서비스
├── config/               # 애플리케이션 설정
│   ├── test/             # 테스트 설정 및 유틸리티
│   │   ├── jest.setup.ts # Jest 설정 구성
│   │   └── test-utils.ts # 테스트 유틸리티 함수
│   ├── typeorm/          # TypeORM 특정 설정
│   ├── configuration.ts  # 설정 로더
│   └── env.config.ts     # 환경 설정 서비스
├── session/              # 세션 관리
│   ├── session.controller.ts  # 세션 컨트롤러
│   ├── session.module.ts      # 세션 모듈
│   └── session.service.ts     # 세션 서비스
└── main.ts               # 애플리케이션 진입점
```

## 필수 조건

- Node.js (v18 이상)
- MySQL (v8 이상)
- Redis (프로덕션 환경용)
- TypeScript 지식
- NestJS 친숙도

## 설치

1. 저장소 복제:

```bash
git clone <repository-url>
cd template-node-nestjs
```

2. 의존성 설치:

```bash
npm install
```

3. 환경 변수 설정:

```bash
cp .env.example .env
```

`.env` 파일을 구성에 맞게 편집하세요.

4. MySQL 데이터베이스 생성:

```sql
CREATE DATABASE `template-node-nestjs-dev`;
```

## 애플리케이션 실행

### 개발

```bash
npm run start:dev
```

### 디버그 모드

```bash
npm run start:debug
```

### 프로덕션

```bash
npm run build
npm run start:prd
```

## 테스트

### 테스트 실행

```bash
npm test
```

### 테스트 구조

템플릿에는 다음과 같은 포괄적인 테스트 프레임워크가 포함되어 있습니다:

- 서비스 및 유틸리티를 위한 단위 테스트
- API 엔드포인트를 위한 통합 테스트
- 일반적인 테스트 작업을 위한 테스트 유틸리티
- 테스트 데이터 생성을 위한 테스트 팩토리

테스트 파일은 `.spec.ts` 접미사가 붙은 테스트 대상 모듈 옆에 위치합니다.

## 환경 설정

애플리케이션은 다양한 환경 설정을 사용합니다:

- `.env.development` - 개발 환경
- `.env.test` - 테스트 환경
- `.env.production` - 프로덕션 환경

환경 변수 예제:

```
APP_NAME=APP_NAME
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_NAME=template-node-nestjs-dev

# 세션 설정
SESSION_SECRET=my_session_secret
SESSION_MAX_AGE=86400000

# Redis 설정 (프로덕션용)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password
```

## API 엔드포인트

API는 버전별로 구조화되어 있습니다:

### 인증

- `POST /api/v1/auth/up` - 새 사용자 등록
- `POST /api/v1/auth/in` - 사용자 로그인

### 사용자

- `GET /api/v1/users` - 사용자 목록
- `GET /api/v1/users/:id` - 사용자 상세 정보
- `PUT /api/v1/users/:id` - 사용자 정보 업데이트
- `DELETE /api/v1/users/:id` - 사용자 삭제

### 게시물

- `GET /api/v1/posts` - 게시물 목록
- `GET /api/v1/posts/:id` - 게시물 상세 정보
- `POST /api/v1/posts` - 게시물 생성
- `PUT /api/v1/posts/:id` - 게시물 업데이트
- `DELETE /api/v1/posts/:id` - 게시물 삭제

## 쿼리 파라미터

API는 고급 쿼리 파라미터를 지원합니다:

### 필터링

필드 값으로 레코드 필터링:

```
GET /api/v1/posts?filter[published]=true
```

### 관계 포함

관련 엔티티 포함:

```
GET /api/v1/posts?include=author
```

### 페이지네이션

결과 페이지 나누기:

```
GET /api/v1/posts?page=1&perPage=10
```

## 데이터베이스

애플리케이션은 MySQL과 함께 TypeORM을 사용합니다. 데이터베이스 설정은 환경 변수를 통해 관리됩니다.

### 엔티티 구조

- **User**: 애플리케이션 사용자 표현

  - 필드: id, name, email, password, isActive, createdAt, updatedAt
  - 관계: Posts와 일대다 관계

- **Post**: 블로그 게시물 표현
  - 필드: id, title, content, published, createdAt, updatedAt, authorId
  - 관계: User와 다대일 관계

## 세션 관리

세션은 express-session을 사용하여 관리됩니다:

- 개발/테스트 환경을 위한 메모리 스토어
- 프로덕션 환경을 위한 Redis 스토어

세션 설정은 환경 변수를 통해 사용자 정의할 수 있습니다.

## 인증

애플리케이션은 다음을 지원합니다:

- 세션 기반 인증
- bcrypt를 사용한 비밀번호 해싱
- 라우트 보호를 위한 인증 가드

## 개발 도구

- **ESLint**: 사용자 정의 설정이 있는 코드 린팅
- **Prettier**: 코드 포맷팅
- **Jest**: 테스트 프레임워크
- **SWC**: 빠른 TypeScript 컴파일

## 적용된 모범 사례

- 모듈식 아키텍처를 통한 관심사 분리
- 더 나은 테스트 가능성을 위한 의존성 주입
- 환경별 설정
- 일관된 오류 처리
- 응답 포맷팅
- 쿼리 파라미터 파싱
- 포괄적인 테스트 유틸리티

## 기여

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경 사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 라이센스

이 프로젝트는 [UNLICENSED License](LICENSE) 하에 라이센스가 부여됩니다.
