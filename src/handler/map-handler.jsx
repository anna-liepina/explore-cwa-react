import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Map, Marker } from 'pigeon-maps';
import axios from 'axios';

import Query from './query';
import Drawer from '../drawer';
import FormHandler from './form-handler';
import { filter } from '../filtering/filter';

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

    const { latitude, longitude } = point;

    return { latitude, longitude, range, perPage: 2_500_000 }
}

const fetchProperties = async ({ latitude, longitude, range, perPage }) => {
    return query(`
{
    propertySearchWithInRange(
        pos: {
            lat: ${latitude}
            lng: ${longitude}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        postcode {
            postcode
            lat
            lng
        }
    }
}`)
        .then(({ data: { data } }) => {
            const cache = {};

            for (const v of data.propertySearchWithInRange) {
                const { postcode: { postcode } } = v;

                cache[postcode] ||= [];
                cache[postcode].push(v);
            }

            const v = [];
            for (const postcode in cache) {
                v.push({
                    ...cache[postcode][0].postcode,
                    data: cache[postcode],
                })
            }

            return v;
        })
        .catch((errors) => errors);
};

const fetchIncidents = async ({ latitude, longitude, range, perPage }) => {
    return query(`
{
    incidentSearchWithInRange(
        pos: {
            lat: ${latitude}
            lng: ${longitude}
        }
        range: ${range}
        perPage: ${perPage}
    ) {
        lat
        lng
        date
        type
    }
}`)
        .then(({ data: { data } }) => {
            const cache = {};

            for (const v of data.incidentSearchWithInRange) {
                const { lat, lng } = v;
                const key = `${lat}:${lng}`;

                cache[key] ||= [];
                cache[key].push(v);
            }

            const v = [];
            for (const coords in cache) {
                v.push({
                    postcode: coords,
                    lat: cache[coords][0].lat,
                    lng: cache[coords][0].lng,
                    data: cache[coords],
                })
            }

            return v;
        })
        .catch((errors) => errors);
};

const onSearchDetails = (props, state, onSuccess, onError) => {
    const { postcode } = props;

    if (postcode.includes(':')) {
        const cursor = props.data.find(v => v.postcode === postcode);

        return onSuccess([
            {
                text: postcode,
                transactions: cursor.data.map((v) => ({ date: v.date, price: v.type }))
            }
        ]);
    }

    return query(`
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
}`)
        .then(({ data: { data } }) => {
            for (const v of data.propertySearch) {
                v.text = [v.street, v.paon, v.saon].filter(Boolean).join(', ');
            }

            onSuccess(data.propertySearch);
        })
        .catch(onError);
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
                data.map(({ text, chunks, isVisible, transactions }, i) =>
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
                            !!transactions &&
                            <table>
                                <tbody>
                                    {
                                        transactions.map(({ date, price }, j) =>
                                            <tr className="drawer-table--row" key={j} >
                                                <td className="drawer-table--cell" data-cy={`${cy}-${i}-row-${j}-date`}>{date}</td>
                                                <td className="drawer-table--cell" data-cy={`${cy}-${i}-row-${j}-price`}>
                                                    { typeof price === 'number' ? price.toLocaleString() : price }
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
    }
}

const heightOffset = 70;
export default class MapHandler extends PureComponent {
    constructor({ isLoading, properties, incidents, errors, coords, postcode, zoom }) {
        super();

        this.state = {
            isLoading,
            properties,
            incidents,
            errors,
            coords,
            postcode,
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

    onSuccess(properties, incidents) {
        this.setState({ properties, incidents, errors: undefined, isLoading: false });
    }

    onError(errors) {
        this.setState({ properties: undefined, incidents: undefined, errors, isLoading: false });
    }

    onDrawerToggle(e) {
        this.setState({ postcode: e && e.payload });
    }

    async onSearch() {
        await Promise.all([
            fetchProperties(resolvePayload(this.props, this.state)),
            fetchIncidents(resolvePayload(this.props, this.state))
        ]).then(([ properties, incidents ]) => {
            this.onSuccess(properties, incidents);
        });
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
        const { postcode, isLoading, coords, zoom, properties, incidents, point, width, height } = this.state;

        return <section className="map-handler">
            {
                postcode
                && <Drawer
                    data-cy={`${cy}--details`}
                    onClose={this.onDrawerToggle}
                >
                    <Query
                        data-cy={`${cy}--details`}
                        onMount={onSearchDetails}
                        postcode={postcode}
                        data={incidents}
                    >
                        {
                            (props, state) =>
                                <DrawerTable
                                    data-cy={`${cy}--details`}
                                    data={state.data}
                                    title={postcode}
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
                        properties &&
                        properties.map(({ lat, lng, postcode }, i) =>
                            <Marker key={i} anchor={[lat, lng]} payload={postcode} onClick={this.onDrawerToggle} color="#000" />)
                    }
                    {
                        incidents &&
                        incidents.map(({ lat, lng, postcode }, i) =>
                            <Marker key={i} anchor={[lat, lng]} payload={postcode} onClick={this.onDrawerToggle} color="#F00" />
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
