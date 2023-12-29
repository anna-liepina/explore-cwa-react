import { useState, useEffect, useCallback } from 'react';

export interface IQueryState<TData = any, TErrors = any> {
  isLoading?: boolean;
  data?: TData;
  errors?: TErrors;
}

export interface IQueryOptions {
  manual?: boolean;
}

export const useQuery = <TArgs = any, TData = any, TErrors = any>(
    fetch: (args: TArgs) => Promise<TData>,
    options?: IQueryOptions
): [IQueryState<TData, TErrors>, (args?: TArgs) => void] => {
    const [state, setState] = useState<IQueryState<TData, TErrors>>({});

    const handleFetch = useCallback(
        async (args?: TArgs) => {
            try {
                setState({ isLoading: true });
                const data = await fetch(args || {} as TArgs)
                setState({ data, isLoading: false });
            } catch (error) {
                setState({ errors: error as TErrors, isLoading: false });
            }
        },
        [fetch]
    );

    useEffect(() => {
        if (!options?.manual) {
            handleFetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [state, handleFetch];
};
