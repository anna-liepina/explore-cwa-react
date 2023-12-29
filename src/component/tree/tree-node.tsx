import React from 'react';
import classNames from 'classnames';
import type { ITextChunk } from '../../utils/filtering/filter';

export interface ITreeNodeProps {
    className?: string;
    'data-cy'?: string;
    'data-node'?: string;
    isExpanded?: boolean;
    isVisible?: boolean;
    text: string;
    chunks?: ITextChunk[];
    nodes?: ITreeNodeProps[];
}

const TreeNode: React.FC<ITreeNodeProps> = ({ className, 'data-cy': cy = '', 'data-node': node = '', text, chunks, nodes, isExpanded }) => (
    <div
        className={classNames(className, {
            'tree-node': !nodes,
            'tree-node--with-children': !!nodes && !isExpanded,
            'tree-node--with-children-expanded': !!nodes && isExpanded,
        })}
        data-cy={cy}
        data-node={!!nodes ? node : '0'}
    >
        {
            !!chunks
                ? chunks.map(({ isMatch, v }, i) => 
                    <span key={i} className={classNames({'tree-node--pattern-match' : isMatch })}>{v}</span>
                )
                : <span>{text}</span>
        }
        {
            isExpanded && nodes?.map((v, i) =>
                v.isVisible && <TreeNode
                    {...v}
                    key={i}
                    data-cy={`${cy}-${i}`}
                    data-node={`${node}-${i}`}
                />
            )
        }
    </div>
);

export default TreeNode;
