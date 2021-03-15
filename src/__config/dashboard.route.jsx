import axios from 'axios';
import React from 'react';
import HTMLInput from '../component/form/html-input';
import Search from '../component/form/interactive-search';
import ChartHandler from '../handler/chart-handler';
import MapHandler from '../handler/map-handler';
import TabHandler from '../handler/tab-handler';
import TableHandler from '../handler/table-handler';
import { validationEngine } from '../validation/engine';
import { composeConditionalRule } from '../validation/rules';



const composeOnFilter = (cache) => (props, state, onSuccess, onError) => {
    const pattern = state.pattern.toUpperCase();

    if (!cache || 0 === cache.length) {
        return axios
            .post(
                process.env.REACT_APP_GRAPHQL,
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
                cache = data.areaSearch.map(({ area, city }) => ({
                    value: area,
                    label: `${city} : ${area}`,
                }));

                const v = cache.filter(({ label }) => -1 !== label.indexOf(pattern));

                onSuccess(v);
            })
            .catch(onError);
    }

    const v = cache.filter(({ label }) => -1 !== label.indexOf(pattern))

    onSuccess(v);
};

const composeConfig = () => ({
    validate: validationEngine,
    config: [
        {
            className: 'accordion--flex',
            items: [
                {
                    c: Search,
                    attr: 'postcodes',
                    label: 'postcode area',
                    placeholder: 'type here to search',
                    value: [],
                    valueTransformer: (v) => !v ? null : v[0].value,
                    onFilter: composeOnFilter(),
                },
                {
                    c: HTMLInput,
                    attr: 'from',
                    label: 'from',
                    type: 'date',
                    validators: [
                        composeConditionalRule(
                            (v, config) => {
                                const [, { label: labelFrom }, { label: labelTo, value: to }] = config[0].items;

                                if (!to) {
                                    return true;
                                }

                                if (new Date(v).valueOf() > new Date(to).valueOf()) {
                                    return `"${labelFrom}" cannot be greater than "${labelTo}"`;
                                }

                                return true;
                            },
                            () => true
                        )
                    ]
                },
                {
                    c: HTMLInput,
                    attr: 'to',
                    label: 'to',
                    type: 'date',
                },
            ],
        },
    ],
    submitCTRL: {
        label: 'search',
        className: 'chart-handler_button--submit',
    },
});

const tabs = [

    {
        label: 'map',
        c: MapHandler,
        props: {
            form: composeConfig(),
            form: (() => {
                const c = composeConfig();

                c.config[0].items[1] = {
                    c: HTMLInput,
                    attr: 'range',
                    label: 'range',
                    type: 'range',
                    min: '1',
                    max: '5',
                    value: 1,
                };

                c.config[0].items.pop();
                c.isValid = true;

                return c;
            })(),
        },
    },
    {
        label: 'chart',
        c: ChartHandler,
        props: {
            form: composeConfig(),
        },
    },
    {
        label: 'transactions',
        c: TableHandler,
        props: {
            form: composeConfig(),
            columns: [
                {
                    label: 'date',
                    key: 'date',
                },
                {
                    label: 'price',
                    key: 'price',
                },
                {
                    label: 'address',
                    key: 'address',
                },
            ]
        },
    },
];

export default {
    path: ['/'],
    exact: true,
    component: (props) => React.createElement(TabHandler, { ...props, tabs }),
};
