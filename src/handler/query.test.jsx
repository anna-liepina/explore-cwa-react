import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Query from './query';

describe('<Query/>', () => {
    const props = {
        onMount: jest.fn(),
        children: () => <div />
    };

    const optionalProps = {
        'data-cy': '{{data-cy}}',
    };

    describe('render', () => {
        it('with required/default props', () => {
            const { asFragment } = render(<Query {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<Query {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });

        describe('children render [render props approach]', () => {
            it('if internal state field [::isLoading] is true, it should call children with arguments [props, internal state]', () => {
                const spy = jest.spyOn(props, 'children');

                const onMount = (_, __, onSuccess, onError) => onSuccess();
                render(<Query {...props} onMount={onMount} />);

                expect(spy).toBeCalledWith(
                    { ...Query.defaultProps, ...props, onMount },
                    {
                        data: undefined,
                        errors: undefined,
                        isLoading: false,
                    }
                );
            });
        });
    });

    describe('lifecycles events', () => {
        describe('::componentDidMount', () => {
            it('should invoke external callback [::onMount]', () => {
                const spy = jest.spyOn(props, 'onMount');

                render(<Query {...props} />);

                expect(spy).toBeCalledWith(
                    { ...Query.defaultProps, ...props },
                    {
                        data: undefined,
                        errors: undefined,
                        isLoading: true,
                    },
                    expect.any(Function),
                    expect.any(Function),
                );
            });
        });
    });

    describe('callbacks', () => {
        beforeEach(() => {
            jest.restoreAllMocks()
        });

        describe('::onSuccess', () => {
            const data = [
                {
                    src: 'http://localhost:8080/logo.png',
                }
            ];
            const onMount = (_, __, onSuccess, onError) => onSuccess(data);

            it('should set internal state field [::isLoading] to false, reset [::errors] and [::data] from payload', () => {
                const spy = jest.spyOn(Query.prototype, 'setState');
 
                render(<Query {...props} onMount={onMount} />);

                expect(spy).toBeCalledWith({ data, errors: undefined, isLoading: false }, expect.anything(Function));
            });

            it('should invoke external callback ::onSuccess, if it provided with props/state as payload',  () => {
                const spy = jest.fn();

                render(<Query {...props} onMount={onMount} onSuccess={spy} />);

                expect(spy).toBeCalledWith(
                    { ...Query.defaultProps, ...props, onMount, onSuccess: spy },
                    {
                        data,
                        errors: undefined,
                        isLoading: false,
                    }
                );
            });

        });

        describe('::onError', () => {
            const errors = [
                'error 0',
                'error 1',
            ];
            const onMount = (_, __, onSuccess, onError) => onError(errors);

            it('should set internal state field [::isLoading] to false, reset [::data] and [::errors] from payload', () => {
                const spy = jest.spyOn(Query.prototype, 'setState');

                render(<Query {...props} onMount={onMount} />);

                expect(spy).toBeCalledWith({ data: undefined, errors, isLoading: false }, expect.anything(Function));
            });

            it('should invoke external callback ::onError, if it provided with props/state as payload', () => {
                const spy = jest.fn();

                render(<Query {...props} onMount={onMount} onError={spy} />);

                expect(spy).toBeCalledWith(
                    { ...Query.defaultProps, ...props, onMount, onError: spy },
                    {
                        data: undefined,
                        errors,
                        isLoading: false,
                    }
                );
            });
        });
    });
});
