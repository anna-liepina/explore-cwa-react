import React from "react";
import type{ IQAProps } from "../../utils/commonTypes";

export interface IQueryAnimationProps extends IQAProps {
}

const QueryAnimation: React.FC<IQueryAnimationProps> = ({ 'data-cy': cy = '' }) => 
<div data-cy={`${cy}--query`} className="query--loading">
    <div />
    <div />
</div>;

export default QueryAnimation;
