import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, act } from '@testing-library/react';
import Drawer from './drawer';

describe('<Drawer/>', () => {
    const props = {
        onClose: jest.fn(),
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<Drawer {...props} />);

            expect(container.querySelector('[data-cy="--drawer--close"]')).toBeInTheDocument();
        });
    });

    describe('callbacks', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.clearAllTimers();
        });

        it('onClose', () => {
            const { container } = render(<Drawer {...props} />);

            act(() => {
                fireEvent.click(container.querySelector('[data-cy="--drawer--close"]'));

                jest.runAllTimers();
            });

            expect(props.onClose).toBeCalled();
        });
    });
});
