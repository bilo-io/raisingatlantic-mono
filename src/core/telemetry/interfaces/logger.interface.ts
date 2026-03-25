export interface ILoggerService {
  log(message: string, context?: any): void;
  error(message: string, trace?: string, context?: any): void;
  warn(message: string, context?: any): void;
  debug?(message: string, context?: any): void;
  verbose?(message: string, context?: any): void;
}
