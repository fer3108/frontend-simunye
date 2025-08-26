export interface ApiResponseEntity<T = void> {
  success: boolean;
  msg: string;
  data?: T;
  error?: object[];
}
