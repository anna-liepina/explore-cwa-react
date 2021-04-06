import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Drawer = ({ 'data-cy': cy, className, isOpen: _isOpen, timeout = 250, onClose, children }) => {
    const [isOpen, setOpen] = useState(_isOpen);

    useEffect(
        () => {
            setTimeout(setOpen.bind(this, true), timeout);

            const onKeyPress = (event) => {
                switch (event.key) {
                    default:
                        return;
                    case 'Escape':
                        setOpen(false);

                        setTimeout(onClose, timeout);
                        return;
                }
            }

            document.addEventListener('keydown', onKeyPress, false);

            return () => {
                document.removeEventListener('keydown', onKeyPress, false);
            }
        },
        [timeout, onClose]
    )

    const handleOnClose = () => {
        setOpen(false);

        setTimeout(onClose, timeout);
    }

    return <div className="drawer_overlay">
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
            <div className="drawer_content">
                {children}
            </div>
        </nav>
    </div>;
}

Drawer.propTypes = {
    'data-cy': PropTypes.string,
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
Drawer.defaultProps = {
    'data-cy': '',
    className: '',
};

export default Drawer;
