import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Pill from './pill';

configure({ adapter: new Adapter() });

describe('<Pill/>', () => {
    const props = {
        label: '{{label}}',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<Pill {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['data-cy', '{{data-cy}}'],
                ['data-id', '{{data-id}}'],
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<Pill {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });
    });
});
