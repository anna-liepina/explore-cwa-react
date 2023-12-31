import React, { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import classNames from 'classnames';
import type { ITreeNodeProps } from './tree-node';
import TreeNode from './tree-node';
import { PureHTMLInput } from '../form/html-input';
import type { IQAProps } from '../../utils/commonTypes';

export interface ITreeHandlerProps extends IQAProps {
    className?: string;
    pattern?: string;
    patternPlaceholder?: string;
    data: ITreeNodeProps[];
    onFilter: (data: ITreeNodeProps[], pattern: string) => void;
    onExpand: (data: ITreeNodeProps[], path: string) => void;
}

const TreeHandler: React.FC<ITreeHandlerProps> = ({
    'data-cy': cy = '',
    className,
    pattern: initialPattern = '',
    patternPlaceholder,
    data: initialData,
    onExpand,
    onFilter,
}) => {
    const [pattern, setPattern] = useState<string>(initialPattern);
    const [data, setData] = useState<ITreeNodeProps[]>(initialData);

    const handlePatternChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const newPattern = e.target.value;
        onFilter(data, newPattern);
        setData([...data]);
        setPattern(newPattern);
    };

    const handleExpand = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const path = (e.target as HTMLElement).getAttribute('data-node');

        if (!path) {
            return;
        }

        onExpand(data, path);
        setData([...data]);
    };

    return (
        <section className={classNames(`tree`, className)}>
        <PureHTMLInput
            data-cy={`${cy}tree-pattern`}
            className="tree_input"
            placeholder={patternPlaceholder}
            value={pattern}
            onChange={handlePatternChange}
        />
        {
            Array.isArray(data) && !!data.length
            && <div className="tree_content" onClick={handleExpand}>
                {
                    data.map((v, i) => 
                        (undefined === v.isVisible || v.isVisible) 
                        && <TreeNode {...v} key={i} data-cy={`${cy}tree-node-${i}`} data-node={`${i}`} />
                    )
                }
            </div>
        }
        </section>
    );
};

export default TreeHandler;
