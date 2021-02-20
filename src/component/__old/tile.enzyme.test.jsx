import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tile from './tile';

configure({ adapter: new Adapter() });

describe('<Tile/>', () => {
    const props = {
        to: '//example.com',
    };

    describe('render', () => {
        it('with default/require d props', () => {
            const c = shallow(<Tile {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            test.each`
                prop            | v
                ${'className'}  | ${'{{className}}'}
                ${'data-cy'}    | ${'{{data-cy}}'}
            `(`[::$prop] as "$v"`, ({ prop, v }) => {
                const c = shallow(<Tile {...props} {...{ [prop]: v }} />);

                expect(c).toMatchSnapshot();
            });
        });
    });
});
