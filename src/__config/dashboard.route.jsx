import React from 'react';
import ChartHandler from '../handler/chart-handler';
import TabHandler from '../handler/tab-handler';
import TableHandler from '../handler/table-handler';

import axios from 'axios';
import Search from '../component/form/interactive-search';
import { validationEngine } from '../validation/engine';
import { composeConditionalRule, composeRule, isLengthBetween, isMatchRegex, isRequired } from '../validation/rules';
import HTMLInput from '../component/form/html-input';

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

                const v = cache.filter(({ label }) => -1 !== label.indexOf(pattern))

                onSuccess(v);
            })
            .catch((e) => { debugger; onError(e); });
    }

    const v = cache.filter(({ label }) => -1 !== label.indexOf(pattern))

    onSuccess(v);
};

const composeConfig = () => ({
    title: 'search criteria',
    validate: validationEngine,
    config: [
        {
            className: 'accordion--flex',
            items: [
                {
                    c: Search,
                    attr: 'postcodes',
                    label: 'select postcode area',
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
                                const { value: to } = config[0].items[2];

                                if (!to) {
                                    return true;
                                }

                                if (new Date(v).valueOf() > new Date(to).valueOf()) {
                                    return '"from" cannot be greater than "to"';
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
