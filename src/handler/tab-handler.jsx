import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class TabHandler extends PureComponent {
    constructor({ tabId }) {
        super();

        this.state = {
            tabId,
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        e.preventDefault();
        e.stopPropagation();

        const { onChange } = this.props;
        const tabId = parseInt(e.target.getAttribute('data-tab-id'));

        this.setState(
            { tabId },
            () => {
                onChange && onChange(this.props, this.state);
            }
        )
    }

    render() {
        const { 'data-cy': cy, tabs } = this.props;
        const { tabId } = this.state;
        const { c: C, props } = tabs[tabId];

        return <>
            <ul className="tab-handler">
                {
                    tabs.map(({ label }, i) =>
                        <li
                            key={i}
                            onClick={this.onChange}
                            className={`tab${i === tabId ? '--selected' : ''}`}
                            data-tab-id={i}
                            data-cy={`${cy}tab-${i}`}
                        >
                            {label}
                        </li>
                    )
                }
            </ul>
            <C {...props} />
        </>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        tabs: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                c: PropTypes.func.isRequired,
                props: PropTypes.object,
            })
        ).isRequired,
        tabId: PropTypes.number,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
        tabId: 0,
    }
}
