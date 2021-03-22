import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import withModal from './with-modal';

const { WrappedComponent: WithModal } = withModal(() => <div className="{{wrappedComponent}}" />);

configure({ adapter: new Adapter() });

describe('<WithModal/> as HOC', () => {
    const props = {
        location: {},
        history: {
            goBack: jest.fn(),
        },
        'data-cy': '{{data-cy}}', //should be passed "as is",
        modals: [
            {
                path: ['/explore/:id'],
                component: (props) => <div className="{{modal}}" />,
            },
        ],
    };

    describe('render', () => {
        it('with default/required props', () => {
            const c = shallow(<WithModal {...props} />);

            expect(c).toMatchSnapshot();
        });

        it('with location.state.isModal as true', () => {
            const c = shallow(<WithModal {...props} location={{ state: { isModal: true } }} />);

            expect(c).toMatchSnapshot();
        });
    });
});
