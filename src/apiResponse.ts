export type ApiResponseType = {
    error: boolean;
    status_code: number;
    message: string;
    data: unknown;
}

export default class ApiResponse {
    public error: boolean = true;
    public status_code: number = 200
    public message: string = "failed";

    public getResponse<T>(data: T): ApiResponseType {
        return {
            error: this.error,
            status_code: this.status_code,
            message: this.message,
            data
        };
    }
}