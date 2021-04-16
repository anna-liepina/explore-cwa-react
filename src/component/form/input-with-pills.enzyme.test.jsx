import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InputWithPills from './input-with-pills';

configure({ adapter: new Adapter() });

describe('<InputWithPills/>', () => {
    const props = {
        value: [
            {
                label: '{{label}}',
            }
        ]
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<InputWithPills {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['data-cy', '{{data-cy}}'],
                ['onClick', () => {}],
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<InputWithPills {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });
    });
});
