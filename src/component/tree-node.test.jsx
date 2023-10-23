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
    });
});
