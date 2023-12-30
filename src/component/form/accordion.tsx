import React from 'react';
import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import type { IQAProps } from '../../utils/commonTypes';

export interface IAccordionProps extends IQAProps {
    className?: string;
    title?: string;
    isCollapsed?: boolean;
    onCollapse?: () => void;
    
}

const Accordion: React.FC<IAccordionProps & PropsWithChildren> = ({
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

