import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import TreeNode from './tree-node';

describe('<TreeNode/>', () => {
    const props = {
        text: '{{text}}',
        'data-cy': '{{data-cy}}',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<TreeNode {...props} />);

            expect(container.querySelector('[data-cy="{{data-cy}}"]')).toBeInTheDocument();
        });
    });
});
