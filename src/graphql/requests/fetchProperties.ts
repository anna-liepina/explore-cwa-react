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

interface IPostcode {
    postcode: string;
}

interface ITransaction {
    date: string;
    price: number;
}

export interface IProperty {
    paon: string;
    saon: string;
    street: string;
    postcode: IPostcode;
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
        postcode {
            postcode
        }
        transactions {
            date
            price
        }
    }
}`)
    .then(({ data: { data: { propertySearchInRange } } }) => {
        return propertySearchInRange
            .filter(({ transactions }) => transactions?.length)
            .map((v) => ({
                text: [v.street, v.paon, v.saon].filter(Boolean).join(', '),
                content: v.transactions!.map(({ date, price: text }) => ({ date, text }))
            }));
    });
};
