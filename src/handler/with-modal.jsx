import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import Portal from '../portal';

export default (Component) => {
    const C = ({ location, modals, ...props }) =>
        <>
            <Component {...props} />
            {
                location.state &&
                location.state.isModal &&
                <Portal onClose={props.history.goBack}>
                    <Switch>
                        {
                            modals.map((p, i) => <Route key={i} {...props} {...p} />)
                        }
                    </Switch>
                </Portal>
            }
        </>;

    C.displayName = `withModal(${Component.displayName || Component.name})`;
    /** if you follow 'withRouter' HOC style, testing is broken */
    // C.WrappedComponent = Component;

    C.propTypes = {
        modals: PropTypes.arrayOf(
            PropTypes.shape({
                path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
                component: PropTypes.func.isRequired,
            })
        ).isRequired,
        /** injected though withRouter HOC */
        location: PropTypes.object,
        history: PropTypes.object,
    }

    C.defaultProps = {
    }

    return withRouter(C);
}
