export type RuleFunction = (v: any, ...args: any[]) => boolean;
export type ErrorMessageFunction = (v: any, ...args: any[]) => string;

/**
 * @param {RuleFunction}        fn
 * @param {ErrorMessageFunction | string} message
 * @param {any[]}           args
 *
 * examples:
 *  composeRule(isRequired, 'message')
 *  composeRule(isRequired, (value, ...args) => 'message')
 *  composeRule(isMatchRegex, 'message', [/regexp/])
 *  composeRule(isLengthBetween, 'message', [1, 2])
 */
export const composeRule = (fn: RuleFunction, message: ErrorMessageFunction | string, args: any[] = []) =>
    (v: any) => fn(v, ...args) || (typeof message === 'function' ? message(v, ...args) : message);

/**
 * @param {RuleFunction} condition
 * @param {RuleFunction} fn
 *
 * examples:
 *  composeConditionalRule(
 *      (value, config) => true,
 *      composeRule(isRequired, 'message')
 *  )
 *  composeConditionalRule(
 *      (value, config) => true,
 *      composeRule(isMatchRegex, 'message', [/regexp/])
 *  )
 *  composeConditionalRule(
 *      (value, config) => true,
 *      composeRule(isLengthBetween, 'message', [1, 2])
 *  )
 */
export const composeConditionalRule = (condition: RuleFunction, fn: RuleFunction) => 
    (v: any, config: any) => !condition(v, config) || fn(v);

export const isRequired: RuleFunction = (v) => "" !== v && undefined !== v && null !== v;
export const isMatchRegex: RuleFunction = (v, pattern) => new RegExp(pattern).test(v);
export const isLengthBetween: RuleFunction = (v, min, max) => !(min > v.length || max < v.length);
