import axios from 'axios';
import { filter } from '../../filtering/filter';
import { graphql } from '../../parameters';

const resolveTree = (v, onlyId) => {
    const hashmap = {};
    const roots = [];

    for (const node of v) {
        hashmap[node.id] = node;

        /** required fields for tree-search */
        hashmap[node.id].text = node.name;
    }

    for (const node of v) {
        if (node.parent) {
            if (undefined === hashmap[node.parent.id].nodes) {
                hashmap[node.parent.id].nodes = [];
            }

            hashmap[node.parent.id].nodes.push(node);
        } else {
            roots.push(node);
        }
    }

    return onlyId ? [hashmap[onlyId]] : roots;
}

export const onMount = (props, state, onSuccess, onError) => {
    const { match: { params: { id } } } = props;

    axios
        .post(
            graphql,
            {
                query: `
{
    statuses {
        id
        seq
        name
        parent {
            id
        }
    }
}`
            }
        )
        .then(({ data: { data } }) => {
            const v = resolveTree(data.statuses, id);

            onSuccess(v);
        })
        .catch(onError);
};

const onExpand = (data, path) => {
    let pos = 0;
    let cursor = data;
    const arr = path.split('-');

    while (pos < arr.length) {
        cursor = pos === arr.length - 1
            ? cursor[arr[pos]]
            : cursor[arr[pos]].nodes;

        pos++;
    }

    cursor.isExpanded = !cursor.nodes.some((v) => v.isVisible);
    cursor.nodes.forEach((v, i) => v.isVisible = cursor.isExpanded);
};

const onFilter = (data, pattern) => {
    pattern = (pattern || '').toLowerCase();

    for (const v of data) {
        v.isExpanded = filter(v, pattern);

        if (!pattern) {
            v.isExpanded = false;
            v.isVisible = true;
        }
    }
};

export default {
    placeholder: 'type to search in a tree',
    className: 'tree--explore-mode',
    onMount,

    onExpand,
    onFilter,
}
