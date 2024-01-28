import { query } from "../query";

export interface IFetchTimelinesPayload {
    postcodes: string[];
    from?: string;
    to?: string;
    page?: number;
    perPage?: number;
}

export interface IFetchTimelinesResponse {
    timelineSearch: ITimelineGraphQL[];
}

interface ITimelineGraphQL {
    postcode: string;
    date: string;
    avg: number; 
}

export type ITimelineRecord = [ number, number, string ];

export interface ITimelineSeries {
    name: string;
    data: ITimelineRecord[];
}

export const fetchTimelines = async ({ 
    postcodes,
    from = '',
    to = '',
    page = 1,
    perPage = 2500 
}: IFetchTimelinesPayload): Promise<ITimelineSeries[]> => {
    return query<IFetchTimelinesResponse>(`
{
    timelineSearch(
        postcodes: ["${postcodes.join('", "')}"]
        dateFrom: "${from}"
        dateTo: "${to}"
        page: ${page}
        perPage: ${perPage}
    ) {
        date
        avg
        postcode
    }
}`)
    .then(({ data: { data } }) => {
        const cache: Record<string, ITimelineRecord[]> = {};

        for (const v of data.timelineSearch) {
            cache[v.postcode] ||= [];

            const [year, month, day] = v.date.split('-');

            cache[v.postcode].push([
                Date.UTC(+year, +month, +day),
                v.avg,
                v.date,
            ]);
        }

        const coefficient = 1.5;
        const series = [];
        for (const name in cache) {
            series.push({
                name,
                data: cache[name].filter(([, pCurr], i, arr) => {
                    if (arr.length < 2) {
                        return true;
                    }

                    if (arr.length - 1 === i) {
                        return pCurr < arr[i - 1][1] * coefficient;
                    }

                    const [, pNext] = arr[i + 1];

                    if (pCurr > pNext) {
                        return pCurr < pNext * coefficient;
                    }

                    return pCurr * coefficient > pNext;
                }),
            })
        }

        return series;
    });
};
