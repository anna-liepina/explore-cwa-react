import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import _Tile from './tile';

const Tile = (props) =>
    <MemoryRouter>
        <_Tile {...props} />
    </MemoryRouter>;

describe('<Tile/>', () => {
    const props = {
        to: '//example.com',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<Tile {...props} />);

            expect(container.querySelector('[href="//example.com"]')).toBeInTheDocument();
        });
    });
});
