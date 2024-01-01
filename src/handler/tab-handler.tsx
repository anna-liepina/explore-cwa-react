import React, { useState, MouseEvent } from 'react';
import classNames from 'classnames';
import type { IQAProps } from '../utils/commonTypes';

interface ITab {
    label: string;
    className?: string;
    component: React.ComponentType;
    props?: Record<string, any>;
}

interface ITabHandlerProps extends IQAProps {
    className?: string;
    tabs: ITab[];
    tabId?: number;
    onChange?: (props: ITabHandlerProps, tabId: number) => void;
}

const TabHandler: React.FC<ITabHandlerProps> = (props) => {
    const {
        'data-cy': cy = '',
        className,
        tabs,
        tabId: initialTabId = 0,
        onChange,
    } = props;

    const [tabId, setTabId] = useState<number>(initialTabId);

    const onTabChange = (e: MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const newTabId = parseInt(e.currentTarget.getAttribute('data-tab-id') || '0', 10);

        setTabId(newTabId);

        onChange && onChange(props, newTabId);
    };

    const { component: Tab, props: tabProps } = tabs[tabId];

    return (
        <>
            <ul className={classNames(`tab-handler`, className)}>
            {
                tabs.map(({ label, className }, i) => (
                    <li
                        key={i}
                        className={classNames(className, { tab: tabId !== i, 'tab--selected': tabId === i })}
                        onClick={onTabChange}
                        data-cy={`${cy}tab-${i}`}
                        data-tab-id={i}
                    >
                        {label}
                    </li>
                ))
            }
            </ul>
            <Tab {...tabProps} />
        </>
    );
};

export default TabHandler;
