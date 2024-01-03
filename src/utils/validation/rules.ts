import type { SectionConfig } from "./engine";

export type RuleFunction = (v: any, ...args: any[]) => boolean;
export type MessageFunction = (v: any, ...args: any[]) => string;

export type Condition = (v: any, config: SectionConfig[]) => boolean;
export type Validator = (v: any, config: SectionConfig[]) => boolean | string;

/**
 * examples:
 *  composeRule(isRequired, 'message')
 *  composeRule(isRequired, (value, ...args) => 'message')
 *  composeRule(isMatchRegex, 'message', /regexp/)
 *  composeRule(isLengthBetween, 'message', 1, 2)
 */
export const composeRule = (
    rule: RuleFunction,
    msg: MessageFunction | string,
    ...args: any[]
) => (v: any, config?: SectionConfig[]) => rule(v, ...args) || (typeof msg === 'function' ? msg(v, ...args) : msg);

/**
 * examples:
 *  composeConditionalRule(
 *      (value, config) => boolean,
 *      composeRule(isRequired, 'message')
 *  )
 *  composeConditionalRule(
 *      (value, config) => boolean,
 *      composeRule(isRequired, (value, ...args) => 'message')
 *  )
 *  composeConditionalRule(
 *      (value, config) => boolean,
 *      composeRule(isMatchRegex, 'message', /regexp/)
 *  )
 *  composeConditionalRule(
 *      (value, config) => boolean,
 *      composeRule(isLengthBetween, 'message', 1, 2)
 *  )
 */
export const composeConditionalRule = (condition: Condition, validator: Validator) => 
    (v: any, config: SectionConfig[]) => !condition(v, config) || validator(v, config);

export const isRequired: RuleFunction = (v) => "" !== v && undefined !== v && null !== v;
export const isMatchRegex: RuleFunction = (v, pattern) => new RegExp(pattern).test(v);
export const isLengthBetween: RuleFunction = (v, min, max) => !(min > v.length || max < v.length);
