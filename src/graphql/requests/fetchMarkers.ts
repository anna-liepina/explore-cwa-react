import { query } from "../query";

export interface IFetchMarkersPayload {
    latitude: number;
    longitude: number;
    range?: number;
    perPage?: number;
}

export interface IFetchMarkersResponse {
    markerSearchWithInRange: IMarker[];
}

export const enum MarkerType {
    police = 'police',
    property = 'property'
}

export interface IMarker {
    lat: number;
    lng: number;
    type: MarkerType;
}

export const fetchMarkers = async ({
    latitude,
    longitude,
    range = 1,
    perPage = 2500
}: IFetchMarkersPayload): Promise<IMarker[]> => {
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
};
