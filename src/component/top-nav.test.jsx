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
        label: '{{label}}',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<TopNav {...props} />);

            expect(container.querySelector('[data-cy="topnav__logo"]')).toBeInTheDocument();
            expect(container.querySelector('[data-cy="topnav__github"]')).toBeInTheDocument();
        });
    });
});
