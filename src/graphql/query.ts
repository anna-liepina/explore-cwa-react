import axios from "axios";
import type { AxiosResponse } from "axios";

export const query = <T>(query: string) => {
    return axios.post<undefined, AxiosResponse<{ data: T }>>(
        process.env.REACT_APP_GRAPHQL!,
        { query }
    );
}
