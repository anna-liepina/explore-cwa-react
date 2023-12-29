import React from 'react';
import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import type { IQueryProps } from './query';
import Query from './query';


describe('<Query/>', () => {
    const props: IQueryProps = {
        fetch: jest.fn(() => Promise.resolve('result')),
        children: (props, state) => <div data-cy="query-child">
            <div data-testid="loading">{state.isLoading ? "Loading..." : "false"}</div>
            <div data-testid="data">{state.data}</div>
            <div data-testid="errors">{state.errors && state.errors.message}</div>
        </div>
    };

    const optionalProps: Partial<IQueryProps> = {
        'data-cy': '{{data-cy}}',
    };

    describe('render', () => {
        it('with required/default props', async () => {
            const { asFragment } = render(<Query {...props} />);

            await waitFor(() => { 
                expect(asFragment()).toMatchSnapshot();
            });
        });

        it('with optional/required props', async () => {
            const { asFragment } = render(<Query {...props} {...optionalProps} />);

            await waitFor(() => { 
                expect(asFragment()).toMatchSnapshot();
            });
        });

        describe('children render [render props approach]', () => {
            it('once ::fetch call is resolved it should call children with arguments [props, (internal query) state]', async () => {
                const spy = jest.spyOn(props, 'children');

                render(<Query {...props} />);

                await waitFor(async () => {
                    expect(spy).toBeCalledWith(
                        expect.any(Object),
                        expect.any(Object)
                    );
                });
            });
        });
    });

    describe('refetch functionality', () => {
        it('should invoke external callback [::fetch] if prop [::fetchTrigger] changed', async () => {
            const spy = jest.spyOn(props, 'fetch');

            const { rerender } = render(<Query {...props} />);

            await waitFor(() => {
                expect(spy).toHaveBeenCalledTimes(1);
            });
        
            rerender(<Query {...props} fetchTrigger={Date.now()} />);
        
            await waitFor(() => {
                expect(spy).toHaveBeenCalledTimes(2);
            });
        });

        it('should NOT invoke external callback [::fetch] if prop [::fetchTrigger] NOT changed', async () => {
            const spy = jest.spyOn(props, 'fetch');

            const { rerender } = render(<Query {...props} fetchTrigger={1}/>);

            await waitFor(() => {
                expect(spy).toHaveBeenCalledTimes(1);
            });
        
            rerender(<Query {...props} fetchTrigger={1} />);
        
            await waitFor(() => {
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('lifecycles events', () => {
        describe('onMount', () => {
            it('should invoke external callback [::fetch] onMount', async () => {
                const spy = jest.spyOn(props, 'fetch');

                render(<Query {...props} />);

                await waitFor(() => {
                    expect(spy).toBeCalled();
                });
            });
        });
    });

    describe('internal callbacks', () => {
        describe('::onSuccess', () => {
            const data = [
                {
                    postcode: 'SW1A 2AA',
                }
            ];

            const fetch = () => Promise.resolve(data);

            it('should set internal state field [::isLoading] to false, reset [::errors] and set [::data] from payload', async () => {
                const spy = jest.fn();

                render(<Query {...props} fetch={fetch} children={spy} />);

                await waitFor(() => {
                    expect(spy).toBeCalledWith(expect.any(Object), { data, errors: undefined, isLoading: false });
                });
            });
        });

        describe('::onError', () => {
            const errors = [
                'error 0',
                'error 1',
            ];

            const fetch = () => Promise.reject(errors);

            it('should set internal state field [::isLoading] to false, reset [::data] and [::errors] from payload', async () => {
                const spy = jest.fn();

                render(<Query {...props} fetch={fetch} children={spy} />);

                await waitFor(() => {
                    expect(spy).toBeCalledWith(expect.anything(), { data: undefined, errors, isLoading: false });
                });
            });
        });
    });
});
