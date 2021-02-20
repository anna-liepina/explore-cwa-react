import React from 'react';
import PropTypes from 'prop-types';

const Suggestions = ({ 'data-cy': cy, className, onClick, options, hashmap }) =>
    <div className={`suggestions ${className}`} onClick={onClick} >
        {
            options.map(({ className, hierarchy, label, description, value: v }, i) =>
                !(hashmap && hashmap[v]) &&
                <div key={i} data-cy={`${cy}-suggestion-${i}`} data-id={i} className={`suggestion ${className}`}>
                    {
                        hierarchy &&
                        !!hierarchy.length &&
                        <div className="suggestion__hierarchy">
                            {
                                hierarchy.map((label, i) =>
                                    <span
                                        key={i}
                                        data-id={i}
                                        className={`suggestion__hierarchy-label ${className}`}
                                    >
                                        {label}
                                    </span>
                                )
                            }
                        </div>
                    }
                    <div className="suggestion__label" data-id={i}>{label}</div>
                    {description && <p className="suggestion__description" data-id={i}>{description}</p>}
                </div>
            )
        }
    </div>;

Suggestions.propTypes = {
    'data-cy': PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            hierarchy: PropTypes.arrayOf(PropTypes.string),
            label: PropTypes.string.isRequired,
            description: PropTypes.string,
        })
    ).isRequired,
    /** hashmap of values, to skip rendering option if it present in hashmap */
    hashmap: PropTypes.object,
}

Suggestions.defaultProps = {
    'data-cy': '',
    className: ''
}

export default Suggestions;
