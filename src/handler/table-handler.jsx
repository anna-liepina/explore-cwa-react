import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import FormHandler from './form-handler';

const onSubmit = (props, state, onSuccess, onError) => {
    const [, { value: from }, { value: to }] = state.config[0].items;
    // const [{ value: postcodes }, { value: from }, { value: to }] = state.config[0].items;

    // postcodes.map(({ value: v }) => v).join('", "');
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
