import { query } from "../query";

export interface IFetchPropertiesPayload {
    latitude: number;
    longitude: number;
    range?: number;
    perPage?: number;
}

export interface IFetchPropertiesResponse {
    propertySearchInRange: IProperty[];
}

interface ITransaction {
    date: string;
    price: number;
}

interface IProperty {
    paon: string;
    saon: string;
    street: string;
    propertyForm: string;
    propertyType: string;
    transactions?: ITransaction[];
}

export const fetchProperties = async ({
    latitude,
    longitude,
    range = 1,
    perPage = 2500
}: IFetchPropertiesPayload) => {
    return query<IFetchPropertiesResponse>(`
{
    propertySearchInRange(
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
        propertyForm
        propertyType
        transactions {
            date
            price
        }
    }
}`)
    .then(({ data: { data: { propertySearchInRange } } }) => {
        const resolveBadges = (property: IProperty) => {
            return [
                property.propertyType === 'D' && 'detached',
                property.propertyType === 'S' && 'semi - detached',
                property.propertyType === 'T' && 'terraced',
                property.propertyType === 'F' && 'flat',
                property.propertyType === 'O' && 'other',
                property.propertyForm === 'F' && 'freehold',
                property.propertyForm === 'L' && 'leasehold'
            ].filter(Boolean).map((text) => ({ text }))
        }
        return propertySearchInRange
            .filter(({ transactions }) => transactions?.length)
            .map((v) => ({
                text: [v.street, v.paon, v.saon].filter(Boolean).join(', '),
                badges: resolveBadges(v),
            }));
    });
};
