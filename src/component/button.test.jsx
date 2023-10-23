import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Button from './button';

describe('<Button/>', () => {
    const props = {
        label: 'props.label',
    };

    const optionalProps = {
        /** should be injected 'as is' */
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<Button {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<Button {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
