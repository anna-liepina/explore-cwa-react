import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Accordion from './accordion';

describe('<Accordion/>', () => {
    const props = {
    };

    const optionalProps = {
        /** should be passed 'as is' */
        'data-cy': 'optProps.data-cy',
        className: 'optProps.className',
        label: 'optProps.label',
        errors: ['optProps.errors[0]', 'optProps.errors[1]'],
        isCollapsed: true,
        children: <div className="optionalProps.children" />
    };

    const expandedlProps = {
        ...optionalProps,
        isCollapsed: false,
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { asFragment } = render(<Accordion {...props} />);

            expect(asFragment()).toMatchSnapshot();
        });

        it('with optional/required props - collapsed', () => {
            const { asFragment } = render(<Accordion {...props} {...optionalProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
        it('with optional/required props - expanded', () => {
            const { asFragment } = render(<Accordion {...props} {...expandedlProps} />);

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
