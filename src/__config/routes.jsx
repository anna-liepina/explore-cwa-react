// import React from 'react';
// import Query from '../handler/query';
// // import withModal from '../handler/with-modal';
// // import TileHandler from '../handler/tile-handler';
// // import TreeHandler from '../handler/tree-handler';
// // import searchStatus from './trees/explore.status';
// // import dashboardProps from './dashboard/dashboard.status';
// import * as Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// import axios from 'axios';
// // import { hasSequence } from 'byte-sequence-calculator';
// // import FormHandler from '../../handler/form-handler';
// // import TreeHandler from '../../handler/tree-handler';
// // import Query from '../../handler/query';
// // import createStatus from '../forms/create.status';
// // import updateStatus from '../forms/update.status';
// // import searchStatus from '../trees/explore.status';
// import { graphql } from '../parameters';

// // const TileHandlerWithModal = withModal(TileHandler);
// const onMount = (props, state, onSuccess, onError) => {
//     axios
//         .post(
//             graphql,
//             {
//                 query: `
// {
//     timelineSearch(postcodes: ["CF10", "E15", "E14", "E16", "E20"], pattern: "E15 4GH", perPage: 4000) {
//         date
//         avg
//         count
//         postcode
//     }
// }
// `
//             }
//         )
//         .then(({ data: { data } }) => {

//             const obj = {};

//             for (const v of data.timelineSearch) {
//                 if (!obj[v.postcode]) {
//                     obj[v.postcode] = [];
//                 }

//                 const [year, month, day] = v.date.split('-');

//                 obj[v.postcode].push([
//                     Date.UTC(year, month, day),
//                     v.avg,
//                     v.date,
//                 ])
//             }

//             const coefficient = 1.5;
//             const series = [];
//             for (const name in obj) {
//                 series.push({
//                     name,
//                     data: obj[name]
//                         .filter(([, pCurr], i, arr) => {
//                             if (arr.length < 2) {
//                                 return true;
//                             }

//                             if (arr.length - 1 === i) {
//                                 return pCurr < arr[i - 1][1] * coefficient;
//                             }

//                             const [, pNext] = arr[i + 1];

//                             if (pCurr > pNext) {
//                                 return pCurr < pNext * coefficient;
//                             }

//                             return pCurr * coefficient > pNext;
//                         }),
//                 })
//             }

//             onSuccess(series);
//         })
//         .catch(onError);
// };

// const options = {
//     title: {
//         text: 'price statistics'
//     },
//     chart: {
//         type: 'spline'
//     },
//     xAxis: {
//         type: 'datetime',
//         dateTimeLabelFormats: {
//             month: '%b \'%y',
//             year: '%Y'
//         },
//         title: {
//             text: 'Date'
//         }
//     },
//     yAxis: {
//         title: {
//             text: 'price GBP'
//         },
//         min: 0
//     },
// }

// export default [
//     {
//         path: ['/'],
//         // exact: true,
//         component: (props) =>
//             <Query
//                 onMount={onMount}
//                 children={
//                     (_, state) =>
//                         <HighchartsReact
//                             highcharts={Highcharts}
//                             options={{
//                                 ...options,
//                                 series: state.data,
//                             }}
//                             {...props}
//                         />
//                 }
//             />,
//     },
// ];

import React from 'react';
import ChartHandler from '../handler/chart-handler';

export default [
    {
        path: ['/'],
        // exact: true,
        component: ChartHandler,
    },
];
