import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, act } from '@testing-library/react';
import DrawerHandler from './drawer-handler';

describe('<DrawerHandler/>', () => {
    const props = {
        button: (props) => <button {...props} />,
    };

    const optionalProps = {
        className: '{{className}}',
        'data-cy': '{{data-cy}}',
    };

    let portal = document.getElementById('drawer');
    if (!portal) {
        portal = document.createElement('div');
        portal.setAttribute('id', 'drawer');
        document.body.appendChild(portal);
    }

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<DrawerHandler {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<DrawerHandler {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe.skip('external callbacks', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.clearAllTimers();
        });

        describe('onToggle', () => {
            it('should be invoked from a click on a tab [data-cy="--drawer--open"]', () => {
                const spy = jest.fn();
                const { container } = render(<DrawerHandler {...props} onToggle={spy} />);

                fireEvent.click(container.querySelector('[data-cy="--drawer--open"]'));

                expect(spy).toHaveBeenCalled();
            });

            it('should be invoked from a click on a tab [data-cy="--drawer--close"]', () => {
                const spy = jest.fn();
                const { container } = render(<DrawerHandler {...props} onToggle={spy} isExpanded />);

                expect(container.querySelector('[data-cy="--drawer--close"]')).toBeInTheDocument();

                act(() => {
                    fireEvent.click(container.querySelector('[data-cy="--drawer--close"]'));

                    jest.runAllTimers();
                });

                expect(spy).toHaveBeenCalled();
            });
        });
    });

    describe.skip('internal callbacks', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.clearAllTimers();
        });

        describe('onToggle', () => {
            it('from a click on [data-cy="--drawer--open"] should change internal state, and RENDER <Drawer /> and it\'s content', () => {
                const { container } = render(<DrawerHandler {...props} />);

                expect(container.querySelector('[data-cy="--drawer-close"]')).not.toBeInTheDocument();

                act(() => {
                    fireEvent.click(container.querySelector('[data-cy="--drawer--open"]'));

                    jest.runAllTimers();
                });

                expect(container.querySelector('[data-cy="--drawer--close"]')).toBeInTheDocument();
            });

            it('from a click on [data-cy="--drawer--close"] should change internal state, and HIDE <Drawer /> and it\'s content', () => {
                const { container } = render(<DrawerHandler {...props} isExpanded />);

                expect(container.querySelector('[data-cy="--drawer--close"]')).toBeInTheDocument();

                act(() => {
                    fireEvent.click(container.querySelector('[data-cy="--drawer--close"]'));

                    jest.runAllTimers();
                });

                expect(container.querySelector('[data-cy="--drawer--close"]')).not.toBeInTheDocument();
            });
        });
    });
});
