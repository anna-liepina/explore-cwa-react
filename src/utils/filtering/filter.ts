import type { ITreeNodeProps } from "../../component/tree/tree-node";

export interface ITextChunk {
    v: string;
    isMatch?: boolean;
}

export const filterTree = (data: ITreeNodeProps[], pattern: string) => {
    pattern = (pattern || '').toLowerCase();

    for (const v of data) {
        v.isExpanded = filter(v, pattern);

        if (!pattern) {
            v.isExpanded = false;
            v.isVisible = true;
        }
    }
};

export const filter = (obj: ITreeNodeProps, pattern: string): boolean => {
    let left = obj.text.toLowerCase();
    let chunks: ITextChunk[] | undefined;
    let index = left.indexOf(pattern);
    let pos = 0;

    while (pattern && index !== -1) {
        chunks ||= [];

        if (index === 0) {
            index = pattern.length;
        }

        chunks.push({
            /** to preserve case */
            v: obj.text.slice(pos, pos + index),
            isMatch: left.slice(0, index) === pattern,
        });

        pos += index;
        if (pos === obj.text.length) {
            break;
        }

        left = left.slice(index);
        index = left.indexOf(pattern);

        if (index === -1) {
            chunks.push({
                v: obj.text.slice(pos),
                isMatch: false,
            });
        }
    }

    obj.isExpanded = false;
    obj.isVisible = !!chunks;
    obj.chunks = chunks;
    
    if (obj.nodes) {
        obj.nodes.forEach((v) => {
            if(filter(v, pattern)) {
                obj.isExpanded = true;
                obj.isVisible = true;
            }
        })
    }

    return obj.isVisible;
};
