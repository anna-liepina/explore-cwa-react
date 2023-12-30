import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import InputWithPills from './input-with-pills';

describe('<InputWithPills/>', () => {
    const props = {
    };

    const optionalProps = {
        value: [
            {
                label: 'tag 0 - value as string',
                value: 'string'
            },
            {
                label: 'tag 1 - value as number',
                value: 1
            }
        ],
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<InputWithPills {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<InputWithPills {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
