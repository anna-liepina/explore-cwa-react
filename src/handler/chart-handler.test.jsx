import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ChartHandler from './chart-handler';

configure({ adapter: new Adapter() });

describe.skip('<ChartHandler/>', () => {
    const props = {

    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<ChartHandler {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['data-cy', '{{data-cy}}'],
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<ChartHandler {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });
    });
});
