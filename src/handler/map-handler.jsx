import axios from 'axios';
import { Map, Marker } from 'pigeon-maps';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Drawer from '../drawer';
import { filter } from '../filtering/filter';
import FormHandler from './form-handler';
import Query from './query';

const onFilter = (data, pattern) => {
    pattern = (pattern || '').toLowerCase();

    for (const v of data) {
        v.isExpanded = filter(v, pattern);

        if (!pattern) {
            v.isExpanded = false;
            v.isVisible = true;
        }
    }
};

const onSearch = (props, state, c, onSuccess, onError) => {
    const { latitude, longitude } = c;
    const [{ value: postcode }, { value: range }] = state.config[0].items;


    return axios
        .post(
            process.env.REACT_APP_GRAPHQL,
            {
                query: `
{
    propertySearchWithInRange(
        pos: {
            lat: ${latitude}
            lng: ${longitude}
        }
        range: ${range}
        perPage: 2500
    ) {
        distance
        postcode {
            postcode
            lat
            lng
        }
    }
}
`
            }
        )
        .then(({ data: { data } }) => {
            const cache = {};

            for (const v of data.propertySearchWithInRange) {
                const { postcode: { postcode } } = v;
                if (undefined == cache[postcode]) {
                    cache[postcode] = []
                }

                cache[postcode].push(v);
            }

            const v = [];
            for (const postcode in cache) {
                v.push({
                    ...cache[postcode][0].postcode,
                    data: cache[postcode],
                })
            }

            onSuccess(v);
        })
        .catch(onError);
};

const onSearchDetails = (props, state, onSuccess, onError) => {
    const { postcode } = props;
    return axios
        .post(
            process.env.REACT_APP_GRAPHQL,
            {
                query: `
{
    propertySearch(postcode: "${postcode}") {
        paon
        saon
        street
        transactions {
            date
            price
        }
    }
}
`
            }
        )
        .then(({ data: { data } }) => {
            data.propertySearch.forEach((v) => {
                v.text = `${v.street || ''} ${v.paon || ''} ${v.saon ? `, ${v.saon}` : ''}`
            });

            onSuccess(data.propertySearch);
        })
        .catch(onError);
};

class DrawerTable extends PureComponent {
    constructor({ data, pattern }) {
        super();

        this.state = {
            data,
            pattern,
        };

        this.onFilter = this.onFilter.bind(this);
    }

    onFilter({ target: { value: pattern } }) {
        const { data } = this.state;

        this.props.onFilter(data, pattern);

        this.setState({ pattern, data: [...data] });
    }

    render() {
        const { title, placeholder } = this.props;
        const { data, pattern } = this.state;

        return <>
            <h2>{title}</h2>
            <input onChange={this.onFilter} placeholder={placeholder} value={pattern} />
            {
                data.map(({ text, chunks, isVisible, transactions }, i) =>
                    (undefined === isVisible || isVisible)
                    && <React.Fragment key={i}>
                        <h3 className="drawer-header">
                            {
                                chunks && 0 !== chunks.length
                                    ? chunks.map(({ v, isMatch }, i) => <span key={i} className={isMatch ? 'drawer-header--match' : ''}>{v}</span>)
                                    : text
                            }
                        </h3>
                        <table className="drawer-table">
                            {
                                transactions.map(({ date, price }, i) =>
                                    <tr key={i} className="drawer-table--row" >
                                        <td className="drawer-table--cell">{date}</td>
                                        <td sclassName="drawer-table--cell">{(price).toLocaleString()}</td>
                                    </tr>
                                )
                            }
                        </table>
                    </React.Fragment>
                )
            }
        </>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        pattern: PropTypes.string,
        onFilter: PropTypes.func.isRequired,
        data: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                chunks: PropTypes.arrayOf(
                    PropTypes.shape({
                        v: PropTypes.string.isRequired,
                        isMatch: PropTypes.bool,
                    })
                ),
                isVisible: PropTypes.bool,
                transactions: PropTypes.arrayOf(
                    PropTypes.shape({
                        date: PropTypes.string.isRequired,
                        price: PropTypes.number.isRequired,
                    })
                )
            })
        ),
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
    }
}

export default class MapHandler extends PureComponent {
    constructor({ isLoading, data, errors, coords, postcode, zoom }) {
        super();

        this.state = {
            isLoading,
            data,
            errors,
            coords,
            postcode,
            zoom,
        };

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);

        this.onSearch = this.onSearch.bind(this);

        this.onDetailsClose = this.onDetailsClose.bind(this);
        this.onDetailsOpen = this.onDetailsOpen.bind(this);

        this.onMapClick = this.onMapClick.bind(this);
        this.onMapMove = this.onMapMove.bind(this);
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => this.setState({ coords, isLoading: true }, () => this.onSearch(null, this.props.form))
        );
    }

    onSuccess(data) {
        this.setState({ data, errors: undefined, isLoading: false });
    }

    onError(errors) {
        this.setState({ data: undefined, errors, isLoading: false });
    }

    onSearch(formProps, formState) {
        this.setState({ isLoading: true }, () => { onSearch(formProps, formState, this.state.coords, this.onSuccess, this.onError) });
    }

    onDetailsClose(e) {
        this.setState({ postcode: undefined });
    }

    onDetailsOpen({ event, anchor, payload }) {
        this.setState({ postcode: payload });
    }

    onMapClick({ event, latLng: [latitude, longitude], pixel }) {
        // if (latitude === this.state.coords.latitude && longitude === this.state.coords.longitude) {
        //     return;
        // }

        // this.setState({ coords: { latitude, longitude }, isLoading: true }, () => this.onSearch(null, this.props.form));
    }

    onMapMove({ center: [latitude, longitude], zoom }) {
        if (latitude === this.state.coords.latitude && longitude === this.state.coords.longitude) {
            return;
        }

        this.setState({ coords: { latitude, longitude }, zoom, isLoading: true }, () => this.onSearch(null, this.props.form));
    }

    render() {
        const { data, isLoading, zoom, postcode, coords = {} } = this.state;
        const { 'data-cy': cy } = this.props;

        let { latitude, longitude } = coords;

        return <section className="map-handler">
            {
                postcode &&
                <Drawer onClose={this.onDetailsClose}>
                    <Query
                        postcode={postcode}
                        onMount={onSearchDetails}
                    >
                        {
                            (props, state) => <DrawerTable title={postcode} data={state.data} onFilter={onFilter} />
                        }
                    </Query>
                </Drawer>
            }
            <FormHandler
                {...this.props.form}
                onSearch={this.onSearch}
            />
            {
                isLoading
                && <div data-cy={`${cy}is-loading`} className="query--loading">
                    <div />
                    <div />
                </div>
            }
            {
                !isLoading
                && undefined !== latitude
                && undefined !== longitude
                && <Map
                    defaultCenter={[latitude, longitude]}
                    defaultZoom={zoom}
                    width={window.innerWidth}
                    height={560}
                    attributionPrefix={false}
                    attribution={' '}
                    onBoundsChanged={this.onMapMove}
                    onClick={this.onMapClick}
                >
                    {
                        data &&
                        data.map(({ lat, lng, postcode }) =>
                            <Marker anchor={[lat, lng]} payload={postcode} onClick={this.onDetailsOpen} />
                        )
                    }
                </Map>
            }
        </section>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        zoom: PropTypes.number,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
        zoom: 15,
    }
}
