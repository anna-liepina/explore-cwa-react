import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Drawer = ({ 'data-cy': cy, isOpen, timeout = 300, className, onClose, children }) => {
    const [_isOpen, setOpen] = useState(isOpen);

    useEffect(
        () => {
            document.addEventListener("keydown", onKeyPress, false);
            setTimeout(setOpen.bind(this, true), timeout);

            return () => {
                document.removeEventListener("keydown", onKeyPress, false);
            }
        },
        [timeout]
    )

    const onKeyPress = (event) => {
        switch (event.key) {
            default:
                return;
            case 'Escape':
                handleOnClose();
                break;
        }
    }

    const handleOnClose = (e) => {
        setOpen(false);

        setTimeout(onClose, timeout);
    }

    return <div className="drawer_overlay">
        <nav
            className={`drawer${_isOpen ? '--open' : ''} ${className}`}
            data-cy={`${cy}--drawer`}
            style={{ transition: `width ${timeout / 1000}s` }}
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
