import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getResponseFields } from '../decorators/response.decorator';

@Injectable()
export class ResponseFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // 배열 응답 처리
        if (Array.isArray(data)) {
          return data.map(item => this.filterEntity(item, new Set()));
        }

        // 단일 객체 응답 처리
        return this.filterEntity(data, new Set());
      }),
    );
  }

  private filterEntity(entity: any, processedEntities: Set<any>, depth: number = 0): any {
    // undefined나 null인 경우 그대로 반환
    if (!entity) {
      return entity;
    }

    // 일반 객체가 아닌 경우 (예: 문자열, 숫자 등) 그대로 반환
    if (typeof entity !== 'object' || entity instanceof Date) {
      return entity;
    }

    // 이미 처리된 엔티티인 경우 ID만 포함하여 순환 참조 방지
    if (processedEntities.has(entity) || depth > 1) {
      return entity.id ? { id: entity.id } : entity;
    }

    // 현재 엔티티를 처리된 목록에 추가
    processedEntities.add(entity);

    const constructor = entity.constructor;
    const responseFields = getResponseFields(constructor);

    // Response 데코레이터가 없는 경우 원본 반환
    if (!responseFields || responseFields.length === 0) {
      return entity;
    }

    // Response 데코레이터가 적용된 필드만 포함한 객체 생성
    const filteredEntity = {};

    // id는 항상 포함 (일반적으로 필요함)
    if ('id' in entity) {
      filteredEntity['id'] = entity.id;
    }

    // Response 데코레이터가 적용된 필드 추가
    responseFields.forEach(field => {
      if (field in entity) {
        if (Array.isArray(entity[field])) {
          // 배열인 경우 (예: posts) 각 항목에 대해 재귀적으로 처리 (깊이 증가)
          filteredEntity[field] = entity[field].map(item =>
            this.filterEntity(item, new Set(processedEntities), depth + 1),
          );
        } else if (entity[field] !== null && typeof entity[field] === 'object') {
          // 객체인 경우 (예: author) 재귀적으로 처리 (깊이 증가)
          filteredEntity[field] = this.filterEntity(
            entity[field],
            new Set(processedEntities),
            depth + 1,
          );
        } else {
          // 기본 타입인 경우 그대로 포함
          filteredEntity[field] = entity[field];
        }
      }
    });

    return filteredEntity;
  }
}
