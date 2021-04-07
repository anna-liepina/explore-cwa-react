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

const onSearch = async ({ config }, state, onSuccess, onError) => {
    const [, { value: range }] = config[0].items;
    const { point } = state;

    if (undefined === point) {
        return;
    }

    const { latitude, longitude } = point;

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
                if (undefined === cache[postcode]) {
                    cache[postcode] = [];
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
            for (const v of data.propertySearch) {
                v.text = `${v.street || ''} ${v.paon || ''} ${v.saon ? `, ${v.saon}` : ''}`;
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
        const { data } = this.state;

        this.props.onFilter(data, pattern);

        this.setState({ data: [...data] });
    }

    render() {
        const { title, placeholder, 'data-cy': cy } = this.props;
        const { data, } = this.state;

        return <>
            <h2 data-cy={`${cy}--title`}>{title}</h2>
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
                        <table>
                            <tbody>
                                {
                                    transactions.map(({ date, price }, j) =>
                                        <tr className="drawer-table--row" key={j} >
                                            <td className="drawer-table--cell" data-cy={`${cy}-${i}-row-${j}-date`}>{date}</td>
                                            <td className="drawer-table--cell" data-cy={`${cy}-${i}-row-${j}-price`}>{(price).toLocaleString()}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
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
            width: window.innerWidth,
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
        this.setState({ width: window.innerWidth });
    }

    onSuccess(data) {
        this.setState({ data, errors: undefined, isLoading: false });
    }

    onError(errors) {
        this.setState({ data: undefined, errors, isLoading: false });
    }

    onDrawerToggle(e) {
        this.setState({ postcode: e && e.payload });
    }

    onSearch() {
        onSearch(this.props.form, this.state, this.onSuccess, this.onError)
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
        const { postcode, isLoading, coords, zoom, data, point = {}, width } = this.state;
        const { latitude, longitude } = point;

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
            <FormHandler
                {...this.props.form}
                data-cy={cy}
                onSubmit={this.onFormSearch}
            />
            {
                undefined === coords
                && <div data-cy={`${cy}--notification--no-geo`} className="map-handler--disabled-location">
                    location services are not enabled, search by your current postcode is not possible
                </div>
            }
            {
                isLoading
                && undefined !== latitude
                && undefined !== longitude
                && <div data-cy={`${cy}--loading`} className="query--loading">
                    <div />
                    <div />
                </div>
            }
            {
                !isLoading
                && undefined !== latitude
                && undefined !== longitude
                && <Map
                    center={[latitude, longitude]}
                    zoom={zoom}
                    width={width}
                    height={560}
                    onBoundsChanged={this.onMapSearch}
                    attribution={false}
                    attributionPrefix={false}
                >
                    {
                        data &&
                        data.map(({ lat, lng, postcode }, i) =>
                            <Marker key={i} anchor={[lat, lng]} payload={postcode} onClick={this.onDrawerToggle} color="#000" />
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
        isLoading: PropTypes.bool,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
        zoom: 15,
        isLoading: true,
    }
}
