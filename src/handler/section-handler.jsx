import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class SectionHandler extends PureComponent {
    constructor({ isExpanded }) {
        super();

        this.state = {
            isExpanded,
        }

        this.onExpand = this.onExpand.bind(this);
    }

    onExpand(e) {
        e.preventDefault();
        e.stopPropagation();

        const { isExpanded } = this.state;
        const { onExpand } = this.props;

        this.setState({ isExpanded: !isExpanded }, () => onExpand && onExpand(!isExpanded));
    }

    render() {
        const { isExpanded } = this.state;
        const { 'data-cy': cy, className, children, button: Button } = this.props;

        return <>
            <Button data-cy={`${cy}-button`} onClick={this.onExpand} className={`${isExpanded ? 'section-button' : ''}`} />
            {
                isExpanded && <section data-cy={`${cy}-section`} className="section">
                    {children}
                </section>
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
