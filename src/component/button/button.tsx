import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const Button: React.FC<IButtonProps> = ({ className, label, ...props }) => (
    <button className={classNames(`button`, className)} {...props}>
        {label}
    </button>
);

export default Button;
