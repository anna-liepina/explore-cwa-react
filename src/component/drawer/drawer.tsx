import React, { useState, useEffect, KeyboardEvent } from 'react';
import type { IQAProps } from '../../utils/commonTypes';

interface IDrawerProps extends IQAProps {
    className?: string;
    timeout?: number;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Drawer: React.FC<IDrawerProps> = ({ 'data-cy': cy = '', className = '', isOpen: _isOpen, timeout = 250, onClose, children }) => {
    const [isOpen, setOpen] = useState(_isOpen);

    useEffect(() => {
        setTimeout(() => setOpen(true), timeout);

        const onKeyPress = (event: KeyboardEvent): void => {
            switch (event.key) {
                default:
                    return;
                case 'Escape':
                    setOpen(false);

                    setTimeout(onClose, timeout);
                    return;
            }
        };

        document.addEventListener('keydown', onKeyPress as any, false);

        return () => {
            document.removeEventListener('keydown', onKeyPress as any, false);
        }
    }, [timeout, onClose]);

    const handleOnClose = () => {
        setOpen(false);

        setTimeout(onClose, timeout);
    };

    return (
        <div className="drawer_overlay">
            <nav
                className={`drawer${isOpen ? '--open' : ''} ${className}`}
                data-cy={`${cy}--drawer`}
                style={{ transitionDuration: `${timeout / 1000}s` }}
            >
                <div className="drawer_head">
                    <button
                        className="drawer_button--close"
                        data-cy={`${cy}--drawer--close`}
                        onClick={handleOnClose}
                    >
                        ×
                    </button>
                </div>
                <div className="drawer_content">{children}</div>
            </nav>
        </div>
    );
};

export default Drawer;
