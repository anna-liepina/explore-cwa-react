import React, { ButtonHTMLAttributes } from 'react';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const Button: React.FC<IButtonProps> = ({ className = '', label, ...props }) => (
    <button className={`button ${className}`} {...props}>
        {label}
    </button>
);

export default Button;
