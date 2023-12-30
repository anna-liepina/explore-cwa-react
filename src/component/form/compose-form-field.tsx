import React from 'react';
import classNames from 'classnames';
import type { IQAProps } from '../../utils/commonTypes';

export interface IFormFieldProps extends IQAProps {
    className?: string;
    label?: string;
    errors?: string[];
}

const compose = (Component: React.ComponentType<IFormFieldProps>) => {
    const FormField: React.FC<IFormFieldProps> = ({
        'data-cy': cy,
        className,
        label,
        errors,
        ...props
    }) => (
        <label className={classNames(`form-input_label`, className)}>
            {label}
            <Component {...props} data-cy={cy} />
            {
                Array.isArray(errors)
                && !!errors.length
                && <ul className="form-input_errors">
                {
                    errors.map((v, i) => <li key={i} data-cy={`${cy}-error-${i}`} className="form-input_error">{v}</li>)
                }
                </ul>
            }
        </label>
    );

  return FormField;
};

export default compose;
