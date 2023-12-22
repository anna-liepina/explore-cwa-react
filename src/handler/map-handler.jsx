import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Map, Marker } from 'pigeon-maps';
import axios from 'axios';

import Query from './query';
import Drawer from '../drawer';
import FormHandler from './form-handler';
import { filter } from '../filtering/filter';

const colorHashmapByType = {
    police: '#F00',
    property: '#000',
};
const defaultHashmap = '#0ff';
const resolveMarkerColor = (marker) => colorHashmapByType[marker.type] || defaultHashmap;

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

const query = (query) => {
    return axios
        .post(
            process.env.REACT_APP_GRAPHQL,
            { query }
        )
}

const resolvePayload = ({ form: { config }}, state) => {
    const [, { value: range }] = config[0].items;
    const { point } = state;

    if (undefined === point) {
        return;
    }

    return {
        lat: point.latitude,
        lng: point.longitude,
        range: .5,
        perPage: 2_500_000
    };
}

const fetchProperties = async ({ lat, lng, range = 0, perPage = 2500 }) => {
    return query(`
{
    propertySearchWithInRange(
        pos: {
            lat: ${lat}
            lng: ${lng}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        paon
        saon
        street
        postcode {
            postcode
        }
        transactions {
            date
            price
        }
    }
}`)
        .then(({ data: { data: { propertySearchWithInRange: properties } } }) => {
            return properties.map((v) => ({
                text: [v.street, v.paon, v.saon].filter(Boolean).join(', '),
                content: v.transactions.map(({ date, price: text }) => ({ date, text }))
            }))
        })
        .catch((errors) => errors);
};

const fetchIncidents = async ({ lat, lng, range = 0, perPage = 2500 }) => {
    return query(`
{
    incidentSearchWithInRange(
        pos: {
            lat: ${lat}
            lng: ${lng}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        date
        type
    }
}`)
        .then(({ data: { data: { incidentSearchWithInRange: incidents } } }) => ([{
            text: 'WIP: LSOA/Place Name <DrawerTable /> .data[0].label',
            content: incidents.map(({ date, type: text }) => ({ date, text })),
        }]))
        .catch((errors) => errors);
};

const fetchMarkers = async ({ lat, lng, range = 0, perPage = 2500 }) => {
    return query(`
{
    markerSearchWithInRange(
        pos: {
            lat: ${lat}
            lng: ${lng}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        lat
        lng
        type
    }
}`)
        .then(({ data: { data } }) => data.markerSearchWithInRange)
        .catch((errors) => errors);
};

const onSearchDetails = (props, state, onSuccess, onError) => {
    const { payload } = props;

    if (payload.type === 'police') {
        return fetchIncidents(payload).then(onSuccess);
    }

    if (payload.type === 'property') {
        return fetchProperties(payload).then(onSuccess);
    }
};

const extractPoint = ({ config }) => {
    const { value: points } = config[0].items[0];

    if (undefined === points || 0 === points.length) {
        return undefined;
    }

    return points[0];
}

class DrawerTable extends PureComponent {
    constructor({ data }) {
        super();

        this.state = {
            data,
        };

        this.onFilter = this.onFilter.bind(this);
    }

    onFilter({ target: { value: pattern } }) {
        const { data } = this.props;

        this.props.onFilter(data, pattern);

        this.setState({ data: [...data] });
    }

