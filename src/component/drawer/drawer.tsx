import React, { useState, useEffect, KeyboardEvent } from 'react';
import type { IQAProps } from '../../utils/commonTypes';
import classNames from 'classnames';

interface IDrawerProps extends IQAProps {
    className?: string;
    timeout?: number;
    onClose: () => void;
    children: React.ReactNode;
}

const Drawer: React.FC<IDrawerProps> = ({
    'data-cy': cy = '',
    className,
    timeout = 250,
    onClose,
    children
}) => {
    const [isOpen, setOpen] = useState(true);

    useEffect(() => {
        setTimeout(() => setOpen(true), timeout);

        const onKeyPress = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                setOpen(false);

                setTimeout(onClose, timeout);
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
            <aside
                data-cy={`${cy}--drawer`}
                style={{ transitionDuration: `${timeout / 1000}s` }}
                className={classNames(className, { drawer: !isOpen, 'drawer--open': isOpen })}
            >
                <header className="drawer_head">
                    <button
                        className="drawer_button--close"
                        data-cy={`${cy}--drawer--close`}
                        onClick={handleOnClose}
                    >
                        ×
                    </button>
                </header>
                <section className="drawer_content">
                    {children}
                </section>
            </aside>
        </div>
    );
};

export default Drawer;
