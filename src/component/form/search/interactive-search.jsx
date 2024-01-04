import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Suggestions from '../suggestions';
import InputWithPills from '../input-with-pills';
import compose from '../compose-form-field';

export const executeOnChange = (props, value) => props.onChange(
    {
        target: {
            getAttribute: (key) => props[key],
            /** required because of PureComponent */
            value: [...value],
        },
    }
);

class InteractiveSearch extends PureComponent {
    constructor({ pattern, isExpanded, options }) {
        super();

        this.state = {
            pattern,
            isExpanded,
            options,
        };

        this.deferredCallback = undefined;

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.onKeyDown = this.onKeyDown.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onRemoveOption = this.onRemoveOption.bind(this);

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    }

    onMouseEnter() {
        this.setState({ isExpanded: true });
    }

    onMouseLeave() {
        this.setState({ isExpanded: false });
    }

    onSuccess(options) {
        const { onSuccess } = this.props;

        this.setState({ options }, () => { onSuccess && onSuccess(this.props, this.state); });
    }

    onError() {
        const { onError } = this.props;

        this.setState({ options: [] }, () => { onError && onError(this.props, this.state); });
    }

    onKeyDown({ target }) {
        const { value: pattern } = target;
        const { onFilter, onFilterTimer } = this.props;

        if (this.deferredCallback !== undefined) {
            clearTimeout(this.deferredCallback);
        }

        this.setState(
            { pattern },
            () => {
                this.deferredCallback = setTimeout(() => onFilter(this.props, this.state, this.onSuccess, this.onError), onFilterTimer);
            }
        );
    }

    onChange(e) {
        e.preventDefault();
        e.stopPropagation();

        const key = e.target.getAttribute('data-id');
        let { value, maxValues } = this.props;

        if (null === key || value.length >= maxValues) {
            return;
        }

        value.push(this.state.options[key]);

        /** because <Form/> relay on two attributes */
        executeOnChange(this.props, value);
        // this.props.onChange(
        //     {
        //         target: {
        //             getAttribute: (key) => ({
        //                 'data-section': this.props['data-section'],
        //                 'data-field': this.props['data-field'],
        //             })[key],
        //             /** required because of PureComponent */
        //             value: [...value],
        //         },
        //         stopPropagation: () => { },
        //         preventDefault: () => { },
        //     }
        // );
    }

    onRemoveOption(e) {
        e.preventDefault();
        e.stopPropagation();

        const key = e.target.getAttribute('data-id');
        if (null === key) {
            return;
        }
        const { value } = this.props;

        value.splice(key, 1);

        /** because <Form/> relay on two attributes */
        executeOnChange(this.props, value);
        // this.props.onChange(
        //     {
        //         target: {
        //             getAttribute: (key) => ({
        //                 'data-section': this.props['data-section'],
        //                 'data-field': this.props['data-field'],
        //             })[key],
        //             /** required because of PureComponent */
        //             value: [...value],
        //         },
        //         stopPropagation: () => { },
        //         preventDefault: () => { },
        //     }
        // );
    }

    render() {
        const { 'data-cy': cy, className, placeholder, value } = this.props;
        const { isExpanded, options } = this.state;

        return <div
            className={`interactive-search ${className}`}
            data-cy={`${cy}-wrapper`}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
        >
            <InputWithPills
                data-cy={`${cy}-input`}
                onFocus={this.onMouseEnter}
                onChange={this.onKeyDown}
                onClick={this.onRemoveOption}
                value={value}
                placeholder={placeholder}
            />
            {
                isExpanded && options && !!options.length
                && <Suggestions
                    data-cy={cy}
                    onClick={this.onChange}
                    options={options}
                    hashmap={value.reduce((acc, { value: v }) => { acc[v] = v; return acc; }, {})}
                />
            }
        </div>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        onFilter: PropTypes.func.isRequired,
        onFilterTimer: PropTypes.number,
        placeholder: PropTypes.string,
        value: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
            })
        ),
        maxValues: PropTypes.number,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
            })
        ),
        onSuccess: PropTypes.func,
        onError: PropTypes.func,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
        value: [],
        onFilterTimer: 250,
    }
}

export default compose(InteractiveSearch);
export {
    InteractiveSearch as PureInteractiveSearch,
}
