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
        const resolveBadges = (property: IProperty) => [
            property.propertyType === 'D' && { text: 'detached', backgroundColor: '#0088FF' },
            property.propertyType === 'S' && { text: 'semi - detached', backgroundColor: '#5D005D' },
            property.propertyType === 'T' && { text: 'terraced', backgroundColor: '#303030' },
            property.propertyType === 'F' && { text: 'flat', backgroundColor: '#6D6D6D' },
            property.propertyForm === 'F' && { text: 'freehold', backgroundColor: '#008000' },
            property.propertyForm === 'L' && { text: 'leasehold', backgroundColor: '#A94442' },
        ].filter(Boolean);

        return propertySearchInRange
            .filter(({ transactions }) => transactions?.length)
            .map((property) => ({
                text: [property.street, property.paon, property.saon].filter(Boolean).join(', '),
                badges: resolveBadges(property),
            }));
    });
};
