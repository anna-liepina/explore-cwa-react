import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Pill from './pill';

describe('<Pill/>', () => {
    const props = {
        label: 'props.label',
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        'data-id': 'optProps.data-id',
        className: 'optProps.className',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<Pill {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<Pill {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
