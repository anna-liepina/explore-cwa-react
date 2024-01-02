import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import DrawerHandler from './drawer.handler';

describe('<DrawerHandler/>', () => {
    beforeAll(() => {
        const portalElement = document.createElement('div');
        portalElement.id = 'portal';
        document.body.appendChild(portalElement);
    });

    const props = {
        button: (props: React.ComponentPropsWithRef<'button'>) => <button {...props} />
    };

    const optionalProps = {
        'data-cy': 'optionalProps.data-cy',
        className: 'optionalProps.className',
    };

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

    describe('internal callbacks', () => {
        describe('onToggle', () => {
            it('from a click on [data-cy="--drawer--open"] should change internal state, and RENDER <Drawer /> and it\'s content', async () => {
                render(<DrawerHandler {...props} />);

                expect(document.querySelector('[data-cy="--drawer--close"]')).not.toBeInTheDocument();

                act(() => {
                    fireEvent.click(document.querySelector('[data-cy="--drawer--open"]')!);
                });

                await waitFor(() => {
                    expect(document.querySelector('[data-cy="--drawer--close"]')).toBeInTheDocument();
                })
            });
            
            it('from a click on [data-cy="--drawer--close"] should change internal state, and HIDE <Drawer /> and it\'s content', async () => {
                render(<DrawerHandler {...props} isExpanded />);

                expect(document.querySelector('[data-cy="--drawer--close"]')).toBeInTheDocument();

                act(() => {
                    fireEvent.click(document.querySelector('[data-cy="--drawer--close"]')!);
                });

                await waitFor(() => {
                    expect(document.querySelector('[data-cy="--drawer--close"]')).not.toBeInTheDocument();
                })
            });
        });
    });

    describe('external callbacks', () => {
        describe('onToggle', () => {
            it('should be invoked from a click on a [data-cy="--drawer--open"]', () => {
                const spy = jest.fn();
                const { container } = render(<DrawerHandler {...props} onToggle={spy} />);

                act(() => {
                    fireEvent.click(container.querySelector('[data-cy="--drawer--open"]')!);
                })

                expect(spy).toHaveBeenCalled();
            });

            it('should be invoked from a click on a [data-cy="--drawer--close"]', async () => {
                const spy = jest.fn();
                render(<DrawerHandler {...props} onToggle={spy} isExpanded />);

                expect(document.querySelector('[data-cy="--drawer--close"]')).toBeInTheDocument();

                act(() => {
                    fireEvent.click(document.querySelector('[data-cy="--drawer--close"]')!);
                });

                await waitFor(() => {
                    expect(spy).toHaveBeenCalled();
                })
            });
        });
    });
});
