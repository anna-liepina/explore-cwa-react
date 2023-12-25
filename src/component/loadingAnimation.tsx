import React from "react";

export interface ILoadingAnimationProps {
    'data-cy'?: string;
}

const LoadingAnimation: React.FC<ILoadingAnimationProps> = ({ 'data-cy': cy = ''}) => 
    <div data-cy={`${cy}--query`} className="query--loading">
    <div />
    <div />
</div>;

export default LoadingAnimation