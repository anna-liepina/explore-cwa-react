import React from 'react';

import TabHandler from '../component/tabmanager/tab.manager';

import TablePage from '../page/table.page';
import MapPage from '../page/map.overview.page';
import ChartPage from '../page/chart.page';

import HTMLInput from '../component/form/html-input';
import Search from '../component/form/search/interactive-search';

import { validationEngine } from '../utils/validation/engine';
import { composeConditionalRule } from '../utils/validation/rules';

import { query } from '../graphql/query';

import api from '../graphql/api';

const composeOnFilter = (cache) => (props, state, onSuccess, onError) => {
    const pattern = state.pattern.toUpperCase();

    if (!cache || !cache.length) {
        return query(`
{
    areaSearch(perPage: 5000) {
        area
        city
    }
}`)
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
                    component: Search,
                    attr: 'postcodes',
                    label: 'postcode area',
                    placeholder: 'type here to search',
                    value: [],
                    valueTransformer: (v) => !v ? null : v[0].value,
                    onFilter: composeOnFilter(),
                },
                {
                    component: HTMLInput,
                    attr: 'from',
                    label: 'from date',
                    type: 'date',
                    value: ((d) => d.toJSON().split('T')[0])(new Date(0)),
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
                    component: HTMLInput,
                    attr: 'to',
                    label: 'to date',
                    type: 'date',
                    value: ((d) => d.toJSON().split('T')[0])(new Date()),
                },
            ],
        },
    ],
});

const tabs = [
    {
        label: 'map',
        component: MapPage,
        props: {
            'data-cy': 'mapview',
            form: (() => {
                const c = composeConfig();

                c.className = 'map-handler--form';
                c.submitCTRL = {
                    label: 'search',
                    className: 'map-handler--form-button',
                };

                c.config[0].className = '';
                c.config[0].items[0] = {
                    ...c.config[0].items[0],
                    maxValues: 1,
                    onFilter: (props, state, onSuccess, onError) => {
                        const pattern = state.pattern.toUpperCase();

                        if (pattern.length < 2) {
                            return;
                        }

                        return api
                            .fetchPostcodes({ pattern })
                            .then(onSuccess)
                            .catch(onError);
                    }
                }

                c.config[0].items[1] = {
                    component: HTMLInput,
                    attr: 'range',
                    label: 'range',
                    type: 'range',
                    step: .5,
                    min: .5,
                    max: 2.5,
                    value: .5,
                    className: 'map-handler__range-input',
                };

                c.config[0].items.pop();

                return c;
            })(),
        },
    },
    {
        label: 'transactions',
        component: TablePage,
        props: {
            'data-cy': 'transactionsview',
            form: (() => {
                const c = composeConfig();

                c.config[0].items[0] = {
                    component: HTMLInput,
                    attr: 'postcodePattern',
                    label: 'postcode pattern',
                    placeholder: 'type here to search',
                    value: '',
                }

                return c;
            })(),
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
    {
        label: 'chart',
        component: ChartPage,
        props: {
            'data-cy': 'chartview',
            form: (() => {
                const c = composeConfig();

                c.config[0].items[0] = {
                    component: Search,
                    attr: 'postcodes',
                    label: 'postcode area',
                    placeholder: 'type here to search',
                    value: [].map(( value ) => ({ value, label: value })),
                    valueTransformer: (v) => !v ? null : v[0].value,
                    onFilter: composeOnFilter(),
                };

                return c;
            })(),
        },
    },
];

const routeConfig = {
    path: ['/'],
    exact: true,
    component: (props) => React.createElement(TabHandler, { ...props, tabs }),
};

export default routeConfig;
