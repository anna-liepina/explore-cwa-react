import { query } from "../query";

export interface IFetchPostcodePayload {
    pattern?: string;
    page?: number;
    perPage?: number;
}

export interface IFetchPostcodesResponse {
    postcodeSearch: IPostcodeGraphqQL[];
}

interface IPostcodeGraphqQL {
    lat: number;
    lng: number;
    postcode: string;
}

export interface IPostcodeAsValue {
    latitude: number;
    longitude: number;
    value: string;
    label: string;
}

export const fetchPostcodes = async ({
    pattern,
    page = 1,
    perPage = 7500
}: IFetchPostcodePayload): Promise<IPostcodeAsValue[]> => {
    return query<IFetchPostcodesResponse>(`
{
    postcodeSearch(
        pattern: "${pattern}"
        page: ${page}
        perPage: ${perPage}
    ) {
        postcode
        lat
        lng
    }
}`)
    .then(({ data: { data } }) => {
        return data
            .postcodeSearch
            .map(({ postcode, lat, lng }) => ({
                label: postcode,
                value: postcode,
                latitude: lat,
                longitude: lng
            }));
    });
}
