import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import Form, { IFormSectionConfig } from './form';

describe('<Form/>', () => {
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

    const component = (props: React.ComponentPropsWithRef<'input'>) => <input {...props} />

    const props = {
        config: [
            {
                title: 'props.config[0].title',
                isCollapsed: false,
                items: [
                    {
                        component,
                        value: '',
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
            const { asFragment } = render(<Form {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<Form {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('lifecycle events', () => {
        describe('::componentDidMount', () => {
            it('should invoke external callback [::onMount] as soon as component been mounted', async () => {
                const spy = jest.fn(async () => Promise.resolve({ config: [] }));

                await act(async () => {
                    render(<Form {...props} onMount={spy} />);
                });

                expect(spy).toBeCalledWith(
                    expect.any(Object),
                    expect.any(Object),
                );
            });
        });
    });

    describe('external callbacks', () => {
        describe('::onSuccess', () => {
            it('should invoke external callback [::onSuccess] if external callback [::onMount] succeed', async () => {
                const spy = jest.fn();
                const onMount = jest.fn(async () => Promise.resolve({ config: [] }));

                await act(async () => {
                    render(<Form {...props} onSuccess={spy} onMount={onMount} />);
                });

                expect(spy).toBeCalledWith(
                    expect.any(Object),
                    expect.any(Object)
                );
            });
        });

        describe('::onError', () => {
            it('should invoke external callback [::onError] if external callback [::onMount] fails', async () => {
                const spy = jest.fn();
                const onMount = jest.fn(async () => Promise.reject());

                await act(async() => {
                    render(<Form {...props} onError={spy} onMount={onMount} />);
                });

                expect(spy).toBeCalledWith(
                    expect.any(Object),
                    expect.any(Object),
                );
            });
        });

        describe('::onSubmit', () => {
            it('should NOT invoke external callback [::onSubmit] from click on [data-cy="form--submit"] because ::isValid is falsy', () => {
                const spy = jest.fn();
                const { container } = render(<Form {...props} onSubmit={spy} />);

                fireEvent.click(container.querySelector('[data-cy="form--submit"]')!);

                expect(spy).not.toBeCalled();
            });

            it('should invoke external callback [::onSubmit] from click on [data-cy="form--submit"]', async () => {
                const spy = jest.fn(async () => Promise.resolve({ config: [] }));
                const { container } = render(<Form {...props} onSubmit={spy} isValid />);

                await act(async () => {
                    fireEvent.click(container.querySelector('[data-cy="form--submit"]')!);
                });

                expect(spy).toBeCalledWith(
                    expect.any(Object),
                    expect.any(Object),
                );
            });

            it('should NOT invoke external callback [::onSubmit] from click on [data-cy="form--update"] because ::isValid is falsy', () => {
                const spy = jest.fn();
                const { container } = render(<Form {...props} onSubmit={spy} data={data} />);

                fireEvent.click(container.querySelector('[data-cy="form--update"]')!);

                expect(spy).not.toBeCalled();
            });

            it('should invoke external callback [::onSubmit] from click on [data-cy="form--update"]', async () => {
                const spy = jest.fn(async () => Promise.resolve({ config: [] }));
                const { container } = render(<Form {...props} onSubmit={spy} data={data} isValid />);

                await act(async () => {
                    fireEvent.click(container.querySelector('[data-cy="form--update"]')!);
                });

                expect(spy).toBeCalledWith(
                    expect.any(Object),
                    expect.any(Object),
                );
            });

            it('should invoke external callback [::validate] from click on [data-cy="form--submit"]', () => {
                const spy = jest.fn();
                const { container } = render(<Form {...props} validate={spy} isValid />);

                fireEvent.click(container.querySelector('[data-cy="form--submit"]')!);

                expect(spy).toBeCalledWith(props.config);
            });

            it('when external callback [::validate] return false, should not invoke external callback [::onSubmit]', () => {
                const spy = jest.fn();

                const { container } = render(<Form {...props}  onSubmit={spy} isValid validate={() => false} />);

                fireEvent.click(container.querySelector('[data-cy="form--submit"]')!);

                expect(spy).not.toBeCalled();
            });
        });

        describe('::onCancel', () => {
            it('should invoke external callback [::onCancel] from click on [data-cy="form--cancel"]', () => {
                const spy = jest.fn();
                const { container } = render(<Form {...props} onCancel={spy} />);

                fireEvent.click(container.querySelector('[data-cy="form--cancel"]')!);

                expect(spy).toBeCalledWith(
                    expect.any(Object),
                    expect.any(Object),
                );
            });
        });

        describe('::onCollapse', () => {
            it('from a click on <Accordion/> title, it should toggle ::isCollapsed, if ::isCollapsed truthy do not render <Accordion /> content', () => {
                const { container } = render(<Form {...props} />);

                expect(container.querySelector('[data-cy="section-0-input-0"')!).toBeInTheDocument();

                fireEvent.click(container.querySelector('[data-cy="section-0"]')!);

                expect(container.querySelector('[data-cy="section-0-input-0"')).not.toBeInTheDocument();
            });
        });

        describe('::onChange', () => {
            it('should invoke external callback [::validate] with section/field IDs', () => {
                const spy = jest.fn();
                props.config[0].isCollapsed = false;

                const { container } = render(<Form {...props} isValid validate={spy} />);

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]')!, e);

                expect(spy).toBeCalledWith(props.config, [[0, 0]]);
            });

            it('should mutate state field [::config] and set [::value] for relevant field from payload', () => {
                props.config[0].isCollapsed = false;
                props.config[0].items = [
                    {
                        component,
                        value: '',
                    },
                    {
                        component,
                        value: '',
                    },
                ];

                const { container } = render(<Form {...props} isValid />);

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]')!, e);

                expect(props.config).toMatchSnapshot();
            });

            it('should keep errors if validation engine is NOT provided', () => {
                const config = [
                    {
                        isCollapsed: false,
                        items: [
                            {
                                component,
                                value: '',
                            },
                            {
                                component,
                                value: '',
                                errors: ['{{error}}', '{{ another error }}'],
                            },
                        ],
                    },
                ];

                const { container } = render(<Form {...props} config={config} />);

                expect(container.querySelector('[errors]')!).toBeInTheDocument();

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]')!, e);

                expect(container.querySelector('[errors]')!).toBeInTheDocument();
            });

            it('should NOT keep errors if validation was successful', () => {
                const removeErrors = (config: IFormSectionConfig[]) => {
                    config.forEach((section) => {
                        section.items.forEach((item) => {
                            delete item.errors;
                        })
                    })

                    return true;
                }

                const config = [
                    {
                        isCollapsed: false,
                        items: [
                            {
                                component,
                                value: '',
                            },
                            {
                                component,
                                value: '',
                                errors: ['{{error}}', '{{ another error }}'],
                            },
                        ],
                    },
                ];

                const { container } = render(<Form {...props} validate={removeErrors} config={config} />);

                expect(container.querySelector('[errors]')!).toBeInTheDocument();

                fireEvent.change(container.querySelector('[data-cy="section-0-input-0"]')!, e);

                expect(container.querySelector('[errors]')).not.toBeInTheDocument();
            });
        });
    });
});
