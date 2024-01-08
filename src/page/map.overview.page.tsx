import React, { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { useHistory, useLocation } from 'react-router';

import { useQuery } from '../hooks/useQuery';

import type { IFormProps, IFormState } from '../component/form/form';
import Form from '../component/form/form';
import type { ITextChunk } from '../utils/filtering/filter';
import { filterTree } from '../utils/filtering/filter';
import Query from '../component/query/query';
import Drawer from '../portal';

import type { IFetchMarkersPayload, IMarker } from '../graphql/requests/fetchMarkers';
import { MarkerType } from '../graphql/requests/fetchMarkers';
import api from '../graphql/api';

import type { IQAProps } from '../utils/commonTypes';

const colorHashmapByType: Record<MarkerType, string> = {
    [MarkerType.police]: '#f00',
    [MarkerType.property]: '#000',
};
const defaultColor = '#0ff';
const resolveMarkerColor = (marker: IMarker): string => colorHashmapByType[marker.type] || defaultColor;

export interface ITableRecord {
    date: string;
    text: string|number;
}

export interface IDrawTableRecord {
    isVisible?: boolean;
    text: string;
    chunks?: ITextChunk[];
    content: ITableRecord[];
}

export interface IDrawerTableProps extends IQAProps {
    pattern?: string;
    placeholder?: string;
    title: string;

    onFilter: (data: any, pattern: string) => void;
    data: IDrawTableRecord[];
}

const DrawerTable: React.FC<IDrawerTableProps> = ({
    'data-cy': cy = '',
    pattern,
    placeholder,
    title,
    onFilter,
    data,
}) => {
    const [filteredData, setFilteredData] = useState<IDrawTableRecord[]>(data);
  
    const handleFilterChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onFilter(data, event.target.value);

            setFilteredData([...data]);
        },
        [data, onFilter]
    );
  
    return <>
        <h2 data-cy={`${cy}--title`} className="drawer-table--title">
            {title}
        </h2>
        <input
            data-cy={`${cy}--input`}
            className="drawer-table--input"
            onChange={handleFilterChange}
            placeholder={placeholder}
            value={pattern}
        />
        {
            Array.isArray(filteredData) &&
            filteredData.map(({ isVisible, chunks, text, content }, i) => (
                (undefined === isVisible || isVisible) && (
                <React.Fragment key={i}>
                    <h3 data-cy={`${cy}-${i}`} className="drawer-table--category">
                    {
                        Array.isArray(chunks) && !!chunks.length
                            ? chunks.map(({ v, isMatch }, j) => (
                                <span
                                    key={j}
                                    data-cy={`${cy}-${i}-chunk-${j}${isMatch ? '--match' : ''}`}
                                    className={isMatch ? 'drawer-table--category--match' : ''}
                                >
                                    {v}
                                </span>
                            ))
                            : text
                    }
                    </h3>
                    {
                        Array.isArray(content) && !!content.length
                        && <table>
                                <tbody>
                                {
                                    content.map(({ date, text }, j) =>
                                        <tr className="drawer-table--row" key={j}>
                                            <td
                                                className="drawer-table--cell"
                                                data-cy={`${cy}-${i}-row-${j}-date`}
                                            >
                                                {date}
                                            </td>
                                            <td
                                                className="drawer-table--cell"
                                                data-cy={`${cy}-${i}-row-${j}-price`}
                                            >
                                                {typeof text === 'number' ? text.toLocaleString() : text}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    }
                </React.Fragment>
            )
            ))}
    </>
};

const onSearchDetails = (payload: IMarker): Promise<Object[]> => {
    if (payload.type === MarkerType.police) {
        return api.fetchIncidents({ latitude: payload.lat, longitude: payload.lng });
    }

    // if (payload.type === MarkerType.property) {
        return api.fetchProperties({ latitude: payload.lat, longitude: payload.lng });
    // }
};

const heightOffset = 90;
const resolveMapDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight - heightOffset,
})

const resolvePayload = (direct: IMapOverviewPageState, form?: IFormState) => {
    let coordinates;
    let range = 0.5;

    if (form) {
        const { config: [{ items }] } = form;
        const [{ value: _coordinates }] = items;
        range = items[1].value as number;
    
        if (Array.isArray(_coordinates) && _coordinates.length) {
            coordinates = _coordinates[0] as unknown as IMapOverviewPageState['coordinates'];
        }
    }

    coordinates ||= direct.coordinates;

    if (!coordinates.latitude || !coordinates.longitude) {
        return;
    }

    return {
        ...coordinates,
        range,
        perPage: 2_500_000
    };
}

interface IMapOverviewPageProps extends IQAProps {
    defaultZoom?: number;
    // TODO: review after <Form /> is converted to TypeScript
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

    const [markers, fetchMarkers] = useQuery<IFetchMarkersPayload, IMarker[]>(
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
        const payload = resolvePayload(state);
        if (undefined !== payload?.latitude && undefined !== payload.longitude ) {
            fetchMarkers(payload)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.coordinates]);

    const onDrawerToggle = (e?: { payload: IMarker }) => {
        setState(prevState => ({
            ...prevState,
            payload: e && e.payload,
        }));
    };

    const onFormSearch = async (props: IFormProps, _state: any) => {
        const coordinates = resolvePayload(state, _state);

        onMapChange({ center: [ coordinates!.latitude, coordinates!.longitude ], zoom: state.zoom });
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
            <Form {...form} data-cy={cy} onChange={onFormSearch} onSubmit={onFormSearch} />
            {
                (undefined === coordinates?.latitude || undefined === coordinates.longitude)
                 && <div data-cy={`${cy}--notification--disabled-location`} className="map-handler--disabled-location">
                    location services are not enabled, search by your current location is not possible
                </div>
            }
        </section>
    );
}

export default MapOverviewPage;
