import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent }  from 'react';
import classNames from 'classnames';
import Accordion from './accordion';
import type { IButtonProps } from '../button/button';
import Button from '../button/button';
import { IQAProps } from '../../utils/commonTypes';

export type TFormFieldValuePrimitive = string|number;
export type TFormFieldValueComposite = {
    value: TFormFieldValuePrimitive;
}
export interface IFormFieldConfig {
    component: React.ComponentType<React.ComponentPropsWithRef<'input'>>;
    errors?: string[];
    value?: TFormFieldValuePrimitive|TFormFieldValueComposite|TFormFieldValueComposite[];
}

export interface IFormSectionConfig {
    isCollapsed?: boolean;
    items: IFormFieldConfig[];
}

export interface IFormProps extends IQAProps {
    className?: string;
    title?: string;
    config: IFormSectionConfig[];
    data?: object;
    isValid?: boolean;
    updateCTRL?: IButtonProps;
    submitCTRL?: IButtonProps;
    cancelCTRL?: IButtonProps;
    onMount?: (props: IFormProps, state: IFormState) => Promise<IFormState>;
    onSuccess?: (props: IFormProps, state: IFormState) => void;
    onError?: (props: IFormProps, state: IFormState) => void;
    onSubmit?: (props: IFormProps, state: IFormState) => Promise<IFormState>;
    onCancel?: (props: IFormProps, state: IFormState) => Promise<IFormState>;
    validate?: (config: IFormProps['config'], fields?: [number, number][]) => boolean;
}

export interface IFormState {
    config: IFormProps['config'];
    isValid?: IFormProps['isValid'];
    data?: IFormProps['data'];
}

const FormHandler: React.FC<IFormProps> = (props) => {
    const {
        'data-cy': cy = '',
        className,
        title,
        updateCTRL,
        submitCTRL,
        cancelCTRL,
        onMount,
        onError,
        onSuccess,
        onSubmit,
        onCancel,
        validate,
    } = props;

    const [state, setState] = useState<IFormState>({
        config: props.config,
        data: props.data,
        isValid: props.isValid,
    });

    const onSuccessHandler = ({ data }: IFormState): void => {
        setState({ ...state, data });

        onSuccess && onSuccess(props, state);
    };

    const onErrorHandler = (): void => {
        setState({ ...state });

        onError && onError(props, state);
    };

    const onSubmitHandler = (e: FormEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        const { config } = state;

        if (!validate || validate(config)) {
            setState((prevState) => ({ ...prevState, isValid: true }));

            onSubmit && onSubmit(props, state)
                .then(onSuccessHandler)
                .catch(onErrorHandler);
        } else {
            setState((prevState) => ({ ...prevState, config: [...config], isValid: false }));
        }
    };

    const onCancelHandler = (e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        onCancel && onCancel(props, state);
    };

    const onCollapseHandler = (e: React.MouseEvent): void => {
        const { config } = state;
        const section = parseInt((e.target as HTMLElement).getAttribute('data-section')!, 10);

        config[section].isCollapsed = !config[section].isCollapsed;

        setState({ ...state, config: [...config] });
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const { config } = state;
        const section = parseInt(e.target.getAttribute('data-section')!, 10);
        const field = parseInt(e.target.getAttribute('data-field')!, 10);

        // if (!isNaN(section) && !isNaN(field)) {
            config[section].items[field].value = e.target.value;

            validate && validate(config, [[section, field]]);

            setState({
                ...state,
                config: [...config],
                isValid: config.every(({ items }) => items.every(({ errors }) => !Array.isArray(errors)))
            });
        // }
    };

    useEffect(() => {
        onMount && onMount(props, state)
            .then(onSuccessHandler)
            .catch(onErrorHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { config, data, isValid } = state;

    return (
        <form className={classNames(`form`, className)}>
            {title && <h1 className="form_title" data-cy={`${cy}form-title`}>{title}</h1>}
            {
                config.map(({ items, ...props }, i) => (
                    <Accordion
                        {...props}
                        onCollapse={onCollapseHandler}
                        key={i}
                        data-section={i}
                        data-cy={`${cy}section-${i}`}
                    >
                        {
                            items.map(({ component: FormField, value, ...props }, j) => (
                                <FormField
                                    {...props}
                                    key={j}
                                    onChange={onChangeHandler}
                                    data-cy={`${cy}section-${i}-input-${j}`}
                                    data-section={i}
                                    data-field={j}
                                    value={value as TFormFieldValuePrimitive}
                                />
                            ))
                        }
                    </Accordion>
                ))
            }
            <div className="form_controls">
                {
                    updateCTRL
                    && data
                    && (
                        <Button
                            {...updateCTRL}
                            data-cy={`${cy}form--update`}
                            onClick={onSubmitHandler}
                            disabled={!isValid}
                        />
                    )
                }
                {
                    submitCTRL
                    && !data
                    && (
                        <Button
                            {...submitCTRL}
                            data-cy={`${cy}form--submit`}
                            onClick={onSubmitHandler}
                            disabled={!isValid}
                        />
                    )
                }
                {
                    cancelCTRL
                    && (
                        <Button
                            {...cancelCTRL}
                            data-cy={`${cy}form--cancel`}
                            onClick={onCancelHandler}
                        />
                    )
                }
            </div>
        </form>
    );
};

export default FormHandler;
