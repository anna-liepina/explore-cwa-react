import { query } from "./query";

export const enum MarkerType {
    police = 'police',
    property = 'property'
}
export interface IMarker {
    lat: number,
    lng: number,
    type: MarkerType
}

export interface IPostcode {
    postcode: string;
}

export interface IPropertyTransaction {
    date: string;
    price: number;
}

export interface IProperty {
    paon: string;
    saon: string;
    street: string;
    postcode: IPostcode;
    transactions: IPropertyTransaction[]
}

export interface IIncident {
    date: string;
    type: string;
    outcome: string;
}

export interface IFetchMarkersResponse {
    markerSearchWithInRange: IMarker[];
}

export interface IFetchPropertiesResponse {
    propertySearchWithInRange: IProperty[];
}

export interface IFetchIncidentsResponse {
    incidentSearchWithInRange: IIncident[];
}

export interface IGeoSearchPayload {
    latitude: number,
    longitude: number,
    range?: number,
    perPage?: number
}

interface IArea {
    area: string;
    city: string;
}

interface IFetchAreasResponse {
    areaSearch: IArea[];
}

interface IAreaTreeNode {
    text: string;
    nodes?: IAreaTreeNode[];
}

const api = {
    fetchMarkers: async ({ latitude, longitude, range = 0, perPage = 2500 }: IGeoSearchPayload): Promise<IMarker[]> => {
        return query<IFetchMarkersResponse>(`
{
    markerSearchWithInRange(
        pos: {
            lat: ${latitude}
            lng: ${longitude}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        lat
        lng
        type
    }
}`)
        .then(({ data: { data } }) => data.markerSearchWithInRange);
    },
    fetchProperties: async ({ latitude, longitude, range = 0, perPage = 2500 }: IGeoSearchPayload) => {
        return query<IFetchPropertiesResponse>(`
{
    propertySearchWithInRange(
        pos: {
            lat: ${latitude}
            lng: ${longitude}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        paon
        saon
        street
        postcode {
            postcode
        }
        transactions {
            date
            price
        }
    }
}`)
        .then(({ data: { data: { propertySearchWithInRange: properties } } }) => {
            return properties.map((v) => ({
                text: [v.street, v.paon, v.saon].filter(Boolean).join(', '),
                content: v.transactions.map(({ date, price: text }) => ({ date, text }))
            }))
        });
    },
    fetchIncidents: async ({ latitude, longitude, range = 0, perPage = 2500 }: IGeoSearchPayload) => {
        return query<IFetchIncidentsResponse>(`
{
    incidentSearchWithInRange(
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
        .then(({ data: { data: { incidentSearchWithInRange: incidents } } }) => {
            const cache: Record <string, { date: string, text: string }[]> = {};

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
    },
    fetchAreas: async (): Promise<IAreaTreeNode[]> => {
        return query<IFetchAreasResponse>(`
{
    areaSearch(perPage: 5000) {
        area
        city
    }
}`)
        .then(({ data: { data } }) => {
            const cache: Record<string, IAreaTreeNode[]> = {};

            for (const { city, area: text } of data.areaSearch) {
                cache[city] ||= [];
                cache[city].push({ text });
            }

            const series: IAreaTreeNode[] = [];

            for (const text in cache) {
                series.push({
                    text,
                    nodes: cache[text],
                });
            }

            console.log('series', series);
            return series;
        })
    },
};

export default api;