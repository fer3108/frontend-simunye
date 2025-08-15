export interface ApiResponseEntity<T = void> {
  status: "success" | "error" | "fail";
  message: string;
  data?: T;
}
