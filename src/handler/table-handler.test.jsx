import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TableHandler from './table-handler';

configure({ adapter: new Adapter() });

describe.skip('<TableHandler/>', () => {
    const props = {

    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<TableHandler {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['data-cy', '{{data-cy}}'],
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<TableHandler {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });
    });
});
