import { query } from "../query";

export interface IFetchAreasPayload {
    pattern?: string;
    page?: number;
    perPage?: number;
}

export interface IFetchAreasResponse {
    areaSearch: IAreaGraphQL[];
}

interface IAreaGraphQL {
    area: string;
    city: string;
}

interface IArea {
    text: string;
    nodes?: IArea[];
}

export const fetchAreas = async ({
    pattern = '',
    page = 1,
    perPage = 7500.
}: IFetchAreasPayload): Promise<IArea[]> => {
    return query<IFetchAreasResponse>(`
{
    areaSearch(
        postcodePattern: "${pattern}"
        page: ${page}
        perPage: ${perPage}
    ){
        area
        city
    }
}`)
    .then(({ data: { data } }) => {
        const cache: Record<string, IArea[]> = {};

        for (const { city, area: text } of data.areaSearch) {
            cache[city] ||= [];
            cache[city].push({ text });
        }

        const series: IArea[] = [];

        for (const text in cache) {
            series.push({
                text,
                nodes: cache[text],
            });
        }

        return series;
    });
};