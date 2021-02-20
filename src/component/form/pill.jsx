import React from 'react';
import PropTypes from 'prop-types';

const Pill = ({ 'data-cy': cy, label, 'data-id': id }) =>
    <span className="pill" data-cy={cy}>
        {label}
        {undefined !== id && <button data-cy={`${cy}-remove`} data-id={id} className="pill__control">×</button>}
    </span>;

Pill.propTypes = {
    'data-cy': PropTypes.string,
    'data-id': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string.isRequired,
}

Pill.defaultProps = {
    'data-cy': '',
}

export default Pill;
