import { FindManyOptions } from 'typeorm';
import { dataSource, app } from './jest.setup';
import * as request from 'supertest';
import { _ } from '@faker-js/faker/dist/airline-BXaRegOM';
import { hash } from 'bcrypt';
import { User } from '../../api/v1/users/user.entity';

/**
 * 테스트용 파싱된 쿼리 객체 인터페이스
 */
export interface TestParsedQuery<T = any> {
  filters: { field: string; value: any }[];
  includes: { relation: string; nested: any[] }[];
  pagination: {
    page: number;
    perPage: number;
    skip: number;
    take: number;
  };
  toFindManyOptions: () => FindManyOptions<T>;
  toWhere: () => Record<string, any>;
}

/**
 * 테스트용 파싱된 쿼리 객체 생성
 * @param options 쿼리 옵션
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createParsedQuery<T = any>(
  options: {
    filters?: { field: string; value: any }[];
    includes?: { relation: string; nested: any[] }[];
    pagination?: {
      page?: number;
      perPage?: number;
      skip?: number;
      take?: number;
    };
    where?: Record<string, any>;
    relations?: Record<string, any>;
  } = {},
): TestParsedQuery<T> {
  const filters = options.filters || [];
  const includes = options.includes || [];
  const pagination = {
    page: options.pagination?.page || 1,
    perPage: options.pagination?.perPage || 15,
    skip:
      options.pagination?.skip ||
      (options.pagination?.page
        ? (options.pagination.page - 1) * (options.pagination?.perPage || 15)
        : 0),
    take: options.pagination?.take || options.pagination?.perPage || 15,
  };

  const where = options.where || {};
  filters.forEach(filter => {
    where[filter.field] = filter.value;
  });

  const relations = options.relations || {};
  includes.forEach(include => {
    relations[include.relation] = true;
  });

  return {
    filters,
    includes,
    pagination,
    toFindManyOptions: () => ({
      where,
      relations,
      skip: pagination.skip,
      take: pagination.take,
    }),
    toWhere: () => where,
  };
}

/**
 * 필터를 적용한 쿼리 생성
 * @param field 필터 필드
 * @param value 필터 값
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createFilterQuery<T = any>(field: string, value: any): TestParsedQuery<T> {
  return createParsedQuery({
    filters: [{ field, value }],
    where: { [field]: value },
  });
}

/**
 * 관계를 포함한 쿼리 생성
 * @param relation 포함할 관계 이름
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createIncludeQuery<T = any>(relation: string): TestParsedQuery<T> {
  return createParsedQuery({
    includes: [{ relation, nested: [] }],
    relations: { [relation]: true },
  });
}

/**
 * 페이지네이션을 적용한 쿼리 생성
 * @param page 페이지 번호
 * @param perPage 페이지당 항목 수
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createPaginationQuery<T = any>(page: number, perPage: number): TestParsedQuery<T> {
  return createParsedQuery({
    pagination: {
      page,
      perPage,
      skip: (page - 1) * perPage,
      take: perPage,
    },
  });
}

/**
 * 엔티티를 데이터베이스에 저장
 * @param entityClass 엔티티 클래스
 * @param entityData 저장할 엔티티 데이터
 * @returns 저장된 엔티티
 */
export async function saveEntity<T>(entityClass: any, entityData: any): Promise<T> {
  // 외래 키 관계를 제거하고 ID만 유지
  const cleanedData = { ...entityData };

  // 관계 객체를 제거하고 ID만 유지
  for (const key in cleanedData) {
    if (cleanedData[key] && typeof cleanedData[key] === 'object' && cleanedData[key].id) {
      // 관계 객체가 있고 ID가 있는 경우, 관계 객체를 제거하고 외래 키만 유지
      const relationId = cleanedData[key].id;
      delete cleanedData[key];

      // 외래 키 필드가 있는지 확인 (예: authorId)
      const foreignKeyField = `${key}Id`;
      if (!(foreignKeyField in cleanedData)) {
        cleanedData[foreignKeyField] = relationId;
      }
    }
  }

  return await dataSource.getRepository(entityClass).save(cleanedData);
}

