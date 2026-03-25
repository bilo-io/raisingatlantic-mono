export interface IErrorReportingService {
  report(error: Error | string, context?: any): void;
  reportException(exception: any, context?: any): void;
}
