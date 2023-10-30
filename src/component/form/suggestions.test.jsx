import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Suggestions from './suggestions';

describe('<Suggestions/>', () => {
    const props = {
        options: [
            {
                label: 'props.label 1',
                value: 1,
            },
            {
                label: 'props.label 2 with hierarchy',
                hierarchy: ['{{root}}', '{{sub-children}}', '{{label-with-hierarchy}}'],
                value: 2,
            },
            {
                label: 'props.label 3 with description',
                description: '{{description}}',
                value: 'three',
            },
        ],
    };
    const optionalProps = {
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment, debug } = render(<Suggestions {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props', () => {
            const { asFragment } = render(<Suggestions {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });

        describe('specific optional props', () => {
            it(`[::hashmap] - should NOT render options with values which are present in ::hashmap`, () => {
                const { asFragment } = render(<Suggestions {...props} hashmap={{ 2: true, three: true }} />);
    
                expect(asFragment()).toMatchSnapshot();
            });    
        })
    });
});