/**
 * 여러 엔티티를 데이터베이스에 저장
 * @param entityClass 엔티티 클래스
 * @param entitiesData 저장할 엔티티 데이터 배열
 * @returns 저장된 엔티티 배열
 */
export async function saveEntities<T>(entityClass: any, entitiesData: any[]): Promise<T[]> {
  const savedEntities: T[] = [];
  for (const entityData of entitiesData) {
    const entity = await saveEntity<T>(entityClass, entityData);
    savedEntities.push(entity);
  }
  return savedEntities;
}

/**
 * 엔티티 API 테스트
 * @param endpoint API 엔드포인트
 * @param id 엔티티 ID (없으면 목록 엔드포인트로 간주)
 * @param queryParams 쿼리 파라미터
 * @param expectedStatus 기대하는 응답 상태 코드
 * @returns 응답 객체
 */
export async function testEndpoint(
  endpoint: string,
  id?: number,
  queryParams?: Record<string, any>,
  expectedStatus = 200,
) {
  const url = id !== undefined ? `${endpoint}/${id}` : endpoint;

  return await request(app.getHttpServer())
    .get(url)
    .query(queryParams || {})
    .expect(expectedStatus);
}

/**
 * 테스트용 사용자 생성 및 로그인하여 인증된 에이전트 반환
 * @param userData 사용자 데이터 (선택적)
 * @returns 생성된 사용자 및 인증된 supertest 에이전트
 */
export async function createAuthenticatedUser(
  userData?: Partial<User>,
): Promise<{ user: User; agent: any }> {
  const userRepository = dataSource.getRepository(User);

  // 테스트용 비밀번호
  const rawPassword = 'password123';
  const hashedPassword = await hash(rawPassword, 10);

  // 테스트용 사용자 생성
  const user = await userRepository.save({
    email: `test-${Date.now()}@example.com`,
    name: '테스트 사용자',
    password: hashedPassword,
    isActive: true,
    ...userData,
  });

  // 로그인 데이터 준비
  const loginData = {
    email: user.email,
    password: rawPassword,
  };

  // 세션이 유지되는 에이전트 생성
  const agent = request.agent(app.getHttpServer());

  // 로그인
  await agent.post('/api/v1/auth/in').send(loginData).expect(200);

  return { user, agent };
}

/**
 * 인증된 GET 요청 테스트
 * @param agent 인증된 supertest 에이전트
 * @param endpoint API 엔드포인트
 * @param id 엔티티 ID (없으면 목록 엔드포인트로 간주)
 * @param queryParams 쿼리 파라미터
 * @param expectedStatus 기대하는 응답 상태 코드
 * @returns 응답 객체
 */
export async function testAuthenticatedGetEndpoint(
  agent: any,
  endpoint: string,
  id?: number,
  queryParams?: Record<string, any>,
  expectedStatus = 200,
) {
  const url = id !== undefined ? `${endpoint}/${id}` : endpoint;

  return await agent
    .get(url)
    .query(queryParams || {})
    .expect(expectedStatus);
}

/**
 * 인증된 POST 요청 테스트
 * @param agent 인증된 supertest 에이전트
 * @param endpoint API 엔드포인트
 * @param body 요청 본문
 * @param expectedStatus 기대하는 응답 상태 코드
 * @returns 응답 객체
 */
export async function testAuthenticatedPostEndpoint(
  agent: any,
  endpoint: string,
  body?: Record<string, any>,
  expectedStatus = 200,
) {
  return await agent
    .post(endpoint)
    .send(body || {})
    .expect(expectedStatus);
}

/**
 * 인증된 PUT 요청 테스트
 * @param agent 인증된 supertest 에이전트
 * @param endpoint API 엔드포인트
 * @param id 엔티티 ID
 * @param body 요청 본문
 * @param expectedStatus 기대하는 응답 상태 코드
 * @returns 응답 객체
 */
export async function testAuthenticatedPutEndpoint(
  agent: any,
  endpoint: string,
  id: number,
  body?: Record<string, any>,
  expectedStatus = 200,
) {
  return await agent
    .put(`${endpoint}/${id}`)
    .send(body || {})
    .expect(expectedStatus);
}

