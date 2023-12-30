import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import compose from './compose-form-field';
import { PureHTMLInput } from './html-input';

const FormField = compose(PureHTMLInput);

describe('<FormField/>', () => {
    const props = {
    };

    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        label: 'optProps.label',
        errors: ['optProps.errors[0]', 'optProps.errors[1]'],
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<FormField {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<FormField {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
