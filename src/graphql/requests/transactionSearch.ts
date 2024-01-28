import { query } from "../query";

export interface IFetchTransactionsPayload {
    postcode: string;
    from?: string;
    to?: string;
    page?: number;
    perPage?: number;
}

export interface IFetchTransactionsResponse {
    transactionSearch: IPropertyTransactionGraphqQL[];
}

interface IPropertyTransactionGraphqQL {
    date: string;
    price: number;
    property: IPropertyGraphQL;
}

interface IPropertyGraphQL {
    postcode: IPostcode;
    street: string;
    paon: string;
    saon: string;
}

interface IPostcode {
    postcode: string;
}

export interface ITransaction {
    date: string;
    price: number;
    address?: string;
}

export const fetchTransactions = async ({ 
    postcode,
    from = '',
    to = '',
    page = 1,
    perPage = 100
}: IFetchTransactionsPayload): Promise<ITransaction[]> => {
    return query<IFetchTransactionsResponse>(`
{
    transactionSearch(
        postcodePattern: "${postcode}"
        dateFrom: "${from}"
        dateTo: "${to}"
        page: ${page}
        perPage: ${perPage}
    ) {
        price
        date
        property {
            postcode {
                postcode
            }
            street
            saon
            paon 
        }
    }
}`)
    .then(({ data: { data } }) => {
        return data.transactionSearch.map((item) => ({
            price: item.price,
            date: item.date,
            address: [
                item.property?.postcode?.postcode,
                item.property?.street,
                item.property?.paon,
                item.property?.saon,
            ].filter(Boolean).join(', ')
        }));
    })
};