/**
 * 인증된 DELETE 요청 테스트
 * @param agent 인증된 supertest 에이전트
 * @param endpoint API 엔드포인트
 * @param id 엔티티 ID
 * @param expectedStatus 기대하는 응답 상태 코드
 * @returns 응답 객체
 */
export async function testAuthenticatedDeleteEndpoint(
  agent: any,
  endpoint: string,
  id: number,
  expectedStatus = 200,
) {
  return await agent.delete(`${endpoint}/${id}`).expect(expectedStatus);
}

/**
 * 엔티티 목록 API 테스트
 * @param endpoint API 엔드포인트
 * @param queryParams 쿼리 파라미터
 * @returns 응답 객체
 */
export async function testListEndpoint(endpoint: string, queryParams?: Record<string, any>) {
  return testEndpoint(endpoint, undefined, queryParams);
}

/**
 * 엔티티 상세 API 테스트
 * @param endpoint API 엔드포인트
 * @param id 엔티티 ID
 * @param queryParams 쿼리 파라미터
 * @returns 응답 객체
 */
export async function testDetailEndpoint(
  endpoint: string,
  id: number,
  queryParams?: Record<string, any>,
  expectedStatus = 200,
) {
  return testEndpoint(endpoint, id, queryParams, expectedStatus);
}

/**
 * 필터 쿼리 파라미터 생성
 * @param field 필터 필드
 * @param value 필터 값
 * @returns 쿼리 파라미터 객체
 */
export function createFilterQueryParams(field: string, value: any): Record<string, any> {
  return { [`filter[${field}]`]: value };
}

/**
 * 관계 포함 쿼리 파라미터 생성
 * @param relation 포함할 관계 이름
 * @returns 쿼리 파라미터 객체
 */
export function createIncludeQueryParams(relation: string): Record<string, any> {
  return { include: relation };
}

/**
 * 페이지네이션 쿼리 파라미터 생성
 * @param page 페이지 번호
 * @param perPage 페이지당 항목 수
 * @returns 쿼리 파라미터 객체
 */
export function createPaginationQueryParams(page: number, perPage: number): Record<string, any> {
  return { page, perPage };
}

/**
 * 통합 API 테스트 유틸리티 클래스
 * 모든 테스트 기능을 하나의 객체에서 체이닝 방식으로 제공
 */
export class ApiTest {
  private _endpoint: string = '';
  private _id?: number;
  private _queryParams: Record<string, any> = {};
  private _body?: Record<string, any>;
  private _method: 'get' | 'post' | 'put' | 'delete' = 'get';
  private _expectedStatus: number = 200;
  private _agent: any = null;
  private _isAuthenticated: boolean = false;
  private _user?: User;

  /**
   * API 엔드포인트 설정
   * @param endpoint API 엔드포인트
   * @returns this 인스턴스
   */
  endpoint(endpoint: string): ApiTest {
    this._endpoint = endpoint;
    return this;
  }

  /**
   * 엔티티 ID 설정
   * @param id 엔티티 ID
   * @returns this 인스턴스
   */
  id(id: number): ApiTest {
    this._id = id;
    return this;
  }

  /**
   * HTTP 메서드 설정
   * @param method HTTP 메서드
   * @returns this 인스턴스
   */
  method(method: 'get' | 'post' | 'put' | 'delete'): ApiTest {
    this._method = method;
    return this;
  }

  /**
   * GET 메서드 설정
   * @returns this 인스턴스
   */
  get(): ApiTest {
    this._method = 'get';
    return this;
  }

  /**
   * POST 메서드 설정
   * @returns this 인스턴스
   */
  post(): ApiTest {
    this._method = 'post';
    return this;
  }

  /**
   * PUT 메서드 설정
   * @returns this 인스턴스
   */
  put(): ApiTest {
    this._method = 'put';
    return this;
  }

  /**
   * DELETE 메서드 설정
   * @returns this 인스턴스
   */
  delete(): ApiTest {
    this._method = 'delete';
    return this;
  }

