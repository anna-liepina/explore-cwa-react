import React, { useEffect } from "react";
import { useQuery, IQueryState } from "../hooks/useQuery";
import LoadingAnimation from "../component/loadingAnimation";

export interface IQueryProps {
    'data-cy'?: string;
    fetch: (args: any) => Promise<any>;
    fetchArgs?: any;
    fetchTrigger?: number;
    children: (props: IQueryProps, state: IQueryState) => React.ReactElement<any, any> | null;
}

const Query: React.FC<IQueryProps> = (props) => {
    const { 'data-cy': cy = '', fetch, fetchArgs, fetchTrigger, children } = props;

    const [queryState, handleFetch] = useQuery<any, any, IQueryProps>(
        (args) => fetch(args),
        { manual: true }
    );

    useEffect(() => {
        handleFetch(fetchArgs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchTrigger]);

    if (queryState.isLoading) {
        return <LoadingAnimation data-cy={cy} />;
    }

    return children(props, queryState);
};

export default Query;