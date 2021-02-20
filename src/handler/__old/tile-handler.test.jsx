import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TileHandler from './tile-handler';

configure({ adapter: new Adapter() });

describe('<TileHandler/>', () => {
    const props = {
        onFilter: jest.fn((v) => v),
        data: [
            {
                id: 1,
            },
        ],
    };

    describe('render', () => {
        it('with default/require d props', () => {
            const c = shallow(<TileHandler {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['className', '{{className}}'],
                ['data-cy', '{{data-cy}}'], /** should be passed 'as is' */
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<TileHandler {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });
    });

    describe('internal callbacks', () => {
        describe('::onChange', () => {
            it('should be invoked from a change on a [data-cy="-pattern"]', () => {
                const spy = spyOn(TileHandler.prototype, 'onChange');

                shallow(<TileHandler {...props} />)
                    .find('[data-cy="-pattern"]')
                    .simulate('change', { target: { value: 'v' } });

                expect(spy).toBeCalled();
            });

            it('should invoke external callback ::onChange', () => {
                const spy = jest.fn(({ data: v }) => v);

                shallow(<TileHandler {...props} onFilter={spy} />)
                    .find('[data-cy="-pattern"]')
                    .simulate('change', { target: { value: 'v' } });

                expect(spy).toBeCalled();
            });
        });
    });
});
