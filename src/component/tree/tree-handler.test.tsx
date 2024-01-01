import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import TreeHandler from './tree-handler';

describe('<TreeHandler/>', () => {
    const data = [
        {
            text: 'root node',
            nodes: [
                {
                    text: 'child node 1 - with children',
                    nodes: [
                        {
                            text: 'inner child node',
                        }
                    ]
        
                },
                {
                    text: 'child node 2 - without children',
                }
            ]
        },
    ];

    const props = {
        onFilter: jest.fn(),
        onExpand: jest.fn(),
        data,
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        title: 'optProps.title',
        patternPlaceholder: 'optProps.patternPlaceholder'
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<TreeHandler {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<TreeHandler {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('if node has ::isVisible = false, it should NOT render it', () => {
            const { asFragment } = render(<TreeHandler {...props} data={data.map((v) => ({ ...v, isVisible: false }))} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('internal callbacks', () => {
        /** functionality relay on data-node attribute */
        describe('::onExpand', () => {
            it('should invoke external callback [::onExpand] with [::data] state field and value of ["data-node"] from on a click on [data-cy="tree-node-0"]', () => {
                const spy = jest.fn();
                const { container } = render(<TreeHandler {...props} data={data} onExpand={spy} />);

                fireEvent.click(container.querySelector('[data-cy="tree-node-0"]')!);

                expect(spy).toBeCalledWith(
                    data,
                    "0"
                );
            });

            it('should invoke external callback [::onExpand] with path from ["data-node"] and [::data] state field', () => {
                const spy = jest.fn();
                const { container } = render(<TreeHandler {...props} data={data} onExpand={spy} />);

                fireEvent.click(container.querySelector('section')!);

                expect(spy).not.toBeCalled();
            });
        });

        /** functionality relay on data-section and data-field attributes */
        describe('::onChange', () => {
            it('should invoke external callback [::onFilter] with relevant payload from a change event of [data-cy="tree-pattern"]', () => {
                const spy = jest.fn();
                const { container } = render(<TreeHandler {...props} data={data} onFilter={spy} />);

                fireEvent.change(container.querySelector('[data-cy="tree-pattern"]')!, { target: { value: 'val' } });

                expect(spy).toBeCalledWith(
                    data,
                    "val"
                );
            });
        });
    });
});
