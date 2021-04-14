import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import TabHandler from './tab-handler';

describe('<TabHandler/>', () => {
    const props = {
        tabs: [
            {
                label: 'tab 0',
                c: (props) => <span className='tab0' {...props} />,
            },
            {
                label: 'tab 1',
                c: (props) => <span className='tab1' {...props} />,
                props: {
                    'data-cy': '{{data-cy}}',
                }
            },
        ],
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<TabHandler {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with default/required props with preset tabId', () => {
            const { asFragment } = render(<TabHandler {...props} tabId={1} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('external callbacks', () => {
        describe('onChange', () => {
            it('should be invoked from a click on a tab [data-cy="tab-$ID"]', () => {
                const spy = jest.fn();
                const { container } = render(<TabHandler {...props} onChange={spy} />);

                fireEvent.click(container.querySelector('[data-cy="tab-1"]'));

                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
