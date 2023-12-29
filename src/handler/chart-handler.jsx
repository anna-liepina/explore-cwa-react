import React, { PureComponent } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import FormHandler from '../component/form/form-handler';
import { query } from '../graphql/query';

const onSubmit = (props, state, onSuccess, onError) => {
    const [{ value: postcodes }, { value: from }, { value: to }] = state.config[0].items;

    if (!postcodes || 0 === postcodes.length) {
        return;
    }

    return query(`
{
    timelineSearch(
        postcodes: ["${postcodes.map(({ value: v }) => v).join('", "')}"]
        ${from ? `from: "${from}"` : ''}
        ${to ? `to: "${to}"` : ''}
        perPage: 5000
    ) {
        date
        avg
        postcode
    }
}`)
        .then(({ data: { data } }) => {
            const obj = {};

            for (const v of data.timelineSearch) {
                if (!obj[v.postcode]) {
                    obj[v.postcode] = [];
                }

                const [year, month, day] = v.date.split('-');

                obj[v.postcode].push([
                    Date.UTC(year, month, day),
                    v.avg,
                    v.date,
                ])
            }

            const coefficient = 1.5;
            const series = [];
            for (const name in obj) {
                series.push({
                    name,
                    data: obj[name].filter(([, pCurr], i, arr) => {
                        if (arr.length < 2) {
                            return true;
                        }

                        if (arr.length - 1 === i) {
                            return pCurr < arr[i - 1][1] * coefficient;
                        }

                        const [, pNext] = arr[i + 1];

                        if (pCurr > pNext) {
                            return pCurr < pNext * coefficient;
                        }

                        return pCurr * coefficient > pNext;
                    }),
                })
            }

            onSuccess(series);
        })
        .catch(onError);
};

export default class ChartHandler extends PureComponent {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            data: undefined,
            errors: [],
        }

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);

        this.onSearch = this.onSearch.bind(this);
    }

    onSuccess(data) {
        this.setState({ data, errors: undefined, isLoading: false });
    }

    onError(errors) {
        this.setState({ data: undefined, errors, isLoading: false });
    }

    onSearch(props, state) {
        onSubmit(props, state, this.onSuccess, this.onError);
    }

    render() {
        const { data } = this.state;

        return <section className="chart-handler">
            <FormHandler
                {...this.props.form}
                onSubmit={this.onSearch}
            />
            {
                data &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                        title: {
                            text: 'price statistics',
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
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'price GBP',
                            },
                            min: 0,
                        },
                        series: data,
                    }}
                />
            }
        </section>;
    }
}
