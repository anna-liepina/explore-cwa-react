import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import TablePage from './table.page';

describe('<TablePage/>', () => {
    const props = {
        form: { config: [] },

        columns: [
            {
                label: 'date',
                key: 'date',
            },
            {
                label: 'price',
                key: 'price',
            },
            {
                label: 'address',
                key: 'address',
            },
        ]
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        perPage: 250,
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<TablePage {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<TablePage {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
