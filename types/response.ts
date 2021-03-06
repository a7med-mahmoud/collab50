export interface SuccessResponse<D, M = string> {
  data: D;
  message?: M;
}

export interface ErrorResponse {
  message: string;
}

type Response<D, M = string | undefined> =
  | SuccessResponse<D, M>
  | ErrorResponse;

export default Response;
