import { AxiosError } from "axios";
import { APIError } from "../interfaces/response";
import { EmpresaCliente } from "../interfaces/entities";
import { InternalError } from "./InternalError";

interface ValidationErrors {
    errorMessage: string
    field_errors: Record<string, string>
}

export const getExceptionPayload = (ex: unknown): APIError => {
    
    if( typeof ex !== 'object' || !ex ){
        return InternalError;
    }

    const axiosException = ex as AxiosError<ValidationErrors>
    
    if (axiosException.response){
        const apiError = axiosException.response as APIError;
        if( apiError.hasOwnProperty('statusText') && typeof apiError.statusText === 'string'
            && ex.hasOwnProperty('code') && (typeof axiosException.code === 'number' || typeof axiosException.code === 'string') ) {
            return {
                statusText: apiError.data.statusText,
                status: axiosException.code,
                data: apiError.data.data
            };
        }
    }
    else {
        if( ex.hasOwnProperty('message') && typeof axiosException.message === 'string'
            && ex.hasOwnProperty('code') && typeof axiosException.code === 'string' ) {
            const data_: EmpresaCliente[] = [];
            return {
                statusText: axiosException.message,
                status: axiosException.code,
                data: data_
            };
        }
    }

    return InternalError;
}
