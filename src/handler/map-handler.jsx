import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FormHandler from './form-handler';

import axios from 'axios';
import { Map, Marker, Overlay } from 'pigeon-maps';

const onSubmit = (props, state, onSuccess, onError) => {
    // const [{ value: postcodes }, { value: range }] = state.config[0].items;

    // if (!postcodes || 0 === postcodes.length) {
    //     return;
    // }
    debugger;

    return axios
        .post(
            process.env.REACT_APP_GRAPHQL,
            {
                query: `
{
    propertySearchWithInRange(
        pos: {
            lat: 51.542884693,
            lng: 0.012193286
        },
        rangeUnit: ml
        range: 10
        perPage: 1000
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

export default class MapHandler extends PureComponent {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            data: undefined,
            errors: [],
            coords: {},
        }

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);

        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(({ coords }) => this.setState({ coords }));
    }

    onSuccess(data) {
        // this.setState({ data, errors: undefined, isLoading: false });
    }

    onError(errors) {
        // this.setState({ data: undefined, errors, isLoading: false });
    }

    onSearch(props, state) {
        this.setState({ isLoading: true }, () => { onSubmit(props, state, this.onSuccess, this.onError) });
    }

    render() {
        const { data, isLoading } = this.state;
        const { 'data-cy': cy } = this.props;

        let { latitude, longitude } = this.state.coords;
        if (data && data[0]) {
            latitude = data[0].lat;
            longitude = data[0].lng;
        }

        return <section className="map-handler">
            <FormHandler
                {...this.props.form}
                onSubmit={this.onSearch}
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
                && <Map defaultCenter={[latitude, longitude]} defaultZoom={15} width={window.innerWidth} height={560}>
                    {
                        data &&
                        data.map(({ lat, lng }) =>
                            <Marker anchor={[lat, lng]} payload={1} onClick={({ event, anchor, payload }) => { debugger; }} />
                        )
                    }
                </Map>
            }
        </section>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
    }
}
