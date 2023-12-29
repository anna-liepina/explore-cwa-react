import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ChartHandler from './chart-handler';

describe('<ChartHandler/>', () => {
    const props = {
        form: { config: [] }
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        title: 'optProps.title',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<ChartHandler {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<ChartHandler {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
