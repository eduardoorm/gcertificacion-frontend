import { useEffect } from 'react';
import { APIData, APIError, APIStatus } from '../interfaces/response';

export const UnhandledError = {
    status: -400,
    statusText: 'Cannot handle error data.',
    data: []
}

export const useAPIData = <DataType>(response: APIData<DataType>, handlers: {
    onFulfilled?: (data: DataType) => void,
    onRejected?: (error: APIError) => void,
    onPending?: () => void
}) => {
    const {onFulfilled, onRejected, onPending} = handlers;

    useEffect(() => {
        if( response.status === APIStatus.REJECTED && onRejected ) {
            onRejected(response.error || UnhandledError)
        }
    }, [response.status, response.error, onRejected]);

    useEffect(() => {
        if( response.status === APIStatus.FULFILLED && onFulfilled ) {
            onFulfilled(response.data!);
        }
    }, [response.status, response.data, onFulfilled]);

    useEffect(() => {
        if( response.status === APIStatus.PENDING && onPending ) {
            onPending();
        }
    }, [response.status, onPending]);
}