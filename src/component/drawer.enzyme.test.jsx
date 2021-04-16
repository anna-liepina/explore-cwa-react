import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Drawer from './drawer';

describe.skip('<Drawer/>', () => {
    const props = {
        onClose: jest.fn(),
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<Drawer {...props} />);

            expect(container.querySelector('[data-cy="-drawer-close"]')).toBeInTheDocument();
        });
    });

    describe('callbacks', () => {
        describe('onClose', () => {
            const { container } = render(<Drawer {...props} />);

            fireEvent.click(container.querySelector('[data-cy="--drawer-close"]'));

            expect(props.onClose).toBeCalled();
        });
    });
});
