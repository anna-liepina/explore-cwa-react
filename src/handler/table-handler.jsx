import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import FormHandler from './form-handler';

const search = (props, state, onSuccess, onError) => {
    const [{ value: postcodes }, { value: from }, { value: to }] = state.config[0].items;
    const { page = 1 } = state;

    if (!postcodes || 0 === postcodes.length) {
        return;
    }

    return axios
        .post(
            process.env.REACT_APP_GRAPHQL,
            {
                query: `
{
    transactionSearch(
        postcode: "${postcodes[0].value}"
        ${from ? `from: "${from}"` : ''}
        ${to ? `to: "${to}"` : ''}
        page: ${page}
        perPage: 50
    )
    {
        price
        date
        property {
            postcode {
                postcode
            }
            street
            saon
            paon 
        }
    }
}
`
            }
        )
        .then(({ data: { data } }) => {
            const arr = (state.data || []);

            for (const row of data.transactionSearch) {
                const { property: { postcode, street, paon, saon } } = row;

                row.address = `${postcode.postcode || ''} ${street || ''}${paon ? `, ${paon}` : ''} ${saon || ''}`;
            }

            const result = arr.concat(data.transactionSearch);

            onSuccess(result);
        })
        .catch(onError);
};

export default class TableHandler extends PureComponent {
    constructor({ isLoading, data, page, perPage, errors }) {
        super();

        this.state = {
            isLoading,
            data,
            page,
            perPage,
            errors,
        }

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);

        this.onSearch = this.onSearch.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    onSuccess(data) {
        this.setState({ data, errors: undefined, isLoading: false });
    }

    onError(errors) {
        this.setState({ data: undefined, errors, isLoading: false });
    }

    onSearch(props, state) {
        this.setState({ page: 1, isLoading: true }, () => search(undefined, state, this.onSuccess, this.onError));
    }

    onScroll({ target }) {
        const isBottom = target.scrollHeight - target.scrollTop === target.clientHeight;

        if (isBottom) {
            const { page } = this.state;

            this.setState(
                { page: page + 1 },
                () => {
                    search(
                        undefined,
                        { ...this.props.form, page: page + 1, data: this.state.data },
                        this.onSuccess,
                        this.onError
                    )
                }
            );
        }
    }

    render() {
        const { columns } = this.props;
        const { data } = this.state;

        return <>
            <FormHandler
                {...this.props.form}
                onSubmit={this.onSearch}
            />
            <table className="table" onScroll={this.onScroll}>
                <thead>
                    <tr className="table-row table-row-header">
                        {columns.map(({ label }, i) => <th key={i} className="table-row-cell">{label}</th>)}
                    </tr>
                </thead>
                {
                    data
                    && <tbody className="table-content">
                        {
                            data.map((row, i) =>
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
