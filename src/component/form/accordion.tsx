import React from 'react';
import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import type { IQAProps } from '../../utils/commonTypes';

export interface IAccordionProps extends IQAProps, PropsWithChildren {
    className?: string;
    title?: string;
    isCollapsed?: boolean;
    onCollapse?: (e: React.MouseEvent) => void;
}

const Accordion: React.FC<IAccordionProps> = ({
    className,
    title,
    onCollapse,
    isCollapsed,
    children,
    ...props
}) => <section className={classNames(className, { accordion: !isCollapsed, 'accordion--collapsed': isCollapsed })}>
    {
        title && 
        <h2 className="accordion_title" onClick={onCollapse} {...props}>
            {title}
        </h2>
    }
    {!isCollapsed && children}
</section>;

export default Accordion;

