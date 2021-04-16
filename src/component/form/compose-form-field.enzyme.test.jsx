import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import compose from './compose-form-field';

configure({ adapter: new Adapter() });

const FormField = compose((props) => <input {...props} />);

describe('<FormField/>', () => {
    const props = {
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<FormField {...props} />);

            expect(c).toMatchSnapshot();
        });

        describe('with optional props', () => {
            [
                ['errors', ['{{error}}']],
            ].forEach(([prop, v]) => {
                it(`[::${prop}] as "${v}"`, () => {
                    const c = shallow(<FormField {...props} {...{ [prop]: v }} />);

                    expect(c).toMatchSnapshot();
                });
            });
        });
    });
});
