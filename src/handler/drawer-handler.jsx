import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Drawer from '../drawer';

export default class DrawerHandler extends PureComponent {
    constructor({ isExpanded }) {
        super();

        this.state = {
            isExpanded,
        }

        this.onToggle = this.onToggle.bind(this);
    }

    onToggle() {
        const { isExpanded } = this.state;
        const { onToggle } = this.props;

        this.setState({ isExpanded: !isExpanded }, () => onToggle && onToggle(!isExpanded));
    }

    render() {
        const { isExpanded } = this.state;
        const { 'data-cy': cy, className, button: Button, title, children } = this.props;

        return <>
            <Button data-cy={`${cy}--drawer--open`} onClick={this.onToggle} className={className} />
            {
                isExpanded
                && <Drawer data-cy={cy} title={title} onClose={this.onToggle}>
                    {children}
                </Drawer>
            }
        </>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        isExpanded: PropTypes.bool,
        onToggle: PropTypes.func,
        button: PropTypes.func.isRequired,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
    }
}
