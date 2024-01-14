import React, { useState, useEffect, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useQuery } from '../hooks/useQuery';

import type { IFormProps, IFormState, TFormFieldValueComposite } from '../component/form/form';
import Form from '../component/form/form';

import api from '../graphql/api';
import type { IFetchTimelinesPayload, ITimelineSeries } from '../graphql/requests/fetchTimelines';
import type { IQAProps } from '../utils/commonTypes';

export interface IChartPageProps extends IQAProps {
    form: IFormProps;
}

const resolvePayload = (state: IFormState): IFetchTimelinesPayload => {
    const { config } = state;
    const [ { value: postcodes }, { value: from }, { value: to } ] = config[0].items;

    return {
        postcodes: (postcodes as TFormFieldValueComposite[]).map(({ value }) => value) as string[],
        from: from as string,
        to: to as string,
    }
}

const ChartHandler: React.FC<IChartPageProps> = (props) => {
    const [series, fetchSeries] = useQuery<IFetchTimelinesPayload, ITimelineSeries[]>(
        (args) => api.fetchTimelines(args),
        { manual: true }
    );

    const [ payload, setPayload ] = useState<IFetchTimelinesPayload>();

    const onSearch = useCallback(async (props: IFormProps, state: IFormState): Promise<any> => {
        setPayload(resolvePayload(state));
    }, []);

    useEffect(() => {
        if (payload?.postcodes) {
            fetchSeries(payload);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload]);

    useEffect(() => {
        setPayload(resolvePayload(props.form));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    title: {
                        text: 'AVG. price statistics per postcode area'.toUpperCase(),
                    },
                    chart: {
                        type: 'spline',
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            month: '%b \'%y',
                            year: '%Y',
                        },
                        title: {
                            text: 'Date',
                            enabled: false,
                        },
                    },
                    yAxis: {
                        title: {
                            text: 'avg price (GBP)',
                            enabled: false,
                        },
                        min: 0,
                    },
                    series: series.data,
                    credits: {
                        enabled: false,
                    },
                    accessibility: {
                        enabled: false,
                    },
                }}
            />
            <Form {...props.form} onChange={onSearch} onSubmit={onSearch} />
        </>
    );
};

export default ChartHandler;
