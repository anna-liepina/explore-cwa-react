import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MapOverviewPage, { IMapOverviewPageProps } from './map.overview.page';

describe('<MapOverviewPage/>', () => {
    const MapPage = (props: IMapOverviewPageProps ) => {
        return (
            <MemoryRouter>
                <MapOverviewPage {...props} />
            </MemoryRouter>
        )
    }

    const props = {
        form: { config: [] }
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<MapPage {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<MapPage {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
