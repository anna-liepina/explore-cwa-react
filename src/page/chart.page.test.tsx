import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ChartPage from './chart.page';
import type { IFormProps } from '../component/form/form';

import Search from '../component/form/search/interactive-search';
import HTMLInput from '../component/form/html-input';

describe('<ChartPage/>', () => {
    const formProps: IFormProps = {
        config: [
            {
                items: [
                    {
                        component: Search,
                        value: [
                            {
                                label: "East Village: E20",
                                value: "E20",
                            }
                        ],
                        onFilter: () => [],
                    },
                    {
                        component: HTMLInput,
                        value: ((d) => d.toJSON().split('T')[0])(new Date(0)),
                    },
                    {
                        component: HTMLInput,
                        value: ((d) => d.toJSON().split('T')[0])(new Date(2024, 0, 1)),
                    },
                ]
            }
        ] 
    };

    const props = {
        form: formProps
    };

    const optionalProps = {
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<ChartPage {...props} />);

            expect(container.querySelector('svg')).toBeInTheDocument();
        });

        it('with optional/required props', () => {
            const { container } = render(<ChartPage {...props} {...optionalProps} />);

            expect(container.querySelector('svg')).toBeInTheDocument()
        });
    });
});
