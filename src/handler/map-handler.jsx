import axios from 'axios';
import { Map, Marker } from 'pigeon-maps';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Drawer from '../drawer';
import FormHandler from './form-handler';
import Query from './query';

const onSearch = (props, state, c, onSuccess, onError) => {
    const { latitude, longitude } = c;
    const [{ value: postcodes }, { value: range }] = state.config[0].items;

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
            onSuccess(data.propertySearch);
        })
        .catch(onError);
};

const DetailTables = ({ data }) => {
    return data.map(({ street, paon, saon, transactions }) =>
        <>
            <h3>{street || ''} {paon || ''}{saon ? `, ${saon}` : ''}</h3>
            <table>
                {
                    transactions.map(({ date, price }, i) =>
                        <tr key={i}>
                            <td>{date}</td>
                            <td>{price}</td>
                        </tr>
                    )
                }
            </table>
        </>)
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
                            (props, state) =>
                                <>
                                    <h2>{postcode}</h2>
                                    <DetailTables data={state.data} />
                                </>
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
