import React from 'react';
import classNames from 'classnames';
import type { IQAProps } from '../../utils/commonTypes';

interface AccordionProps extends IQAProps {
    className?: string;
    title?: string;
    onCollapse?: () => void;
    isCollapsed?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
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

