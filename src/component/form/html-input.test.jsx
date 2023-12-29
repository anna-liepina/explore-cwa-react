import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { PureHTMLInput as HTMLInput } from './html-input';

describe('<HTMLInput/>', () => {
    const props = {
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        value: 'optProps.value',
        onChange: jest.fn(),
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<HTMLInput {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<HTMLInput {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
