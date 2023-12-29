import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import FormHandler from './form-handler';

describe('<FormHandler/>', () => {
    const ctrlProps = {
        updateCTRL: {
            label: 'updateCTRL.label',
        },
        submitCTRL: {
            label: 'submitCTRL.label',
        },
        cancelCTRL: {
            label: 'cancelCTRL.cancel',
        },
    };

    const c = (props) => <input {...props} />

    const props = {
        config: [
            {
                title: 'props.config[0].title',
                items: [
                    {
                        c,
                    }
                ]
            }
        ],
        ...ctrlProps,
    };

    const data = {};
    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        title: 'optProps.title',
        data,
    };

    const e = {
        target: {
            value: '{{value}}',
            getAttribute: () => 0,
        },
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<FormHandler {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<FormHandler {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('lifecycle events', () => {
        describe('::componentDidMount', () => {
            it('should invoke external callback [::onMount]', () => {
                const spy = jest.fn();

                render(<FormHandler {...props} onMount={spy} />);

                expect(spy).toBeCalledWith(
                    { ...FormHandler.defaultProps, ...props, onMount: spy },
                    expect.anything(Object),
                    expect.anything(Function),
                    expect.anything(Function)
                );
            });
        });
    });

    describe('internal callbacks', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('::onSuccess', () => {
            it('should set state fields [::config, ::data] from payload', () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');
                const _config = [{ ...props.config[0], title: '_config[0].title' }];
                const onMount = (props, state, onSuccess, onError) => { onSuccess({ data, config: _config }) };
                
                render(<FormHandler {...props} onMount={onMount}/>);

                expect(spy).toBeCalledWith({ data, config: _config }, expect.anything(Function));
            });

            it(`should set state fields ::config from local state, if it hasn't been provide in payload`, () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');
                const onMount = (props, state, onSuccess, onError) => { onSuccess({ }) };
                
                render(<FormHandler {...props} onMount={onMount}/>);

                expect(spy).toBeCalledWith({ data: undefined, config: props.config }, expect.anything(Function));
            });

            it('should invoke external callback [::onSuccess]', () => {
                const spy = jest.fn();
                const onMount = (props, state, onSuccess, onError) => { onSuccess({ }) };

                render(<FormHandler {...props} onSuccess={spy} onMount={onMount}/>);

                expect(spy).toBeCalledWith(expect.anything(Object), expect.anything(Function));
            });
        });

        describe('::onError', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should set state fields [::config, ::data] from payload', () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');
                const _config = [{ ...props.config[0], title: '_config[0].title' }];
                const onMount = (props, state, onSuccess, onError) => { onError({ data, config: _config }) };
                
                render(<FormHandler {...props} onMount={onMount}/>);

                expect(spy).toBeCalledWith({ data, config: _config }, expect.anything(Function));
            });

            it(`should set state fields ::config from local state, if it hasn't been provide in payload`, () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');
                const onMount = (props, state, onSuccess, onError) => { onError({ }) };
                
                render(<FormHandler {...props} onMount={onMount}/>);

                expect(spy).toBeCalledWith({ data: undefined, config: props.config }, expect.anything(Function));
            });

            it('should invoke external callback [::onError]', () => {
                const spy = jest.fn();
                const onMount = (props, state, onSuccess, onError) => { onError({ }) };

                render(<FormHandler {...props} onError={spy} onMount={onMount}/>);

                expect(spy).toBeCalledWith(expect.anything(Object), expect.anything(Function));
            });
        });

        describe('::onSubmit', () => {
            beforeEach(() => {
                jest.restoreAllMocks();
            });

            it('should NOT invoke external callback [::onSubmit] from click on [data-cy="form-action-submit"] because ::isValid is falsy', () => {
                const spy = jest.fn();
                const { container } = render(<FormHandler {...props} onSubmit={spy} />);

                fireEvent.click(container.querySelector('[data-cy="form-action-submit"]'));

                expect(spy).not.toBeCalled();
            });

            it('should invoke external callback [::onSubmit] from click on [data-cy="form-action-submit"]', () => {
                const spy = jest.fn();
                const { container } = render(<FormHandler {...props} onSubmit={spy} isValid />);

                fireEvent.click(container.querySelector('[data-cy="form-action-submit"]'));

                expect(spy).toBeCalledWith(
                    { ...FormHandler.defaultProps, ...props, isValid: true, onSubmit: spy },
                    expect.anything(Object),
                    expect.anything(Function),
                    expect.anything(Function)
                );
            });

            it('should NOT invoke external callback [::onSubmit] from click on [data-cy="form-action-update"] because ::isValid is falsy', () => {
                const spy = jest.fn();
                const { container } = render(<FormHandler {...props} onSubmit={spy} data={data} />);

                fireEvent.click(container.querySelector('[data-cy="form-action-update"]'));

                expect(spy).not.toBeCalled();
            });

            it('should invoke external callback [::onSubmit] from click on [data-cy="form-action-update"]', () => {
                const spy = jest.fn();
                const { container } = render(<FormHandler {...props} onSubmit={spy} data={data} isValid />);

                fireEvent.click(container.querySelector('[data-cy="form-action-update"]'));

                expect(spy).toBeCalledWith(
                    { ...FormHandler.defaultProps, ...props, isValid: true, data: {}, onSubmit: spy },
                    expect.anything(Object),
                    expect.anything(Function),
                    expect.anything(Function)
                );
            });

            it('should invoke external callback [::validate] from click on [data-cy="form-action-submit"]', () => {
                const spy = jest.fn();
                const { container } = render(<FormHandler {...props} validate={spy} isValid />);

                fireEvent.click(container.querySelector('[data-cy="form-action-submit"]'));

                expect(spy).toBeCalledWith(props.config);
            });

            it('when external callback [::validate] undefined, state field [::isValid] should be set to true', () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');

                const { container } = render(<FormHandler {...props} isValid />);

                fireEvent.click(container.querySelector('[data-cy="form-action-submit"]'));

                expect(spy).toBeCalledWith({ isValid: true });
            });

            it('when external callback [::validate] return false, state field [::isValid] should be set to false, and [::config] field should get new reference', () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');

                const { container } = render(<FormHandler {...props} isValid validate={() => false} />);

                fireEvent.click(container.querySelector('[data-cy="form-action-submit"]'));

                expect(spy).toBeCalledWith({ config: props.config, isValid: false });
            });
        });

        describe('::onCancel', () => {
            it('should invoke external callback [::onCancel] from click on [data-cy="form-action-cancel"]', () => {
                const spy = jest.fn();
                const { container } = render(<FormHandler {...props} onCancel={spy} />);

                fireEvent.click(container.querySelector('[data-cy="form-action-cancel"]'));

                expect(spy).toBeCalledWith(
                    { ...FormHandler.defaultProps, ...props, onCancel: spy },
                    expect.anything(Object),
                    expect.anything(Function),
                    expect.anything(Function)
                );
            });
        });

        /** functionality relay on data-section attribute */
        describe('::onCollapse', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should mutate state field [::config] and toggle [::isCollapsed] field for relevant section, from click on <Accordion/>', () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');

                const { container } = render(<FormHandler {...props} />);
                fireEvent.click(container.querySelector('[data-section][data-cy="section-0"]'));

                const _config = [{ ...props.config[0], isCollapsed: true }];
                expect(spy).toBeCalledWith({ config: _config });
            });
        });

        /** functionality relay on data-section and data-field attributes */
        describe('::onChange', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should invoke external callback [::validate] with relevant payload', () => {
                const spy = jest.fn();
                props.config[0].isCollapsed = false;

                const { container } = render(<FormHandler {...props} isValid validate={spy} />);

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]'), e);

                expect(spy).toBeCalledWith(props.config, [[0, 0]]);
            });

            it('should mutate state field [::config] and set [::value] for relevant field from payload', () => {
                
                props.config[0].isCollapsed = false;
                props.config[0].items = [
                    {
                        c,
                    },
                    {
                        c,
                    },
                ];

                const { container } = render(<FormHandler {...props} isValid />);

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]'), e);

                expect(props.config).toMatchSnapshot();
            });

            it('should set state field [::isValid] to FALSE, if there is least one error', () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');
                const config = [
                    {
                        isCollapsed: false,
                        items: [
                            {
                                c,
                            },
                            {
                                c,
                                errors: ['error'],
                            },
                        ],
                    },
                ];

                const { container } = render(<FormHandler {...props} config={config} />);

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]'), e);

                expect(spy).toBeCalledWith({ config, isValid: false });
            });

            it('should set state field [::isValid] to TRUE, if there are NO errors', () => {
                const spy = jest.spyOn(FormHandler.prototype, 'setState');
                const config = [
                    {
                        items: [
                            {
                                c,
                            },
                            {
                                c,
                            },
                        ],
                    },
                ];

                const { container } = render(<FormHandler {...props} config={config} />);

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]'), e);

                expect(spy).toBeCalledWith({ config, isValid: true });
            });
        });
    });
});
