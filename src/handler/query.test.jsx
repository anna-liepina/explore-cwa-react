import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Query from './query';

configure({ adapter: new Adapter() });

describe('<Query/>', () => {
    const props = {
        onMount: () => true,
        children: () => <div />
    };

    describe('render', () => {
        it('with required/default props', () => {
            const c = shallow(<Query {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['data-cy', '{{data-cy}}'],
            ].forEach(([prop, v]) => {
                it(`::${prop} as "${v}"`, () => {
                    const c = shallow(<Query {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });

        describe('children render [render props approach]', () => {
            it('if internal state field [::isLoading] is true, it should call children with arguments [props, internal state]', () => {
                const spy = spyOn(props, 'children');

                const c = shallow(<Query {...props} onMount={(_, __, onSuccess, onError) => onSuccess()} />);

                expect(spy).toBeCalledWith(c.instance().props, c.state());
            });
        });
    });

    describe('lifecycles events', () => {
        describe('::componentDidMount', () => {
            it('should invoke external callback [::onMount]', () => {
                const spy = spyOn(props, 'onMount');

                const c = shallow(<Query {...props} />);

                expect(spy).toBeCalledWith(c.instance().props, c.state(), c.instance().onSuccess, c.instance().onError);
            });
        });
    });

    describe('internal callbacks', () => {
        describe('::onSuccess', () => {
            it('should set internal state field [::isLoading] to false, reset [::errors] and [::data] from payload', () => {
                const spy = spyOn(Query.prototype, 'setState');

                const c = shallow(<Query {...props} />);
                const data = [
                    {
                        src: 'src0',
                    },
                    {
                        src: 'src1',
                    }
                ];

                c.instance().onSuccess(data);

                expect(spy).toBeCalledWith({ data, errors: undefined, isLoading: false });
            });

            it('should invoke external callback ::onSuccess, if it provided with props/state as payload', () => {
                const spy = jest.fn();

                const c = shallow(<Query {...props} onSuccess={spy} />);
                c.instance().onSuccess([]);

                expect(spy).toBeCalledWith(c.instance().props, c.state());
            });
        });


        describe('::onError', () => {
            it('should set internal state field [::isLoading] to false, reset [::data] and [::errors] from payload', () => {
                const spy = spyOn(Query.prototype, 'setState');

                const c = shallow(<Query {...props} />);
                const errors = [
                    'error 0',
                ];

                c.instance().onError(errors);

                expect(spy).toBeCalledWith({ data: undefined, errors, isLoading: false });
            });

            it('should invoke external callback ::onError, if it provided with props/state as payload', () => {
                const spy = jest.fn();

                const c = shallow(<Query {...props} onError={spy} />);
                c.instance().onError([]);

                expect(spy).toBeCalledWith(c.instance().props, c.state());
            });
        });
    });
});
