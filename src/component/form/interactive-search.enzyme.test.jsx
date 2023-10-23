import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';

import { PureInteractiveSearch as InteractiveSearch, executeOnChange } from './interactive-search';

describe('<InteractiveSearch/>', () => {
    const props = {
        onChange: jest.fn(),
        onFilter: jest.fn(),
    };

    const options = [
        { label: 'label 1', value: 1 },
        { label: 'label 2', value: 2 },
        { label: 'label 3', value: 3 },
    ];

    const optionalProps = {
        'data-cy': '{{data-cy}}',
        className: '{{className}}',
        placeholder: '{{placeholder}}',
        maxValues: 1,
        onSuccess: jest.fn(),
        onError: jest.fn(),
        value: [{ value: 1, label: '{{label}}' }],
        options: [{ value: 1, label: '{{label}}' }],
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<InteractiveSearch {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<InteractiveSearch {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
    
    describe('external callbacks', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.clearAllTimers();
            jest.restoreAllMocks();
        });

        describe('::onSuccess', () => {
            it(`should be invoked from internal callback ::onSuccess with component's props and state as payload`, () => {
                const spy = jest.fn();
                const onFilter = (props, state, onSuccess, onError) => {
                    onSuccess();
                };
                const { container } = render(<InteractiveSearch {...props} onFilter={onFilter} onSuccess={spy} />);

                act(() => {
                    fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value: 'y' } });
                    jest.advanceTimersByTime(InteractiveSearch.defaultProps.onFilterTimer);
                });

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toBeCalledWith(
                    { ...InteractiveSearch.defaultProps, ...props, onFilter, onSuccess: spy },
                    {
                        isExpanded: undefined,
                        options: undefined,
                        pattern: "y"
                    }
                );
            });
        });

        describe.skip('::onError', () => {
            it(`should be invoked from internal callback ::onError with component's props and state as payload`, () => {
                const spy = jest.fn();
                const onFilter = (props, state, onSuccess, onError) => {
                    onError();
                };
                const { container } = render(<InteractiveSearch {...props} onFilter={onFilter} onError={spy} />);

                act(() => {
                    fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value: 'y' } });
                    jest.advanceTimersByTime(InteractiveSearch.defaultProps.onFilterTimer);
                });

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toBeCalledWith(
                    { ...InteractiveSearch.defaultProps, ...props, onFilter, onError: spy },
                    {
                        isExpanded: undefined,
                        options: [],
                        pattern: "y"
                    }
                );
            });
        });

        describe.skip('::onFilter', () => {
            it('should be executed as deferred callback with deferred time from ::onFilterTimer prop', () => {
                const spy = jest.fn();
                const { container } = render(<InteractiveSearch {...props} onFilter={spy} />);

                act(() => {
                    fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value: 'y' } });
                    jest.advanceTimersByTime(InteractiveSearch.defaultProps.onFilterTimer);
                });

                expect(spy).toBeCalledWith(
                    { ...InteractiveSearch.defaultProps, ...props, onFilter: spy },
                    {
                        isExpanded: undefined,
                        options: undefined,
                        pattern: "y"
                    },
                    expect.anything(Function),
                    expect.anything(Function),
                );
            });
        });

        describe('::onChange', () => {
            it('should be invoked from internal callback ::onChange with new value, from a <Suggestions/> click event', () => {
                const spy = jest.spyOn(props, 'onChange');

                const { container } = render(
                    <InteractiveSearch
                        {...props} 
                        isExpanded
                        value={[ options[0] ]}
                        options={options}
                        maxValues={2}
                    />
                );

                fireEvent.click(container.querySelector(['[data-cy="-suggestion-1"]']))

                expect(spy).toBeCalledWith({
                    target: {
                        getAttribute: expect.anything(Function),
                        value: [
                            options[0],
                            options[1],
                        ]
                    }
                });
            });

            it('should be invoked from internal callback ::onRemoveOption with new value, from a <InputWithPills/> click event', () => {
                const spy = jest.spyOn(props, 'onChange');

                const { container } = render(
                    <InteractiveSearch
                        {...props} 
                        isExpanded
                        value={[ options[0] ]}
                        options={options}
                        maxValues={2}
                    />
                );

                fireEvent.click(container.querySelector(['[data-cy="-input-pill-0-remove"]']))

                expect(spy).toBeCalledWith({
                    target: {
                        getAttribute: expect.anything(Function),
                        value: []
                    }
                });
            });
        });
    });

    describe('internal callbacks', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.clearAllTimers();
            jest.restoreAllMocks();
        });

        describe('::onMouseEnter', () => {
            it('should be invoked from a "onMouseEnter" event on <div/> wrapper, and set internal state field ::isExpanded to true', () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'setState');

                const { container } = render(<InteractiveSearch {...props} />);
                fireEvent.mouseEnter(container.querySelector('[data-cy="-wrapper"]'));

                expect(spy).toBeCalledWith({ isExpanded: true });
            });
        });

        describe('::onMouseLeave', () => {
            it('should be invoked from a "onMouseLeave" event on <div/> wrapper, and set internal state field ::isExpanded to false', () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'setState');

                const { container } = render(<InteractiveSearch {...props} />)
                fireEvent.mouseLeave(container.querySelector('[data-cy="-wrapper"]'));

                expect(spy).toBeCalledWith({ isExpanded: false });
            });
        });

        describe('::onKeyDown', () => {
            it('should be invoked from a <InputWithPills/> ::onChange event', () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'onKeyDown');
                const value = 'v';

                const { container } = render(<InteractiveSearch {...props} />);

                act(() => {
                    fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value } });
    
                    jest.runAllTimers();
                });

                expect(spy).toBeCalled();
            });

            it(`should set internal state field ::pattern from payload's ::value field`, () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'setState');
                const value = 'v';
        
                const { container } = render(<InteractiveSearch {...props} />);
        
                act(() => {
                    fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value } });
    
                    jest.runAllTimers();
                });

                expect(spy).toBeCalledWith({ pattern: value }, expect.anything(Function));
            });

            it('should defer external callback ::onFilter execution by time from ::onFilterTimer prop', () => {
                const spy = jest.fn();
                const value = 'v';

                const { container } = render(<InteractiveSearch {...props} onFilter={spy} />);
                
                fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value } });
                expect(spy).not.toBeCalled();

                jest.advanceTimersByTime(InteractiveSearch.defaultProps.onFilterTimer);
                expect(spy).toBeCalledWith(
                    { ...InteractiveSearch.defaultProps, ...props, onFilter: spy },
                    {
                        isExpanded: undefined,
                        options: undefined,
                        pattern: "v",
                    },
                    expect.anything(Function),
                    expect.anything(Function)
                );
            });

            it.skip('should clear previously deferred ::onFilter callback, if it been set', () => {
                const spy = jest.fn();
                const clearTimeout = jest.spyOn(global, 'clearTimeout');

                const { container } = render(<InteractiveSearch {...props} onFilter={spy} />);
                
                act(() => {
                    fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value: 'xxxx' } });
                });
                expect(clearTimeout).not.toBeCalled();
                expect(spy).not.toBeCalled();

                act(() => {
                    fireEvent.change(container.querySelector('[data-cy="-input"]'), { target: { value: 'yxxx' } });
                    jest.advanceTimersByTime(InteractiveSearch.defaultProps.onFilterTimer);
                });

                expect(clearTimeout).toBeCalled();
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toBeCalledWith(
                    { ...InteractiveSearch.defaultProps, ...props, onFilter: spy },
                    {
                        isExpanded: undefined,
                        options: undefined,
                        pattern: "y"
                    },
                    expect.anything(Function),
                    expect.anything(Function),
                );
            });
        });
    });

    describe('::onChange', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        })

        it('should be invoked from a <Suggestions/> ::onClick event', () => {
            const spy = jest.spyOn(InteractiveSearch.prototype, 'onChange');

            const { container } = render(<InteractiveSearch {...props} isExpanded options={[...options]} />);

            fireEvent.click(container.querySelector('[data-cy="-suggestion-0"]'));

            expect(spy).toBeCalled();
        });

        it(`should NOT call external callback ::onChange if "data-id" attribute is NOT present in target`, () => {
            const spy = jest.spyOn(props, 'onChange');

            const { container } = render(<InteractiveSearch {...props} isExpanded options={[...options]} />)

            fireEvent.click(container.querySelector('[data-cy="-input-pill-0"]'));

            expect(spy).not.toBeCalled();
        });

        it(`should NOT call external callback ::onChange if ::value has already max or more options than allowed by ::maxValues prop`, () => {
            const spy = jest.spyOn(props, 'onChange');

            const { container } = render(
                <InteractiveSearch
                    {...props}
                    isExpanded
                    maxValues={1}
                    value={[]}
                    options={[...options]}
                />
            );

            fireEvent.click(container.querySelector('[data-cy="-suggestion-0"]'));
            expect(spy).toBeCalledTimes(1);

            fireEvent.click(container.querySelector('[data-cy="-suggestion-1"]'));
            expect(spy).toBeCalledTimes(1);
        });
    });

    describe('::onRemoveOption', () => {
        it('should be invoked from a <InputWithPills/> ::onClick event', () => {
            const spy = jest.spyOn(InteractiveSearch.prototype, 'onRemoveOption');

            const { container } = render(<InteractiveSearch {...props} value={[{ label: 'label', value: 'x' }]}/>);
            fireEvent.click(container.querySelector('[data-cy="-input-pill-0"]'));


            expect(spy).toBeCalled();
        });

        it(`should NOT call external callback ::onChange if "data-id" attribute is NOT present in target`, () => {
            const spy = jest.spyOn(props, 'onChange');

            const { container } = render(<InteractiveSearch {...props} />);
            fireEvent.click(container.querySelector('[data-cy="-input"]'));

            expect(spy).not.toBeCalled();
        });
    });
});

describe('on change proxy', () => {
    it(`should mock React like HTML execution, with 'data-field', and 'data-section' attributes`, () => {
        let _;

        const props = {
            onChange: (v) => { _ = v},
            'data-field': 0,
            'data-section': 0,
        };

        executeOnChange(props, []);

        expect(_.target.getAttribute('data-field')).toBe(0);
        expect(_.target.getAttribute('data-section')).toBe(0);
    });
})
