import { Logger, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * TypeORM 로그를 파일로 저장하는 커스텀 로거
 */
export class FileLogger implements Logger {
  private logFolder: string;
  private queryLogPath: string;
  private errorLogPath: string;
  private schemaLogPath: string;

  constructor(options?: { logFolder?: string }) {
    // 로그 폴더 기본값은 프로젝트 루트의 logs 디렉토리
    this.logFolder = options?.logFolder || path.join(process.cwd(), 'logs');

    // 로그 디렉토리가 없으면 생성
    if (!fs.existsSync(this.logFolder)) {
      fs.mkdirSync(this.logFolder, { recursive: true });
    }

    // 로그 파일 경로 설정
    this.queryLogPath = path.join(this.logFolder, 'typeorm-query.log');
    this.errorLogPath = path.join(this.logFolder, 'typeorm-error.log');
    this.schemaLogPath = path.join(this.logFolder, 'typeorm-schema.log');
  }

  /**
   * 로그 파일에 메시지 추가
   * @param filePath 로그 파일 경로
   * @param message 로그 메시지
   */
  private appendToFile(filePath: string, message: string): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(filePath, formattedMessage, { encoding: 'utf8' });
  }

  /**
   * 쿼리 로그 저장
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const formattedParameters = parameters ? ` -- 파라미터: ${JSON.stringify(parameters)}` : '';
    this.appendToFile(this.queryLogPath, `쿼리: ${query}${formattedParameters}`);
  }

  /**
   * 쿼리 에러 로그 저장
   */
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const formattedParameters = parameters ? ` -- 파라미터: ${JSON.stringify(parameters)}` : '';
    this.appendToFile(
      this.errorLogPath,
      `쿼리 에러: ${error} -- 쿼리: ${query}${formattedParameters}`,
    );
  }

  /**
   * 쿼리 실행 시간 저장
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const formattedParameters = parameters ? ` -- 파라미터: ${JSON.stringify(parameters)}` : '';
    this.appendToFile(this.queryLogPath, `느린 쿼리 (${time}ms): ${query}${formattedParameters}`);
  }

  /**
   * 스키마 빌드 로그 저장
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    this.appendToFile(this.schemaLogPath, `스키마 빌드: ${message}`);
  }

  /**
   * 마이그레이션 로그 저장
   */
  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.appendToFile(this.schemaLogPath, `마이그레이션: ${message}`);
  }

  /**
   * 일반 로그 저장
   */
  log(level: 'log' | 'info' | 'warn', message: string, queryRunner?: QueryRunner): void {
    this.appendToFile(this.queryLogPath, `${level.toUpperCase()}: ${message}`);
  }
}
