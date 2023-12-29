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
                label: 'props.value[0].label',
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
