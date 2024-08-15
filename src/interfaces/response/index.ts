export enum APIStatus {IDLE, PENDING, REJECTED, FULFILLED};

export interface APIError<DataType = any> {
    status: number|string,
    statusText: string,
    data?: DataType
};

export interface AxiosError {
    code: string,
    message: string
}

export interface APIData<DataType = any> {
    status: APIStatus,
    error?: APIError,
    data: DataType
};

export interface APIResponse<DataType = any> {
    status: number|number,
    statusText: string,
    data: DataType
}