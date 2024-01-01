import React from 'react';
import HTMLInput from '../component/form/html-input';
import Search from '../component/form/search/interactive-search';
import ChartHandler from '../handler/chart-handler';
import MapHandler from '../page/map.overview.page';
import TabHandler from '../handler/tab-handler';
import TableHandler from '../handler/table-handler';
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
        component: MapHandler,
        props: {
            'data-cy': 'mapview',
            form: (() => {
                const c = composeConfig();

                c.className = 'map-handler--form';
                c.config[0].className = '';
                c.submitCTRL = {
                    label: 'search',
                    className: 'map-handler--form-button',
                };

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
                    c: HTMLInput,
                    attr: 'range',
                    label: 'range',
                    type: 'range',
                    step: .5,
                    min: .5,
                    max: 5,
                    value: .5,
                    className: 'map-handler__range-input',
                };

                c.config[0].items.pop();
                c.isValid = true;

                return c;
            })(),
        },
    },
    {
        label: 'chart',
        component: ChartHandler,
        props: {
            form: composeConfig(),
        },
    },
    {
        label: 'transactions',
        component: TableHandler,
        props: {
            form: (() => {
                const c = composeConfig();

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

                c.isValid = true;

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
];

const routeConfig = {
    path: ['/'],
    exact: true,
    component: (props) => React.createElement(TabHandler, { ...props, tabs }),
};

export default routeConfig;
