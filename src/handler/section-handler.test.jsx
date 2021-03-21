import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe.skip('<TreeHandler/>', () => {
    const data = [
        {
            text: 'root',
            nodes: [
                {
                    text: 'children',
                }
            ]
        },
    ];
    const props = {
        onFilter: jest.fn(),
        onExpand: jest.fn(),
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<TreeHandler {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['title', '{{title}}'],
                ['data-cy', '{{data-cy}}'],
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<TreeHandler {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });

            it('if node has isVisible property as false, it should NOT render it', () => {
                const c = shallow(<TreeHandler {...props} data={data.map((v) => ({ ...v, isVisible: false }))} />);

                expect(c).toMatchSnapshot();
            });
        });
    });

    describe('internal callbacks', () => {

    });
});
