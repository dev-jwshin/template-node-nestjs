import 'reflect-metadata';

/**
 * Response 데코레이터를 위한 메타데이터 키
 */
export const RESPONSE_METADATA_KEY = 'response:field';

/**
 * 응답에 포함될 필드를 표시하는 데코레이터
 * 이 데코레이터가 적용된 프로퍼티만 API 응답에 포함됩니다.
 */
export function Response() {
  return (target: any, propertyKey: string) => {
    // 클래스에 메타데이터가 있는지 확인
    const existingFields: string[] =
      Reflect.getMetadata(RESPONSE_METADATA_KEY, target.constructor) || [];

    // 새 필드를 추가
    Reflect.defineMetadata(
      RESPONSE_METADATA_KEY,
      [...existingFields, propertyKey],
      target.constructor,
    );
  };
}

/**
 * 클래스에서 @Response 데코레이터가 적용된 프로퍼티 목록을 가져옵니다.
 * @param target 대상 클래스
 */
export function getResponseFields(target: any): string[] {
  return Reflect.getMetadata(RESPONSE_METADATA_KEY, target) || [];
}
