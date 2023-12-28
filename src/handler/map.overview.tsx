import React, { useState, useEffect, PureComponent } from 'react';

import { Map, Marker } from 'pigeon-maps';

import Query from './query';
import Drawer from '../drawer';
import FormHandler from './form-handler';
import type { ITextChunk } from '../filtering/filter';
import { filterTree } from '../filtering/filter';

import { useHistory, useLocation } from 'react-router';
import { useQuery } from '../hooks/useQuery';

import type { IGeoSearchPayload, IMarker } from '../graphql/api';
import api, { MarkerType } from '../graphql/api';

const colorHashmapByType: Record<MarkerType, string> = {
    [MarkerType.police]: '#F00',
    [MarkerType.property]: '#000',
};
const defaultColor = '#0ff';
const resolveMarkerColor = (marker: IMarker): string => colorHashmapByType[marker.type] || defaultColor;

interface ITableRecord {
    date: string;
    text: string|number;
}

interface IDrawTableRecord {
    isVisible?: boolean;
    text: string;
    chunks?: ITextChunk[];
    records: ITableRecord[];
}

interface IDrawerTableProps {
    'data-cy': string,
    pattern?: string,
    placeholder?: string,
    title: string,

    onFilter: (data: any, pattern: string) => void,
    data: IDrawTableRecord[]
}

class DrawerTable extends PureComponent<IDrawerTableProps> {
    //@ts-ignore
    constructor({ data }) {
        //@ts-ignore
        super();

        this.state = {
            data,
        };

        this.onFilter = this.onFilter.bind(this);
    }

    //@ts-ignore
    onFilter({ target: { value: pattern } }) {
        //@ts-ignore
        const { data } = this.props;

        //@ts-ignore
        this.props.onFilter(data, pattern);

        this.setState({ data: [...data] });
    }

    render() {
        //@ts-ignore
        const { title, placeholder, 'data-cy': cy } = this.props;
        //@ts-ignore
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
                //@ts-ignore
                data.map(({ isVisible, chunks, text, content }, i) =>
                    (undefined === isVisible || isVisible)
                    && <React.Fragment key={i}>
                        <h3 data-cy={`${cy}-${i}`} className="drawer-header">
                            {
                                chunks && 0 !== chunks.length
                                    //@ts-ignore
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
}

const onSearchDetails = (payload: IMarker): Promise<Object[]> => {
    if (payload.type === MarkerType.police) {
        return api.fetchIncidents({ latitude: payload.lat, longitude: payload.lng });
    }

    // if (payload.type === MarkerType.property) {
        return api.fetchProperties({ latitude: payload.lat, longitude: payload.lng });
    // }
};

const heightOffset = 70;
const resolveMapDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight - heightOffset,
})

const resolvePayload = (props: IMapOverviewPageProps, state: IMapOverviewPageState) => {
    const { form: { config }} = props;
    const [ { value: _coordinates } , { value: range }] = config[0].items;
    let { coordinates } = state;

    if (_coordinates?.length) {
        coordinates = _coordinates[0];
    }

    if (!coordinates.latitude || !coordinates.longitude) {
        return;
    }

    return {
        ...coordinates,
        range,
        perPage: 2_500_000
    };
}

interface IMapOverviewPageProps {
    'data-cy'?: string;
    defaultZoom?: number;
    // TODO: review after <FormHandler /> is converted to TypeScript
    form: any;
}

interface IMapOverviewPageState {
    payload: any;
    zoom: number;
    width: number;
    height: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

const MapOverviewPage: React.FC<IMapOverviewPageProps> = (props) => {
    const location = useLocation();
    const history = useHistory();

    const urlSearchParams = new URLSearchParams(location.search);
    const latitude = parseFloat(urlSearchParams.get('latitude')!);
    const longitude = parseFloat(urlSearchParams.get('longitude')!);

    const { 'data-cy': cy = '', defaultZoom = 15, form } = props;
    const [state, setState] = useState<IMapOverviewPageState>({
        ...resolveMapDimensions(),
        payload: undefined,
        zoom: defaultZoom,
        coordinates: { latitude, longitude },
    });

    const [markers, fetchMarkers] = useQuery<IGeoSearchPayload, IMarker[]>(
        (args) => api.fetchMarkers(args),
        { manual: true }
    );

    const updateDimensions = () => {
        setState(prevState => ({
            ...prevState,
            ...resolveMapDimensions()
        }));
    };

    useEffect(() => {
        const { coordinates: { latitude, longitude } } = state;
        
        if (isNaN(latitude) || isNaN(longitude)) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: coordinates }) => {
                    console.log('{navigator.geolocation.getCurrentPosition}', { coordinates })

                    setState(prevState => ({
                        ...prevState,
                        coordinates,
                    }))
                }
            );
        }

        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const payload = resolvePayload(props, state);
        if (payload) {
            fetchMarkers(payload)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.coordinates.latitude, state.coordinates.longitude]);

    const onDrawerToggle = (e?: { payload: IMarker }) => {
        setState(prevState => ({
            ...prevState,
            payload: e && e.payload,
        }));
    };

    const onFormSearch = () => {
        const coordinates = resolvePayload(props, state);

        onMapChange({ center: [ coordinates!.latitude, coordinates!.longitude ], zoom: state.zoom })
    };

    const onMapChange = ({ center: [latitude, longitude], zoom }: { center: [ number, number ], zoom: number }) => {
        const coordinates = { latitude, longitude };

        history.replace({ 
            pathname: location.pathname,
            search: new URLSearchParams(coordinates as any).toString()
        });

        setState(prevState => ({
            ...prevState,
            coordinates,
            zoom,
        }));
    };

    const { payload, zoom = defaultZoom, coordinates, width, height } = state;

    return (
        <section className="map-handler" style={{ height: `${height}px` }}>
            {
                undefined !== payload
                // @ts-ignore
                && <Drawer data-cy={`${cy}--details`} onClose={onDrawerToggle}>
                    <Query data-cy={`${cy}--details`}
                        fetch={onSearchDetails}
                        fetchArgs={payload}
                    >
                        {
                            (props, state) => 
                                <DrawerTable
                                    data-cy={`${cy}--details`}
                                    data={state.data}
                                    title={`WIP Marker.label`}
                                    onFilter={filterTree}
                                />
                        }
                    </Query>
                </Drawer>
            }
            {
                !isNaN(coordinates.latitude)
                && !isNaN(coordinates.longitude)
                && <Map
                    center={[coordinates.latitude, coordinates.longitude]}
                    zoom={zoom}
                    width={width}
                    height={height}
                    onBoundsChanged={onMapChange}
                    attribution={false}
                    attributionPrefix={false}
                >
                    {
                        Array.isArray(markers.data)
                        && markers.data.map((marker, i) => (
                            <Marker
                                key={i}
                                anchor={[marker.lat, marker.lng]}
                                payload={marker}
                                onClick={onDrawerToggle}
                                color={resolveMarkerColor(marker)}
                            />
                        ))
                    }
                </Map>
            }
            <FormHandler {...form} data-cy={cy} onSubmit={onFormSearch} />
            {
                // coords === undefined
                // && <div data-cy={`${cy}--notification--no-geo`} className="map-handler--disabled-location">
                //     location services are not enabled, search by your current location is not possible
                // </div>
            }
        </section>
    );
}

export default MapOverviewPage;
