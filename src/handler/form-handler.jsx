import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Accordion from '../component/form/accordion';
import Button from '../component/button';

export default class FormHandler extends PureComponent {
    constructor({ config, data, isValid }) {
        super();

        this.state = {
            config,
            data,
            isValid,
        }

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.onCollapse = this.onCollapse.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.props.onMount && this.props.onMount(this.props, this.state, this.onSuccess, this.onError);
    }

    onSuccess({ data, config }) {
        config = config || this.state.config;

        this.setState(
            { data, config },
            () => {
                this.props.onSuccess && this.props.onSuccess(this.props, this.state);
            }
        );
    }

    onError({ data, config }) {
        config = config || this.state.config;

        this.setState(
            { data, config },
            () => {
                this.props.onError && this.props.onError(this.props, this.state);
            }
        );
    }

    onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const { config } = this.state;

        if (!this.props.validate || this.props.validate(config)) {
            this.setState({ isValid: true });

            this.props.onSubmit && this.props.onSubmit(this.props, this.state, this.onSuccess, this.onError);
        } else {
            this.setState({ config: [...config], isValid: false });
        }
    }

    onCancel(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.onCancel && this.props.onCancel(this.props, this.state, this.onSuccess, this.onError);
    }

    onCollapse(e) {
        const { config } = this.state;

        const section = e.target.getAttribute('data-section');

        config[section].isCollapsed = !config[section].isCollapsed;

        this.setState({ config: [...config] });
    }

    onChange(e) {
        const { config } = this.state;

        const section = e.target.getAttribute('data-section');
        const field = e.target.getAttribute('data-field');

        config[section].items[field].value = e.target.value;

        this.props.validate && this.props.validate(config, [[section, field]]);

        const isValid = config.every(({ items }) => items.every(({ errors }) => !Array.isArray(errors) || !errors.length));

        this.setState({ config: [...config], isValid });
    }

    render() {
        const { config, data, isValid } = this.state;
        const { 'data-cy': cy, className, title, submitCTRL, updateCTRL, cancelCTRL } = this.props;

        return <form className={`form ${className}`}>
            {title && <h1 className="form_title" data-cy={`${cy}form-title`}>{title}</h1>}
            {
                config.map(({ items, ...props }, i) =>
                    <Accordion
                        {...props}
                        onCollapse={this.onCollapse}
                        key={i}
                        data-section={i}
                        data-cy={`${cy}section-${i}`}
                    >
                        {
                            items.map(({ c: C, ...props }, j) =>
                                <C
                                    {...props}
                                    key={j}
                                    onChange={this.onChange}
                                    data-cy={`${cy}section-${i}-input-${j}`}
                                    data-section={i}
                                    data-field={j}
                                />
                            )
                        }
                    </Accordion>
                )
            }
            <div className="form_controls">
                {
                    updateCTRL && data &&
                    <Button
                        {...updateCTRL}
                        data-cy={`${cy}form-action-update`}
                        onClick={this.onSubmit}
                        disabled={!isValid}
                    />
                }
                {
                    submitCTRL && !data &&
                    <Button
                        {...submitCTRL}
                        data-cy={`${cy}form-action-submit`}
                        onClick={this.onSubmit}
                        disabled={!isValid}
                    />
                }
                {
                    cancelCTRL &&
                    <Button
                        {...cancelCTRL}
                        data-cy={`${cy}form-action-cancel`}
                        onClick={this.onCancel}
                    />
                }
            </div>
        </form>;
    }

    static propTypes = {
        'data-cy': PropTypes.string,
        className: PropTypes.string,

        config: PropTypes.arrayOf(
            PropTypes.shape({
                items: PropTypes.arrayOf(
                    PropTypes.shape({
                        c: PropTypes.func.isRequired,
                        errors: PropTypes.array,
                    })
                ).isRequired,
            })
        ).isRequired,
        data: PropTypes.object,
        isValid: PropTypes.bool,

        updateCTRL: PropTypes.object,
        submitCTRL: PropTypes.object,
        cancelCTRL: PropTypes.object,

        onMount: PropTypes.func,
        onError: PropTypes.func,
        onSuccess: PropTypes.func,

        onSubmit: PropTypes.func,
        onCancel: PropTypes.func,

        validate: PropTypes.func,
    }

    static defaultProps = {
        'data-cy': '',
        className: '',
    }
}
