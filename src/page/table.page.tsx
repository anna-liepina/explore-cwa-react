import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import type { IFetchTransactionsPayload, IPropertyTransaction } from '../graphql/api';
import api from '../graphql/api';
import { useQuery } from '../hooks/useQuery';
import { usePagination } from '../hooks/usePagination';
import type { IFormProps, IFormState } from '../component/form/form';
import Form from '../component/form/form';
import type { IQAProps } from '../utils/commonTypes';
import Button from '../component/button/button';

export interface ITableColumnConfig {
    key: string;
    label: string;
}

export interface ITablePageProps extends IQAProps {
    className?: string;
    perPage?: number;
    columns: ITableColumnConfig[];
    form: IFormProps;
}

const resolvePayload = (state: IFormState): IFetchTransactionsPayload => {
    const { config } = state;
    const [ { value: postcode }, { value: from }, { value: to } ] = config[0].items;

    return {
        postcode: postcode as string,
        from: from as string,
        to: to as string,
    }
}

export interface IPaginationProps extends IQAProps {
  currentPage: number;
  totalPages?: number;
  nextPage: () => void;
  prevPage: () => void;
}

const Pagination: React.FC<IPaginationProps> = ({
    'data-cy': cy = '',
    currentPage,
    totalPages,
    nextPage,
    prevPage
}) => {
  return (
    <div className="pagination">
        <Button
            data-cy={`${cy}-prevpage`}
            label="Previous"
            onClick={prevPage}
            disabled={currentPage === 1}
        />
        <span>{`Page ${currentPage} of ${totalPages || 'unknown'}`}</span>
        <Button
            data-cy={`${cy}-nextpage`}
            label="Next"
            onClick={nextPage}
            disabled={undefined !== totalPages && currentPage === totalPages}
        />
    </div>
  );
};

const TableHandler: React.FC<ITablePageProps> = (props) => {
    const { 
        "data-cy": cy = '',
        className,
        columns,
        perPage = 250,
    } = props;

    const { currentPage, setCurrentPage, prevPage, nextPage } = usePagination();
    const [transactions, fetchTransactions] = useQuery<IFetchTransactionsPayload, IPropertyTransaction[]>(
        (args) => api.fetchTransactions(args),
        { manual: true }
    );

    const [ payload, setPayload ] = useState({})
    const totalPages = transactions.data?.length! < perPage ? currentPage : undefined;

    useEffect(() => {
        fetchTransactions({ ...payload, page: currentPage, perPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentPage, payload ])

    const onSearch = useCallback(async (props: IFormProps, state: IFormState): Promise<any> => {
        setCurrentPage(1);
        setPayload(resolvePayload(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Form {...props.form} data-cy={cy} onChange={onSearch} onSubmit={onSearch} />
            {
                <Pagination
                    data-cy={`${cy}-top-pagination`}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    nextPage={nextPage}
                    prevPage={prevPage}
                />
            }
            {
                <div className={classNames(`table-container`, className)}>
                    <div className="table-stats">
                    {
                        Array.isArray(transactions.data)
                        && !!transactions.data.length
                        && `total records: ${transactions.data.length}`
                    }
                    </div>
                    <div className="table-header">
                    {
                        columns.map(({ label }, i) => (<div key={i} className="table-cell">{label}</div>))
                    }
                    </div>
                    {
                        Array.isArray(transactions.data)
                        && (
                            <div className="table-content">
                            {
                                transactions.data.map((row, i) => (
                                    <div key={i} className="table-row">
                                    {
                                        columns.map(({ key }, j) => (
                                            <div key={j} className="table-cell">
                                                {row[key as keyof IPropertyTransaction]}
                                            </div>
                                        ))
                                    }
                                    </div>
                                ))
                            }
                            </div>
                        )
                    }
                </div>
            }
            {
                // Array.isArray(transactions.data)
                // && !!transactions.data.length
                // && <Pagination
                //     data-cy={`${cy}-bottom-pagination`}
                //     currentPage={currentPage}
                //     totalPages={totalPages}
                //     nextPage={nextPage}
                //     prevPage={prevPage}
                // />
            }
        </>
    );
};

export default TableHandler;
