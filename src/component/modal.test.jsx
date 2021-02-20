import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Modal from './modal';

describe('<Modal/>', () => {
    const props = {
        onClose: jest.fn(),
    };

    describe('render', () => {
        it('with default/required props', () => {
            const { container } = render(<Modal {...props} />);

            expect(container.querySelector('[data-cy="-modal-close"]')).toBeInTheDocument();
        });
    });

    describe('callbacks', () => {
        describe('onClose', () => {
            const { container } = render(<Modal {...props} />);

            fireEvent.click(container.querySelector('[data-cy="-modal-close"]'));

            expect(props.onClose).toBeCalled();
        });
    });
});
