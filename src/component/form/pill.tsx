import React from 'react';
import type { IQAProps } from '../../utils/commonTypes';

export interface IPillProps extends IQAProps {
    label: string;
    className?: string;
    'data-id'?: string | number;
}

const Pill: React.FC<IPillProps> = ({ 'data-cy': cy = '', label, 'data-id': id }) => (
    <span className="pill" data-cy={cy}>
        {label}
        {undefined !== id && <button data-cy={`${cy}-remove`} data-id={id} className="pill__control">×</button>}
    </span>
);

export default Pill;
