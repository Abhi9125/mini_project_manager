export interface IUserPayload {
  id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}
