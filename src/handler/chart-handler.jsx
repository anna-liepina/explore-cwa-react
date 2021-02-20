import React, { PureComponent } from 'react';
import Query from '../handler/query';
// import withModal from '../handler/with-modal';
// import TileHandler from '../handler/tile-handler';
// import TreeHandler from '../handler/tree-handler';
// import searchStatus from './trees/explore.status';
// import dashboardProps from './dashboard/dashboard.status';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import axios from 'axios';
// import { hasSequence } from 'byte-sequence-calculator';
// import FormHandler from '../../handler/form-handler';
// import TreeHandler from '../../handler/tree-handler';
// import Query from '../../handler/query';
// import createStatus from '../forms/create.status';
// import updateStatus from '../forms/update.status';
// import searchStatus from '../trees/explore.status';
import Search from '../component/form/interactive-search';
import Text from '../component/form/html-input';
import { validationEngine } from '../validation/engine';
import { graphql } from '../parameters';
import FormHandler from './form-handler';

// const TileHandlerWithModal = withModal(TileHandler);
const onSubmit = (props, state, onSuccess, onError) => {
    debugger;
    const [iPattern, iPostcodes] = state.config[0].items;
    const postcodes = iPostcodes && iPostcodes.value.map(({ value: v }) => v).join('", "');
    const pattern = iPattern.value

    return axios
        .post(
            graphql,
            {
                query: `
{
    timelineSearch(
        ${postcodes ? `postcodes: ["${postcodes}"]` : ''}
        ${pattern ? `pattern: "${pattern}"` : ''}
        perPage: 4000
    ) {
        date
        avg
        count
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
                    data: obj[name]
                        .filter(([, pCurr], i, arr) => {
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

const options = {
    title: {
        text: 'price statistics'
    },
    chart: {
        type: 'spline'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            month: '%b \'%y',
            year: '%Y'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'price GBP',
        },
        min: 0
    },
}

const config = {
    title: 'search',
    validate: validationEngine,
    isValid: true,
    config: [
        {
            items: [
                {
                    c: Text,
                    attr: 'pattern',
                    label: 'pattern',
                    placeholder: 'pattern',
                    validators: [
                        // composeRule(isRequired, 'pattern is mandatory'),
                    ],
                },
                {
                    c: Search,
                    attr: 'parent',
                    label: 'parent',
                    placeholder: 'parent status',
                    validators: [
                    ],
                    // maxValues: 1,
                    valueTransformer: (v) => !v ? null : v[0].value,
                    onFilter: (props, state, onSuccess, onError) => {
                        const { pattern } = state;

                        axios
                            .post(
                                graphql,
                                {
                                    query: `
{
    areaSearch(perPage: 5000) {
        area
        city
    }
}`
                                }
                            )
                            .then(({ data: { data } }) => {

                                const v = data.areaSearch.map(({ area, city }) => ({
                                    value: area,
                                    label: `${city} : ${area}`,
                                }));

                                onSuccess(v);
                            })
                            .catch(onError);
                    }
                },
            ],
        },
    ],
    // onSubmit: composeMutation('addStatus'),
    submitCTRL: {
        label: 'submit',
    },
}

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

        this.onSubmit = this.onSubmit.bind(this);
    }

    // componentDidMount() {
    //     this.props.onMount(this.props, this.state, this.onSuccess, this.onError);
    // }

    onSuccess(data) {
        this.setState({ data, errors: undefined, isLoading: false });

        // this.props.onSuccess && this.props.onSuccess(this.props, this.state);
    }

    onError(errors) {
        /** display like toasts on something like that */
        this.setState({ data: undefined, errors, isLoading: false });

        // this.props.onError && this.props.onError(this.props, this.state);
    }

    onSubmit(props, state) {
        onSubmit(props, state, this.onSuccess, this.onError);
    }

    render() {
        const { data } = this.state;

        return <>
            <FormHandler
                {...config}
                onSubmit={this.onSubmit}
            />

            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    ...options,
                    series: data,
                }}
            />
        </>
    }
}
// export default [
//     {
//         path: ['/'],
//         // exact: true,
//         component: (props) =>
//             <Query
//                 onMount={onMount}
//                 children={
//                     (_, state) =>
//                 }
//             />,
//     },
// ];
