import React from 'react';
import PropTypes from 'prop-types';
import { PureHTMLInput } from './html-input';
import Pill from './pill';

const InputWithPills = ({ 'data-cy': cy, onClick, value, ...props }) =>
    <div className="input-with-pills" onClick={onClick}>
        {
            value && value.map((props, i) =>
                <Pill
                    key={i}
                    data-cy={`${cy}-pill-${i}`}
                    data-id={onClick && i}
                    {...props}
                />
            )
        }
        <PureHTMLInput {...props} data-cy={cy} className="input-with-pills__input" />
    </div>;

InputWithPills.propTypes = {
    'data-cy': PropTypes.string,
    onClick: PropTypes.func,
    value: PropTypes.array,
}

InputWithPills.defaultProps = {
    'data-cy': '',
}

export default InputWithPills;
