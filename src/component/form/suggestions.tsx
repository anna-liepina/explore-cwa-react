import React from 'react';
import type { MouseEvent } from 'react';
import classNames from 'classnames';
import type { IQAProps } from '../../utils/commonTypes';

export interface ISuggestionTag {
    label: string;
    className?: string;
}

export interface ISuggestion {
    label: string;
    value: string | number;
    className?: string;
    description?: string;
    tags?: ISuggestionTag[];
}

export interface ISuggestionsProps extends IQAProps {
    options: ISuggestion[];
    hashmap?: Record<string, boolean>;
    className?: string;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const Suggestions: React.FC<ISuggestionsProps> = ({
    'data-cy': cy = '',
    className,
    onClick,
    options,
    hashmap,
}) => (
    <div className={classNames('suggestions', className)} onClick={onClick}>
    {
        options.map(({ label, value, className, tags, description }, i) =>
            !(hashmap && hashmap[value])
            && <div
                key={i}
                data-cy={`${cy}-suggestion-${i}`}
                data-id={i}
                className={classNames('suggestion', className)}
            >
                {
                    Array.isArray(tags)
                    && !!tags.length
                    && <div className="suggestion__hierarchy">
                        {
                            tags.map(({ label, className }, j) => 
                                <span key={j} data-id={i} className={classNames("suggestion__hierarchy-label", className)}>
                                    {label}
                                </span>
                            )
                        }
                    </div>
                }
                <div className="suggestion__label" data-id={i}>{label}</div>
                { description && <p className="suggestion__description" data-id={i}>{description}</p> }
            </div>
        )
    }
    </div>
);

export default Suggestions;
