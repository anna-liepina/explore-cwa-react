import { query } from "../query";

export interface IFetchIncidentsPayload {
    latitude: number;
    longitude: number;
    range?: number;
    perPage?: number;
}

export interface IFetchIncidentsResponse {
    incidentSearchInRange: IIncident[];
}

interface IIncident {
    date: string;
    type: string;
    outcome: string;
}

export const fetchIncidents = async ({
    latitude,
    longitude,
    range = 1,
    perPage = 2500
}: IFetchIncidentsPayload) => {
    return query<IFetchIncidentsResponse>(`
{
    incidentSearchInRange(
        pos: {
            lat: ${latitude}
            lng: ${longitude}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        date
        type
        outcome
    }
}`)
    .then(({ data: { data: { incidentSearchInRange: incidents } } }) => {
        const cache: Record<string, { date: string, text: string }[]> = {};

        const defaultCategory = 'uncategorized';
        const defaultCategoryIncidents = [];

        for (const v of incidents) {
            if (!v.type) {
                defaultCategoryIncidents.push({ date: v.date, text: v.outcome });
                continue;
            }

            cache[v.type] ||= [];
            cache[v.type].push({ date: v.date, text: v.outcome })
        }

        const results = [];
        for (const incidentType in cache) {
            results.push({
                text: incidentType,
                content: cache[incidentType]
            })
        }

        results.push({
            text: defaultCategory,
            content: defaultCategoryIncidents
        })

        return results;
    })
};