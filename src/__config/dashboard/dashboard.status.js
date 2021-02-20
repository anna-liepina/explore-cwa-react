// import React from 'react';
import axios from 'axios';
// import { hasSequence } from 'byte-sequence-calculator';
// import FormHandler from '../../handler/form-handler';
// import TreeHandler from '../../handler/tree-handler';
// import Query from '../../handler/query';
// import createStatus from '../forms/create.status';
// import updateStatus from '../forms/update.status';
// import searchStatus from '../trees/explore.status';
import { graphql } from '../../parameters';

const onMount = (props, state, onSuccess, onError) => {
    axios
        .post(
            graphql,
            {
                query: `
{
    timelineSearch(pattern: "CF10", perPage: 1000) {
        date
        avg
        count
        postcode
    }
}
`
            }
        )
        .then(({ data: { data } }) => {
            onSuccess(data.timelineSearch);
        })
        .catch(onError);
};

const onFilter = ({ data }, state, pattern) => {
    for (const el of data) {
        el.disabled = pattern && el.name.indexOf(pattern) === -1;
    }

    return data;
};

export default {
    onMount,
    onFilter,
    label: 'filter by pattern',
    placeholder: 'type pattern here...',
    // modals: [
    //     {
    //         path: ['/new'],
    //         exact: true,
    //         component: (props) => <FormHandler className="form--centered" {...props} {...createStatus} onCancel={props.history.goBack} />,
    //     },
    //     {
    //         path: ['/explore/:id'],
    //         exact: true,
    //         component: (props) =>
    //             <>
    //                 <FormHandler {...props} {...updateStatus} className="form--explore-mode" />
    //                 <Query
    //                     {...props}
    //                     onMount={searchStatus.onMount}
    //                     children={(_, state) => <TreeHandler {...props} {...state} {...searchStatus} onCancel={props.history.goBack} />}
    //                 />
    //             </>,
    //     },
    // ],
};
