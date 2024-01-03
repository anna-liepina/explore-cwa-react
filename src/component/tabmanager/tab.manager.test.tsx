import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import TabManager from './tab.manager';

describe('<TabManager/>', () => {
    const component: React.FC = (props) => <span {...props} />
    const props = {
        tabs: [
            {
                label: 'tab 0',
                component,
                props: {
                    'data-cy': 'cy0',
                    className: `tab--active`
                }
            },
            {
                label: 'tab 1',
                component,
                props: {
                    'data-cy': 'cy1',
                    className: `tab`
                }
            },
        ],
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<TabManager {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with default/required props with preset tabId', () => {
            const { asFragment } = render(<TabManager {...props} tabId={1} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('external callbacks', () => {
        describe('onChange', () => {
            it('should be invoked from a click on a tab [data-cy="tab-$ID"]', () => {
                const spy = jest.fn();
                const { container } = render(<TabManager {...props} onChange={spy} />);

                fireEvent.click(container.querySelector('[data-cy="tab-1"]')!);

                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
