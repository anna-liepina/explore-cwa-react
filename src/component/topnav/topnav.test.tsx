import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopNav from './topnav';
import type { ITopNavProps } from './topnav';

const ProxyComponent: React.FC = (props: ITopNavProps) =>
    <MemoryRouter>
        <TopNav {...props} />
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
            const { asFragment } = render(<ProxyComponent {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<ProxyComponent {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
