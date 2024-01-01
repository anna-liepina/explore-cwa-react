import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import type { IQueryAnimationProps } from './queryAnimation';
import LoadingAnimation from './queryAnimation';

describe('<LoadingAnimation/>', () => {
    const props: IQueryAnimationProps = {
    };

    const optionalProps: Partial<IQueryAnimationProps> = {
        'data-cy': '{{data-cy}}',
    };

    describe('render', () => {
        it('with required/default props', () => {
            const { asFragment } = render(<LoadingAnimation {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<LoadingAnimation {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
