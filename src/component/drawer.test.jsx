import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import Drawer from './drawer';

describe('<Drawer/>', () => {
    const props = {
        onClose: jest.fn(),
    };

    const optionalProps = {
        'data-cy': 'optionalProps.data-cy',
        className: 'optionalProps.className',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<Drawer {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<Drawer {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
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
