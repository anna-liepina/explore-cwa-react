import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PureHTMLInput as HTMLInput } from './html-input';

configure({ adapter: new Adapter() });

describe('<HTMLInput/>', () => {
    const props = {
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<HTMLInput {...props} />);

            expect(c).toMatchSnapshot();
        });
    });
});
