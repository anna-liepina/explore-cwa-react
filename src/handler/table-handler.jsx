import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import FormHandler from './form-handler';
import Search from '../component/form/interactive-search';
import { validationEngine } from '../validation/engine';
import { composeConditionalRule, composeRule, isLengthBetween, isMatchRegex, isRequired } from '../validation/rules';
import HTMLInput from '../component/form/html-input';

const onSubmit = (props, state, onSuccess, onError) => {
    const [{ value: postcodes }, { value: from }, { value: to }] = state.config[0].items;

    // const postcodes = postcodes.map(({ value: v }) => v).join('", "');
    return axios
        .post(
            process.env.REACT_APP_GRAPHQL,
            {
                query: `
{
    transactionSearch(
        ${from ? `from: "${from}"` : ''}
        ${to ? `to: "${to}"` : ''}
        page: 1
        perPage: 100)
    {
        id
        price
        date
    }
}
`
            }
        )
        .then(({ data: { data } }) => {
            onSuccess(data.transactionSearch);
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
//             .catch((e) => { debugger; onError(e); });
//     }

//     const v = cache.filter(({ label }) => -1 !== label.indexOf(pattern))

//     onSuccess(v);
// };

// const config = {
//     title: 'search criteria',
//     validate: validationEngine,
//     config: [
//         {
//             className: 'accordion--flex',
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
//                     validators: [
//                         composeConditionalRule(
//                             (v, config) => {
//                                 const { value: to } = config[0].items[2];

//                                 if (!to) {
//                                     return true;
//                                 }

//                                 if (new Date(v).valueOf() > new Date(to).valueOf()) {
//                                     return '"from" cannot be greater than "to"';
//                                 }

//                                 return true;
//                             },
//                             () => true
//                         )
//                     ]
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

export default class TableHandler extends PureComponent {
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
        const { columns } = this.props;
        const { data } = this.state;

        return <>
            <FormHandler
                {...this.props.form}
                onSubmit={this.onSearch}
            />
            <table className="table">
                <thead className="table-row table-row-header">
                    {columns.map(({ label }, i) => <th key={i} className="table-row-cell">{label}</th>)}
                </thead>
                {
                    data
                    && <tbody className="table-content">
                        {
                            data.map(
                                (row, i) =>
                                    <tr key={i} className="table-row">
                                        {columns.map(({ key }, j) => <td key={j} className="table-row-cell">{row[key]}</td>)}
                                    </tr>
                            )
                        }
                    </tbody>
                }
            </table>
        </>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
        data: [],
        columns: [],
    }
}
