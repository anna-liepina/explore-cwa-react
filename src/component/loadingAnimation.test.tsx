import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import type { ILoadingAnimationProps } from './loadingAnimation';
import LoadingAnimation from './loadingAnimation';

describe('<LoadingAnimation/>', () => {
    const props: ILoadingAnimationProps = {
    };

    const optionalProps: Partial<ILoadingAnimationProps> = {
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
