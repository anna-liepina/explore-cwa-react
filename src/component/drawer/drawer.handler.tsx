import React, { useState, useCallback, PropsWithChildren } from 'react';
import Portal from '../../portal';
import type { IQAProps } from '../../utils/commonTypes';

interface IDrawerHandlerProps extends IQAProps, PropsWithChildren {
    className?: string;
    title?: string;
    isExpanded?: boolean;
    onToggle?: (isExpanded: boolean) => void;
    button: React.ComponentType<{ onClick: () => void, className?: string }>;
}

const DrawerHandler: React.FC<IDrawerHandlerProps> = ({
    'data-cy': cy = '',
    className,
    title,
    isExpanded: isExpandedInitially = false,
    onToggle,
    button: Button,
    children,
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(isExpandedInitially);

    const handleToggle = useCallback(() => {
        setIsExpanded((prevIsExpanded) => !prevIsExpanded);
        
        onToggle && onToggle(!isExpanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded]);

    return (
        <>
            <Button
                data-cy={`${cy}--drawer--open`}
                onClick={handleToggle}
            />
            {
                isExpanded
                && <Portal data-cy={cy} title={title} className={className} onClose={handleToggle}>
                    {children}
                </Portal>
            }
        </>
    );
};

export default DrawerHandler;
