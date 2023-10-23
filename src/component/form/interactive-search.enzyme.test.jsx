import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PureInteractiveSearch as InteractiveSearch, executeOnChange } from './interactive-search';

configure({ adapter: new Adapter() });

describe('<InteractiveSearch/>', () => {
    const props = {
        onChange: () => { },
        onFilter: () => { },
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<InteractiveSearch {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['data-cy', '{{data-cy}}'],
                ['className', '{{className}}'],
                ['placeholder', '{{placeholder}}'],
                ['maxValues', 1],
                ['onSuccess', () => { }],
                ['onError', () => { }],
                ['value', [{ value: 1, label: '{{label}}' }]],
                ['options', [{ value: 1, label: '{{label}}' }]],
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<InteractiveSearch {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });
    });

    describe('external callbacks', () => {
        describe('::onSuccess', () => {
            it(`should be invoked from internal callback ::onSuccess with component's props and state as payload`, () => {
                const spy = jest.fn();
                const c = shallow(<InteractiveSearch {...props} onSuccess={spy} />);
                c.instance().onSuccess([]);

                expect(spy).toBeCalledWith(c.instance().props, c.state());
            });
        });

        describe('::onError', () => {
            it(`should be invoked from internal callback ::onError with component's props and state as payload`, () => {
                const spy = jest.fn();
                const c = shallow(<InteractiveSearch {...props} onError={spy} />);
                c.instance().onError([]);

                expect(spy).toBeCalledWith(c.instance().props, c.state());
            });
        });

        describe('::onFilter', () => {
            it('should be executed as deferred callback with deferred time from ::onFilterTimer prop', () => {
                jest.useFakeTimers();

                const spy = jest.fn();
                const value = 'v';

                const c = shallow(<InteractiveSearch {...props} onFilter={spy} onFilterTimer={0} />);

                c
                    .find('InputWithPills')
                    .simulate('change', { target: { value } });

                jest.runAllTimers();

                expect(spy).toBeCalledWith(c.instance().props, c.state(), c.instance().onSuccess, c.instance().onError);
            });
        });

        describe('::onChange', () => {
            it('should be invoked from internal callback ::onChange with new value, from a <Suggestions/> click event', () => {
                const spy = jest.spyOn(props, 'onChange');

                shallow(<InteractiveSearch {...props} value={[{ value: 2, label: '2' }]} maxValues={2} />)
                    .setState({ isExpanded: true, options: [{ label: '1', value: 1 }] })
                    .find('Suggestions')
                    .simulate('click', {
                        preventDefault: () => { },
                        stopPropagation: () => { },
                        target: {
                            getAttribute: () => 0,
                        }
                    });

                expect(spy).toBeCalled();
            });

            it('should be invoked from internal callback ::onRemoveOption with new value, from a <InputWithPills/> click event', () => {
                const spy = jest.spyOn(props, 'onChange');

                shallow(<InteractiveSearch {...props} value={[{ value: 2, label: '2' }]} maxValues={2} />)
                    .find('InputWithPills')
                    .simulate('click', {
                        preventDefault: () => { },
                        stopPropagation: () => { },
                        target: {
                            getAttribute: () => 0,
                        }
                    });

                expect(spy).toBeCalled();
            });
        });
    });

    describe('internal callbacks', () => {
        describe('::onMouseEnter', () => {
            it('should be invoked from a "onMouseEnter" event on <div/> wrapper, and set internal state field ::isExpanded to true', () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'setState');

                shallow(<InteractiveSearch {...props} />)
                    .find('div[onMouseEnter]')
                    .simulate('mouseEnter');

                expect(spy).toBeCalledWith({ isExpanded: true });
            });
        });

        describe('::onMouseLeave', () => {
            it('should be invoked from a "onMouseLeave" event on <div/> wrapper, and set internal state field ::isExpanded to false', () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'setState');

                shallow(<InteractiveSearch {...props} />)
                    .find('div[onMouseLeave]')
                    .simulate('mouseLeave');

                expect(spy).toBeCalledWith({ isExpanded: false });
            });
        });

        describe('::onKeyDown', () => {
            it('should be invoked from a <InputWithPills/> ::onChange event', () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'onKeyDown');

                shallow(<InteractiveSearch {...props} />)
                    .find('InputWithPills')
                    .simulate('change');

                expect(spy).toBeCalled();
            });

            it(`should set internal state field ::pattern from payload's ::value field`, () => {
                const spy = jest.spyOn(InteractiveSearch.prototype, 'setState');
                const value = 'v';

                shallow(<InteractiveSearch {...props} />)
                    .find('InputWithPills')
                    .simulate('change', { target: { value } });

                expect(spy).toBeCalledWith({ pattern: value });
            });

            it('should defer external callback ::onFilter execution by time from ::onFilterTimer prop', () => {
                jest.useFakeTimers();

                const spy = jest.fn();
                const value = 'v';

                const c = shallow(<InteractiveSearch {...props} onFilter={spy} />);

                c
                    .find('InputWithPills')
                    .simulate('change', { target: { value } });

                expect(setTimeout).toBeCalledWith(expect.any(Function), c.instance().props['onFilterTimer']);
            });

            it('should clear previously deferred ::onFilter callback, if it been set', () => {
                jest.useFakeTimers();

                const spy = jest.fn();
                const value = 'v';

                const c = shallow(<InteractiveSearch {...props} onFilter={spy} />);

                c.instance().deferredCallback = 1;

                c
                    .find('InputWithPills')
                    .simulate('change', { target: { value } });

                expect(clearTimeout).toBeCalledWith(c.instance().deferredCallback);
            });
        });
    });

    describe('::onChange', () => {
        it('should be invoked from a <Suggestions/> ::onClick event', () => {
            const spy = jest.spyOn(InteractiveSearch.prototype, 'onChange');

            shallow(<InteractiveSearch {...props} />)
                .setState({ isExpanded: true, options: [{ label: '1', value: 1 }] })
                .find('Suggestions')
                .simulate('click');

            expect(spy).toBeCalled();
        });

        it(`should NOT call external callback ::onChange if "data-id" attribute is NOT present in target`, () => {
            const spy = jest.spyOn(props, 'onChange');

            shallow(<InteractiveSearch {...props} />)
                .setState({ isExpanded: true, options: [{ label: '1', value: 1 }] })
                .find('Suggestions')
                .simulate('click', {
                    preventDefault: () => { },
                    stopPropagation: () => { },
                    target: {
                        getAttribute: () => null,
                    }
                });

            expect(spy).not.toBeCalled();
        });

        it(`should NOT call external callback ::onChange if ::value has already max or more options than allowed by ::maxValues prop`, () => {
            const spy = jest.spyOn(props, 'onChange');

            shallow(<InteractiveSearch {...props} value={[{ value: 1, label: '1' }]} maxValues={1} />)
                .setState({ isExpanded: true, options: [{ label: '1', value: 1 }] })
                .find('Suggestions')
                .simulate('click', {
                    preventDefault: () => { },
                    stopPropagation: () => { },
                    target: {
                        getAttribute: () => 1,
                    }
                });

            expect(spy).not.toBeCalled();
        });
    });

    describe('::onRemoveOption', () => {
        it('should be invoked from a <InputWithPills/> ::onClick event', () => {
            const spy = jest.spyOn(InteractiveSearch.prototype, 'onRemoveOption');

            shallow(<InteractiveSearch {...props} />)
                .find('InputWithPills')
                .simulate('click');

            expect(spy).toBeCalled();
        });

        it(`should NOT call external callback ::onChange if "data-id" attribute is NOT present in target`, () => {
            const spy = jest.spyOn(props, 'onChange');

            shallow(<InteractiveSearch {...props} />)
                // .setState({ isExpanded: true })
                .find('InputWithPills')
                .simulate('click', {
                    preventDefault: () => { },
                    stopPropagation: () => { },
                    target: {
                        getAttribute: () => null,
                    }
                });

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
