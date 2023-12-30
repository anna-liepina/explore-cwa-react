import React from 'react';
import type { MouseEventHandler } from 'react';
import classNames from 'classnames';
import { PureHTMLInput } from './html-input';
import Pill from './pill';
import type { IQAProps } from '../../utils/commonTypes';

export interface IInputWithPillsValue {
    label: string;
    value: string | number;
}

export interface IInputWithPillsProps extends IQAProps {
    className?: string;
    value?: IInputWithPillsValue[];
    onClick?: MouseEventHandler;
}

const InputWithPills: React.FC<IInputWithPillsProps> = ({
    'data-cy': cy = '',
    className,
    onClick,
    value,
    ...props
}) => (
    <div className={classNames("input-with-pills", className)} onClick={onClick}>
        {
            Array.isArray(value)
            && value.map((props, i) => <Pill key={i} data-cy={`${cy}-pill-${i}`} data-id={i} {...props} />)
        }
        <PureHTMLInput {...props} data-cy={`${cy}-input`} className="input-with-pills__input" />
    </div>
);

export default InputWithPills;
