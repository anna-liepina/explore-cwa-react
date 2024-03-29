import { query } from "../query";

export interface IFetchMarkersPayload {
    latitude: number;
    longitude: number;
    range?: number;
    perPage?: number;
}

export interface IFetchMarkersResponse {
    markerSearchInRange: IMarker[];
}

export const enum MarkerType {
    police = 'police',
    property = 'property'
}

export interface IMarker {
    lat: number;
    lng: number;
    type: MarkerType;
    label: string;
}

export const fetchMarkers = async ({
    latitude,
    longitude,
    range = 1,
    perPage = 2500
}: IFetchMarkersPayload): Promise<IMarker[]> => {
    return query<IFetchMarkersResponse>(`
{
    markerSearchInRange(
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
        label
    }
}`)
    .then(({ data: { data } }) => data.markerSearchInRange);
};
