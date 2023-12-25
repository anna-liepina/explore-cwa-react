import React from 'react';
import { Link } from 'react-router-dom';

import Query from '../handler/query';
import TreeHandler from '../handler/tree-handler';
import DrawerHandler from '../handler/drawer-handler';
import api from '../graphql/api';
import { filterTree } from '../filtering/filter';

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

const TopNav: React.FC<ITopNavProps> = ({ 'data-cy': cy = '', className = '', ...props }) =>
    <nav data-cy={`${cy}-topnav`} className={`topnav ${className}`} {...props}>
        <Link to="/" className="topnav__link">
            <img data-cy={`${cy}-topnav-logo`} className="topnav__logo--main" alt="Logo" src="/assets/img/1.png" />
        </Link>
        <DrawerHandler
            data-cy="topnav-postcode_tree"
            button={(props: any) => <img {...props} className={`${props.className || ''} topnav__item`} alt="UK postcode areas" src="/assets/img/united-kingdom.svg" />}
        >
            <Query fetch={api.fetchAreas}>
                {(props: any, state: any) => <TreeHandler data={state.data} onFilter={filterTree} onExpand={onExpand} />}
            </Query>
        </DrawerHandler>
        <Link to="//github.com/anna-liepina/explore-cwa-react" className="topnav__link--github" target="_blank">
            <img data-cy={`${cy}-topnav-github`} className="topnav__logo--github" alt="GitHub logo" src="/assets/img/github-logo.png" />
        </Link>
    </nav>;

export default TopNav;