  /**
   * 요청 본문 설정
   * @param body 요청 본문
   * @returns this 인스턴스
   */
  body(body: Record<string, any>): ApiTest {
    this._body = body;
    return this;
  }

  /**
   * 쿼리 파라미터 추가
   * @param key 파라미터 키
   * @param value 파라미터 값
   * @returns this 인스턴스
   */
  withParam(key: string, value: any): ApiTest {
    this._queryParams[key] = value;
    return this;
  }

  /**
   * 다수의 쿼리 파라미터 추가
   * @param params 쿼리 파라미터 객체
   * @returns this 인스턴스
   */
  withParams(params: Record<string, any>): ApiTest {
    this._queryParams = { ...this._queryParams, ...params };
    return this;
  }

  /**
   * 필터 쿼리 파라미터 추가
   * @param field 필터 필드
   * @param value 필터 값
   * @returns this 인스턴스
   */
  withFilter(field: string, value: any): ApiTest {
    return this.withParam(`filter[${field}]`, value);
  }

  /**
   * 관계 포함 쿼리 파라미터 추가
   * @param relation 포함할 관계 이름
   * @returns this 인스턴스
   */
  withInclude(relation: string): ApiTest {
    return this.withParam('include', relation);
  }

  /**
   * 페이지네이션 쿼리 파라미터 추가
   * @param page 페이지 번호
   * @param perPage 페이지당 항목 수
   * @returns this 인스턴스
   */
  withPagination(page: number, perPage: number): ApiTest {
    return this.withParams({ page, perPage });
  }

  /**
   * 기대하는 응답 상태 코드 설정
   * @param status HTTP 상태 코드
   * @returns this 인스턴스
   */
  expectStatus(status: number): ApiTest {
    this._expectedStatus = status;
    return this;
  }

  /**
   * 인증을 위한 사용자와 에이전트 설정
   * @param user 사용자 객체
   * @param agent 인증된 에이전트
   * @returns this 인스턴스
   */
  withAuth(user: User, agent: any): ApiTest {
    this._user = user;
    this._agent = agent;
    this._isAuthenticated = true;
    return this;
  }

  /**
   * 새로운 인증된 사용자 생성 및 설정
   * @param userData 사용자 데이터 (선택적)
   * @returns this 인스턴스
   */
  async withNewAuth(userData?: Partial<User>): Promise<ApiTest> {
    const { user, agent } = await createAuthenticatedUser(userData);
    return this.withAuth(user, agent);
  }

  /**
   * 요청 실행하여 응답 반환
   * @returns 응답 객체
   */
  async execute(): Promise<any> {
    const url = this._id !== undefined ? `${this._endpoint}/${this._id}` : this._endpoint;

    let req;

    // 인증된 요청 또는 일반 요청 생성
    if (this._isAuthenticated && this._agent) {
      switch (this._method) {
        case 'get':
          req = this._agent.get(url);
          break;
        case 'post':
          req = this._agent.post(url);
          break;
        case 'put':
          req = this._agent.put(url);
          break;
        case 'delete':
          req = this._agent.delete(url);
          break;
      }
    } else {
      // 인증되지 않은 일반 요청
      switch (this._method) {
        case 'get':
          req = request(app.getHttpServer()).get(url);
          break;
        case 'post':
          req = request(app.getHttpServer()).post(url);
          break;
        case 'put':
          req = request(app.getHttpServer()).put(url);
          break;
        case 'delete':
          req = request(app.getHttpServer()).delete(url);
          break;
      }
    }

    // 쿼리 파라미터 설정
    if (Object.keys(this._queryParams).length > 0) {
      req = req.query(this._queryParams);
    }

    // 요청 본문 설정
    if (this._body && (this._method === 'post' || this._method === 'put')) {
      req = req.send(this._body);
    }

    // 요청 실행
    return await req.expect(this._expectedStatus);
  }
}

/**
 * 통합 API 테스트 유틸리티 생성 함수
 * @returns 새로운 ApiTest 인스턴스
 */
export function api(): ApiTest {
  return new ApiTest();
}
