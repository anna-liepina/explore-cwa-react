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
                this.props.onChange && onChange(this.props, this.state);
            }
        )
    }

    render() {
        const { tabId } = this.state;
        const { tabs } = this.props;
        const { c: C, props } = tabs[tabId];

        return <>
            <ul className="tab-handler">
                {
                    tabs.map(({ label }, i) =>
                        <li
                            key={i}
                            data-tab-id={i}
                            onClick={this.onChange}
                            className={`tab${i === tabId ? '--selected' : ''}`}
                        >
                            {label}
                        </li>
                    )
                }
            </ul>
            <C {...props}/>
        </>;
    }


    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        tabId: PropTypes.number,
        tabs: PropTypes.array.isRequired,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
        tabId: 0,
    }
}
