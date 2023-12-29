import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TreeNode from './tree-node';

export default class TreeHandler extends PureComponent {
    constructor({ data, pattern }) {
        super();

        this.state = {
            data,
            pattern,
        }

        this.onExpand = this.onExpand.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onExpand(e) {
        e.preventDefault();
        e.stopPropagation();

        const { data } = this.state;
        const path = e.target.getAttribute('data-node');

        if (!path) {
            return;
        }

        this.props.onExpand(data, path);

        this.setState({ data: [...data] });
    }

    onChange(e) {
        e.preventDefault();
        e.stopPropagation();

        const { target: { value: pattern } } = e;
        const { data } = this.state;

        this.props.onFilter(data, pattern);

        this.setState({ data: [...data], pattern });
    }

    render() {
        const { data, pattern } = this.state;
        const { 'data-cy': cy, className, placeholder } = this.props;

        return <section className={`tree ${className}`} onClick={this.onExpand}>
            <input
                data-cy={`${cy}tree-pattern`}
                className="tree_input"
                placeholder={placeholder}
                value={pattern}
                onChange={this.onChange}
            />
            {
                data && <div className="tree_content">
                    {
                        data.map((v, i) =>
                            (undefined === v.isVisible || v.isVisible) &&
                            <TreeNode
                                {...v}
                                key={i}
                                data-cy={`${cy}tree-node-${i}`}
                                data-node={`${i}`}
                            />
                        )
                    }
                </div>
            }
        </section>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        pattern: PropTypes.string,
        data: PropTypes.arrayOf(
            PropTypes.shape({
                isVisible: PropTypes.bool,
            })
        ),
        onExpand: PropTypes.func.isRequired,
        onFilter: PropTypes.func.isRequired,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
        pattern: '',
    }
}
