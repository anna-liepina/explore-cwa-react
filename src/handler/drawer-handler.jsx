import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Drawer from '../drawer';

export default class DrawerHandler extends PureComponent {
    constructor({ isExpanded }) {
        super();

        this.state = {
            isExpanded,
        }

        this.onExpand = this.onExpand.bind(this);
    }

    onExpand() {
        const { isExpanded } = this.state;
        const { onExpand } = this.props;

        this.setState({ isExpanded: !isExpanded }, () => onExpand && onExpand(!isExpanded));
    }

    render() {
        const { isExpanded } = this.state;
        const { 'data-cy': cy, className, children, button: Button } = this.props;

        return <>
            <Button data-cy={`${cy}-button`} onClick={this.onExpand} className={className} />
            {
                isExpanded
                && <Drawer data-cy={`${cy}-drawer`} title="postcode tree" onClose={this.onExpand}>
                    {children}
                </Drawer>
            }
        </>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        isExpanded: PropTypes.bool,
        onExpand: PropTypes.func,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
    }
}
