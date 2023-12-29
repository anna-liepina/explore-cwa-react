import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import TreeNode from './tree-node';

describe('<TreeNode/>', () => {
    const props = {
        text: 'props.text',
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        chunks: [
            { v: 't', isMatch: true },
            { v: 'e', isMatch: false },
            { v: 'xt' },
        ],
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<TreeNode {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<TreeNode {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });

        describe('prop combinations', () => {
            [
                [
                    'collapsed with nodes',
                    {
                        isExpanded: false,
                        nodes: [{ text: 'nodes[0].text' }],
                    },
                ],
                [
                    'expanded with NO nodes',
                    {
                        isExpanded: true,
                        nodes: [],
                    },
                ],
                [
                    'expanded with "hidden" nodes',
                    {
                        isExpanded: true,
                        nodes: [{ text: 'nodes[0].text' }],
                    },
                ],
                [
                    'expanded with "visible" nodes',
                    {
                        isExpanded: true,
                        nodes: [{ text: 'nodes[0].text', isVisible: true }],
                    },
                ],
            ].forEach(([desc, propsCombination]) => {
                it(desc, () => {
                    const { asFragment } = render(<TreeNode {...props} {...propsCombination} />);

                    expect(asFragment()).toMatchSnapshot();
                });
            });
        });
    });
});
