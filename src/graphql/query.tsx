import axios from "axios";

export const query = (query: string) =>
    axios.post(process.env.REACT_APP_GRAPHQL!, { query });
