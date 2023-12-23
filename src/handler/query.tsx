import React, { useState, useEffect } from 'react';

export interface IQueryState {
    isLoading: boolean;
    data?: any;
    errors?: any;
}

export interface IQueryProps {
    'data-cy'?: string;
    fetchTrigger?: number
    fetch: (
        props: IQueryProps,
        state: IQueryState,
        onSuccess: (data: any) => void,
        onError: (errors: any) => void
    ) => void;
    children: (props?: IQueryProps, state?: IQueryState) => React.ReactNode;
}

const Query: React.FC<IQueryProps> = (props) => {
    const { 'data-cy': cy = '', fetchTrigger, fetch, children } = props;
    const [state, setState] = useState<IQueryState>({ isLoading: true });

    useEffect(() => {
        setState({ isLoading: true })

        fetch(
            props,
            state,
            (data: any) => setState({ data, isLoading: false }),
            (errors: any) => setState({ errors, isLoading: false })
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchTrigger]);

    if (state.isLoading) {
        return <div data-cy={`${cy}--query`} className="query--loading">
            <div />
            <div />
        </div>;
    }

    return children(props, state);
};

export default Query;
