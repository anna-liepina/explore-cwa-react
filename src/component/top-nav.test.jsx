import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import _TopNav from './top-nav';

const TopNav = (props) =>
    <MemoryRouter>
        <_TopNav {...props} />
    </MemoryRouter>;

describe('<TopNav/>', () => {
    const props = {
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<TopNav {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<TopNav {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
