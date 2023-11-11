import React from 'react';
import { Link } from 'react-router-dom';

import Query from '../handler/query';
import TreeHandler from '../handler/tree-handler';
import DrawerHandler from '../handler/drawer-handler';
import { graphql } from '../parameters';
import { filter } from '../filtering/filter';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

interface Data {
    areaSearch: { area: string; city: string }[];
}

interface Series {
    text: string;
    nodes: { text: string }[];
}

const onMount = (
    props: any,
    state: any,
    onSuccess: (data: Series[]) => void,
    onError: (error: any) => void
) => {
    axios
        .post<undefined, AxiosResponse<{ data: Data }>>(
        graphql!,
        {
            query: `
            {
                areaSearch(perPage: 5000) {
                area
                city
                }
            }
            `,
        }
        )
        .then(({ data: { data } }) => {
        const obj: Record<string, { text: string }[]> = {};

        for (const { city, area: text } of data.areaSearch) {
            if (!obj[city]) {
            obj[city] = [];
            }

            obj[city].push({ text });
        }

        const series: Series[] = [];

        for (const text in obj) {
            series.push({
            text,
            nodes: obj[text],
            });
        }

        onSuccess(series);
        })
        .catch(onError);
};
  
const onFilter = (data: any, pattern: string) => {
    pattern = (pattern || '').toLowerCase();

    for (const v of data) {
        v.isExpanded = filter(v, pattern);

        if (!pattern) {
            v.isExpanded = false;
            v.isVisible = true;
        }
    }
};

const onExpand = (data: any, path: string) => {
    let pos = 0;
    let cursor = data;
    const arr = path.split('-');

    while (pos < arr.length) {
        cursor = pos === arr.length - 1
            ? cursor[arr[pos]]
            : cursor[arr[pos]].nodes;

        pos++;
    }

    cursor.isExpanded = !cursor.nodes.some((v: any) => v.isVisible);
    cursor.nodes.forEach((v: any) => v.isVisible = cursor.isExpanded);
};

interface ITopNavProps {
    'data-cy'?: string;
    className?: string;
};

const TopNav: React.FC<ITopNavProps> = ({ 'data-cy': cy, className, ...props }) =>
    <nav data-cy={`${cy}-topnav`} className={`topnav ${className}`} {...props}>
        <Link to="/" className="topnav__link">
            <img data-cy={`${cy}-topnav-logo`} className="topnav__logo--main" alt="Logo" src="/assets/img/1.png" />
        </Link>
        <DrawerHandler
            data-cy="topnav-postcode_tree"
            button={(props: any) => <img {...props} className={`${props.className || ''} topnav__item`} alt="UK postcode areas" src="/assets/img/united-kingdom.svg" />}
        >
            <Query onMount={onMount}>
                {(props: any, state: any) => <TreeHandler data={state.data} onFilter={onFilter} onExpand={onExpand} />}
            </Query>
        </DrawerHandler>
        <Link to="//github.com/anna-liepina/explore-cwa-react" className="topnav__link--github" target="_blank">
            <img data-cy={`${cy}-topnav-github`} className="topnav__logo--github" alt="GitHub logo" src="/assets/img/github-logo.png" />
        </Link>
    </nav>;

// TopNav.propTypes = {
//     'data-cy': PropTypes.string,
//     className: PropTypes.string,
// };
// TopNav.defaultProps = {
//     'data-cy': '',
//     className: '',
// };

export default TopNav;
