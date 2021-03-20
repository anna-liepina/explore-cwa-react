import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Query from '../handler/query';
import TreeHandler from '../handler/tree-handler';
import SectionHandler from '../handler/section-handler';
import { graphql } from '../parameters';
import { filter } from '../filtering/filter';
import axios from 'axios';

const onMount = (props, state, onSuccess, onError) => {
    axios
        .post(
            graphql,
            {
                query: `
{
    areaSearch(perPage: 5000) {
        area
        city
    }
}`
            }
        )
        .then(({ data: { data } }) => {
            const obj = {};
            for (const { city, area } of data.areaSearch) {
                if (!obj[city]) {
                    obj[city] = [];
                }

                obj[city].push({ text: area });
            }

            const series = [];
            for (const text in obj) {
                series.push({
                    text,
                    nodes: obj[text],
                })
            }

            onSuccess(series);
        })
        .catch(onError);
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

const TopNav = ({ 'data-cy': cy, className, ...props }) =>
    <nav data-cy={`${cy}topnav`} className={`topnav ${className}`} {...props}>
        <Link to="/" className="topnav__link">
            <img data-cy={`${cy}topnav__logo`} className="topnav__logo--main" alt="Logo" src="/assets/img/1.png" />
        </Link>
        <SectionHandler
            data-cy="topnav-postcode_tree"
            button={(props) => <img {...props} className={`${props.className || ''} topnav__item`} alt="UK postcode areas" src="/assets/img/united-kingdom.svg" />}
        >
            <Query onMount={onMount}>
                {(props, state) => <TreeHandler data={state.data} onFilter={onFilter} onExpand={onExpand} />}
            </Query>
        </SectionHandler>
        <Link to="//github.com/anna-liepina/explore-cwa-react" className="topnav__link--github" target="_blank">
            <img data-cy={`${cy}topnav__github`} className="topnav__logo--github" alt="GitHub logo" src="/assets/img/github-logo.png" />
        </Link>
    </nav>;

TopNav.propTypes = {
    'data-cy': PropTypes.string,
    className: PropTypes.string,
};
TopNav.defaultProps = {
    'data-cy': '',
    className: '',
};

export default TopNav;
