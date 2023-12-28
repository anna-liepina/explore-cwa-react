import React from 'react';
import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import type { IQueryProps } from './query';
import Query from './query';

describe('<Query/>', () => {
    const props: IQueryProps = {
        fetch: jest.fn(() => new Promise(() => {})),
        children: (props, state) => <div data-cy="query-child"/>
    };

    const optionalProps: Partial<IQueryProps> = {
        'data-cy': '{{data-cy}}',
    };

    describe('render', () => {
        // it('with required/default props', async () => {
        //     let asFragment;
        //     await act(async () => {
        //         const obj = await render(<Query {...props} />);
        //         asFragment = obj.asFragment
        //     });

        //         expect(asFragment!()).toMatchSnapshot();
        // });

        // it('with optional/required props', () => {
        //     const { asFragment } = render(<Query {...props} {...optionalProps} />);

        //     expect(asFragment()).toMatchSnapshot();
        // });

        // describe('children render [render props approach]', () => {
        //     it('if internal state field [::isLoading] is true, it should call children with arguments [props, internal state]', async () => {
        //         const spy = jest.spyOn(props, 'children');

        //         const fetch = () => Promise.resolve('result');
    
        //         await act(async () => {
        //             await render(<Query {...props} fetch={fetch} />);
        //         })
            
        //         expect(spy).toBeCalledWith(
        //             { ...props, fetch },
        //             {
        //                 data: 'result',
        //                 errors: undefined,
        //                 isLoading: false,
        //             }
        //         );
        //     });
        // });
    });

    // describe('refetch functionality', () => {
    //     it('should invoke external callback [::fetch] if prop [::fetchTrigger] changed', async () => {
    //         const spy = jest.spyOn(props, 'fetch');

    //         const { rerender } = render(<Query {...props} />);

    //         await waitFor(() => {
    //             expect(spy).toHaveBeenCalledTimes(1);
    //         });
        
    //         rerender(<Query {...props} fetchTrigger={Date.now()} />);
        
    //         await waitFor(() => {
    //             expect(spy).toHaveBeenCalledTimes(2);
    //         });
    //     });

    //     // it('should NOT invoke external callback [::fetch] if prop [::fetchTrigger] NOT changed', async () => {
    //     //     const fetch = jest.fn((
    //     //         props: Partial<IQueryProps>,
    //     //         state: Partial<IQueryState>,
    //     //         onSuccess: any,
    //     //         onError: any
    //     //     ) => {
    //     //         state.isLoading = true; 
    //     //         onSuccess();
    //     //     });

    //     //     const { rerender } = render(<Query {...props} fetch={fetch} fetchTrigger={1}/>);

    //     //     await waitFor(() => {
    //     //         expect(fetch).toHaveBeenCalledTimes(1);
    //     //     });
        
    //     //     rerender(<Query {...props} fetch={fetch} fetchTrigger={1} />);
        
    //     //     await waitFor(() => {
    //     //         expect(fetch).toHaveBeenCalledTimes(1);
    //     //     });
    //     // });
    // });

    // describe('lifecycles events', () => {
    //     describe('::componentDidMount', () => {
    //         it('should invoke external callback [::fetch] after component mount', () => {
    //             const spy = jest.spyOn(props, 'fetch');

    //             render(<Query {...props} />);

    //             expect(spy).toBeCalledWith(
    //                 props,
    //                 expect.any(Object),
    //                 expect.any(Function),
    //                 expect.any(Function),
    //             );
    //         });

    //         it('should NOT render ::children if [::isLoading] is truthy', async () => {
    //             const spy = jest.fn();
    
    //             render(<Query {...props} children={spy} />);

    //             expect(spy).not.toBeCalled();
    //         });
    //     });
    // });

    // // describe('internal callbacks', () => {
    // //     describe('::onSuccess', () => {
    // //         const data = [
    // //             {
    // //                 postcode: 'SW1A 2AA',
    // //             }
    // //         ];

    // //         const fetch = (
    // //             props: Partial<IQueryProps>,
    // //             state: Partial<IQueryState>,
    // //             onSuccess: any,
    // //             onError: any
    // //         ) => onSuccess(data);

    // //         it('should set internal state field [::isLoading] to false, reset [::errors] and set [::data] from payload', () => {
    // //             const spy = jest.fn();

    // //             render(<Query {...props} fetch={fetch} children={spy} />);

    // //             expect(spy).toBeCalledWith(expect.anything(), { data, errors: undefined, isLoading: false });
    // //         });
    // //     });

    // //     describe('::onError', () => {
    // //         const errors = [
    // //             'error 0',
    // //             'error 1',
    // //         ];

    // //         const fetch = (
    // //             props: Partial<IQueryProps>,
    // //             state: Partial<IQueryState>,
    // //             onSuccess: any,
    // //             onError: any
    // //         ) => onError(errors);

    // //         it('should set internal state field [::isLoading] to false, reset [::data] and [::errors] from payload', () => {
    // //             const spy = jest.fn();
    // //             render(<Query {...props} fetch={fetch} children={spy} />);

    // //             expect(spy).toBeCalledWith(expect.anything(), { data: undefined, errors, isLoading: false });
    // //         });
    // //     });
    // // });
});
