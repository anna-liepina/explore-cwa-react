import React, { PureComponent } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

import FormHandler from './form-handler';
import HTMLInput from '../component/form/html-input';
import Search from '../component/form/interactive-search';
import { validationEngine } from '../validation/engine';
import { composeRule, isLengthBetween } from '../validation/rules';

const onSubmit = (props, state, onSuccess, onError) => {
    const [iPostcodes] = state.config[0].items;

    if (!iPostcodes.value || 0 === iPostcodes.value.length) {
        return;
    }

    const postcodes = iPostcodes.value.map(({ value: v }) => v).join('", "');

    return axios
        .post(
            process.env.REACT_APP_GRAPHQL,
            {
                query: `
{
    timelineSearch(
        ${postcodes ? `postcodes: ["${postcodes}"]` : ''}
        perPage: 4000
    ) {
        date
        avg
        postcode
    }
}
`
            }
        )
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

// const composeOnFilter = (cache) => (props, state, onSuccess, onError) => {
//     const pattern = state.pattern.toUpperCase();

//     if (!cache || 0 === cache.length) {
//         return axios
//             .post(
//                 process.env.REACT_APP_GRAPHQL,
//                 {
//                     query: `
// {
//     areaSearch(perPage: 5000) {
//         area
//         city
//     }
// }`
//                 }
//             )
//             .then(({ data: { data } }) => {

//                 cache = data.areaSearch.map(({ area, city }) => ({
//                     value: area,
//                     label: `${city} : ${area}`,
//                 }));

//                 const v = cache.filter(({ label }) => -1 !== label.indexOf(pattern))

//                 onSuccess(v);
//             })
//             .catch(onError);
//     }

//     const v = cache.filter(({ label }) => -1 !== label.indexOf(pattern))

//     onSuccess(v);
// }

// const config = {
//     title: 'search criteria',
//     validate: validationEngine,
//     config: [
//         {
//             items: [
//                 {
//                     c: Search,
//                     attr: 'postcodes',
//                     label: 'select postcode area',
//                     placeholder: 'type here to search',
//                     value: [],
//                     valueTransformer: (v) => !v ? null : v[0].value,
//                     onFilter: composeOnFilter(),
//                 },
//                 {
//                     c: HTMLInput,
//                     attr: 'from',
//                     label: 'from',
//                     type: 'date',
//                 },
//                 {
//                     c: HTMLInput,
//                     attr: 'to',
//                     label: 'to',
//                     type: 'date',
//                 },
//             ],
//         },
//     ],
//     submitCTRL: {
//         label: 'search',
//         className: 'chart-handler_button--submit',
//     },
// };

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