    render() {
        const { title, placeholder, 'data-cy': cy } = this.props;
        const { data } = this.state;

        return <>
            <h2 data-cy={`${cy}--title`} className="drawer-table--title">{title}</h2>
            <input
                data-cy={`${cy}--input`}
                className="drawer-table--input"
                onChange={this.onFilter}
                placeholder={placeholder}
            />
            {
                data.map(({ isVisible, chunks, text, content }, i) =>
                    (undefined === isVisible || isVisible)
                    && <React.Fragment key={i}>
                        <h3 data-cy={`${cy}-${i}`} className="drawer-header">
                            {
                                chunks && 0 !== chunks.length
                                    ? chunks.map(({ v, isMatch }, j) =>
                                        <span
                                            key={j}
                                            data-cy={`${cy}-${i}-chunk-${j}${isMatch ? '--match' : ''}`}
                                            className={isMatch ? 'drawer-header--match' : ''}
                                        >
                                            {v}
                                        </span>
                                    )
                                    : text
                            }
                        </h3>
                        {
                            Array.isArray(content) &&
                            <table>
                                <tbody>
                                    {
                                        content.map(({ date, text }, j) =>
                                            <tr className="drawer-table--row" key={j} >
                                                <td className="drawer-table--cell" data-cy={`${cy}-${i}-row-${j}-date`}>{date}</td>
                                                <td className="drawer-table--cell" data-cy={`${cy}-${i}-row-${j}-price`}>
                                                    { typeof text === 'number' ? text.toLocaleString() : text }
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        }
                    </React.Fragment>
                )
            }
        </>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
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
                records: PropTypes.arrayOf(
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
    }
}

const heightOffset = 70;
export default class MapHandler extends PureComponent {
    constructor({ isLoading, data, errors, coords, payload, zoom }) {
        super();

        this.state = {
            isLoading,
            data,
            errors,
            coords,
            payload,
            zoom,
            width: window.innerWidth,
            height: window.innerHeight - heightOffset,
        };

        this.updateDimensions = this.updateDimensions.bind(this);

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);

        this.onDrawerToggle = this.onDrawerToggle.bind(this);

        this.onSearch = this.onSearch.bind(this);

        this.onMapSearch = this.onMapSearch.bind(this);
        this.onFormSearch = this.onFormSearch.bind(this);
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => this.setState({ point: coords, coords, isLoading: true }, this.onSearch)
        );

        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight - heightOffset });
    }

    onSuccess(data) {
        this.setState({ data, errors: undefined, isLoading: false });
    }

    onError(errors) {
        this.setState({ data: undefined, errors, isLoading: false });
    }

    onDrawerToggle(e) {
        this.setState({ payload: e && e.payload });
    }

    async onSearch() {
        await fetchMarkers(resolvePayload(this.props, this.state))
            .then(this.onSuccess);
    }

    onMapSearch({ center: [latitude, longitude], zoom }) {
        const { point } = this.state;

        if (
            point
            && latitude === point.latitude
            && longitude === point.longitude
        ) {
            return;
        }

        this.setState({ point: { latitude, longitude }, isLoading: true, zoom }, this.onSearch);
    }

    onFormSearch() {
        const point = extractPoint(this.props.form) || this.state.point;

        this.setState({ point, isLoading: true }, this.onSearch);
    }

    render() {
        const { 'data-cy': cy } = this.props;
        const { payload, isLoading, coords, zoom, data, point, width, height } = this.state;

        return <section className="map-handler" style={{ height: `${height}px` }}>
            {
                !!payload
                && <Drawer
                    data-cy={`${cy}--details`}
                    onClose={this.onDrawerToggle}
                >
                    <Query
                        data-cy={`${cy}--details`}
                        onMount={onSearchDetails}
                        payload={payload}
                    >
                        {
                            (props, state) =>
                                <DrawerTable
                                    data-cy={`${cy}--details`}
                                    data={state.data}
                                    title={`lat: ${payload.lat} | lng: ${payload.lng} | ${payload.type}`}
                                    onFilter={onFilter}
                                />
                        }
                    </Query>
                </Drawer>
            }
            {
                !isLoading
                && undefined !== point
                && undefined !== point.latitude
                && undefined !== point.longitude
                && <Map
                    center={[point.latitude, point.longitude]}
                    zoom={zoom}
                    width={width}
                    height={height}
                    onBoundsChanged={this.onMapSearch}
                    attribution={false}
                    attributionPrefix={false}
                >
                    {
                        Array.isArray(data) &&
                        data.map((marker, i) =>
                            <Marker
                                key={i}
                                anchor={[marker.lat, marker.lng]}
                                payload={marker}
                                onClick={this.onDrawerToggle}
                                color={resolveMarkerColor(marker)}
                            />
                        )
                    }
                </Map>
            }
            <FormHandler
                {...this.props.form}
                data-cy={cy}
                onSubmit={this.onFormSearch}
            />
            {
                undefined === coords
                && <div data-cy={`${cy}--notification--no-geo`} className="map-handler--disabled-location">
                    location services are not enabled, search by your current location is not possible
                </div>
            }
            {
                isLoading
                && undefined !== point
                && undefined !== point.latitude
                && undefined !== point.longitude
                && <div data-cy={`${cy}--loading`} className="query--loading">
                    <div />
                    <div />
                </div>
            }
        </section>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        isLoading: PropTypes.bool,
        zoom: PropTypes.number,
    }

    static defaultProps = {
        'data-cy': '',
        isLoading: true,
        zoom: 15,
    }
}
