import React from 'react';
import '@testing-library/jest-dom';
;import { render } from '@testing-library/react';
import Button from './button';

describe('<Button/>', () => {
    const props = {
        label: '{{label}}',
        'data-cy': '{{data-cy}}',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<Button {...props} />);

            expect(container.querySelector('[data-cy="{{data-cy}}"]')).toBeInTheDocument();
        });
    });
});
