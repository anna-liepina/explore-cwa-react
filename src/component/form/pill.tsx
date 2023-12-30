import React from 'react';
import classNames from 'classnames';
import type { IQAProps } from '../../utils/commonTypes';

export interface IPillProps extends IQAProps {
    label: string;
    className?: string;
    'data-id'?: string | number;
}

const Pill: React.FC<IPillProps> = ({ 'data-cy': cy = '', label, className, 'data-id': id }) => (
    <span className={classnames("pill", className)} data-cy={cy}>
        {label}
        {undefined !== id && <button data-cy={`${cy}-remove`} data-id={id} className="pill__control">×</button>}
    </span>
);

export default Pill;
