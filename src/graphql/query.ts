import axios from "axios";
import type { AxiosResponse } from "axios";

export const query = <T>(query: string) => {
    //@ts-ignore
    console.log(JSON.stringify(query, '', 4 ));

    return axios.post<undefined, AxiosResponse<{ data: T }>>(
        process.env.REACT_APP_GRAPHQL!,
        { query }
    );
}
