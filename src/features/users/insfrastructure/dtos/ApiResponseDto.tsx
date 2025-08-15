export interface ApiResponseDto<T = void> {
  status: string;
  message: string;
  data?: T;
}
