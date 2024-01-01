import axios from "axios";
import axiosRetry from 'axios-retry';
import type { AxiosResponse } from "axios";


axiosRetry(axios, {
    shouldResetTimeout: true,
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000,
    retryCondition: (error) => axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
});

export const query = <T>(query: string) => {
    return axios.post<undefined, AxiosResponse<{ data: T }>>(
        process.env.REACT_APP_GRAPHQL!,
        { query }
    );
}
