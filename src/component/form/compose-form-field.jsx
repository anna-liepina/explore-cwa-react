import React from 'react';
import PropTypes from 'prop-types';

export default (Component) => {
    const ComposedFormField = ({ 'data-cy': cy, className, label, errors, validators, ...props }) =>
        <label className={`form-input_label ${className}`}>
            {label}
            <Component {...props} data-cy={cy} />
            {
                errors &&
                !!errors.length &&
                <ul className="form-input_errors">
                    {
                        errors.map((v, i) =>
                            <li
                                key={i}
                                data-cy={`${cy}-error-${i}`}
                                className="form-input_error"
                            >
                                {v}
                            </li>
                        )
                    }
                </ul>
            }
        </label>;

    ComposedFormField.propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        label: PropTypes.string,
        errors: PropTypes.arrayOf(PropTypes.string),
    };
    ComposedFormField.defaultProps = {
        'data-cy': '',
        className: '',
    };

    return ComposedFormField;
}
