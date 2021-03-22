import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Modal from './modal';

configure({ adapter: new Adapter() });

describe('<Modal/>', () => {
    const props = {
        onClose: jest.fn(),
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<Modal {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            test.each`
                prop            | v
                ${'className'}  | ${'{{className}}'}
                ${'data-cy'}    | ${'{{data-cy}}'}
            `(`[::$prop] as "$v}"`, ({ prop, v }) => {
                const c = shallow(<Modal {...props} {...{ [prop]: v }} />);

                expect(c).toMatchSnapshot();
            });
        });
    });
});
