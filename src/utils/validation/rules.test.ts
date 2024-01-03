import {
    composeRule,
    composeConditionalRule,
    isRequired,
    isMatchRegex,
    isLengthBetween,
    RuleFunction
} from './rules';

describe('validation rules', () => {
    describe('::isRequired', () => {
        [
            ["x",       true],
            ["",        false],
            [1,         true],
            [0,         true],
            [true,      true],
            [false,     true],
            [null,      false],
            [undefined, false],
        ].forEach(([value, result]) => {
            it(`on "${value}" should return "${result}"`, () => {
                expect(isRequired(value)).toBe(result);
            });
        });
    });

    describe('::isMatchRegex', () => {
        [
            [1, /^[1-9]+$/, true],
            [1, '[1-9]+',   true],
            [0, /^[1-9]+$/, false],
            [0, '[1-9]+',   false],
        ].forEach(([value, pattern, result]) => {
            it(`on "${value}" should return "${result}" as "${value}" ${!result ? 'NOT ' : ''}match "${pattern}" pattern`, () => {
                expect(isMatchRegex(value, pattern)).toBe(result);
            });
        });
    });

    describe('::isLengthBetween', () => {
        [
            ['one', 0,          4,          true],
            ['one', 1,          4,          true],
            ['one', 2,          4,          true],
            ['one', 0,          3,          true],
            ['one', 0,          2,          false],
            ['one', 4,          undefined,  false],
            ['one', undefined,  undefined,  true],
            ['one', undefined,  4,          true],
            ['one', undefined,  2,          false],
        ].forEach(([value, min, max, result]) => {
            it(`on content's length ${(value as string).length} should return "${result}" when min: ${min} and max: ${max}`, () => {
                expect(isLengthBetween(value, min, max)).toBe(result);
            });
        });
    });
});

describe('composed validation rules', () => {
    const errorMsg = 'error message';

    describe('::composeRule', () => {
        [
            [true,      isRequired, undefined, true],
            ["",        isRequired, undefined, errorMsg],
            [null,      isRequired, undefined, errorMsg],
            [undefined, isRequired, undefined, errorMsg],

            [1, isMatchRegex, ['[1-9]+'], true],
            [1, isMatchRegex, [/[1-9]+/], true],
            [0, isMatchRegex, ['[1-9]+'], errorMsg],
            [0, isMatchRegex, [/[1-9]+/], errorMsg],

            ['one', isLengthBetween, [1],               true],
            ['one', isLengthBetween, [undefined, 3],    true],
            ['one', isLengthBetween, [1, 3],            true],
            ['one', isLengthBetween, [undefined, 1], errorMsg],
            ['one', isLengthBetween, [4, undefined], errorMsg],
        ].forEach(([v, rule, args = [], r]) => {
            it(`using "${(rule as Function).name}" rule and ${undefined !== args ? `arguments: [${args}]`: 'NO arguments'} it should return "${r}"`, () => {
                expect(composeRule(rule as RuleFunction, errorMsg, ...args as any)(v)).toBe(r);
            });
        });

        it('when ::message argument is a function, it should be called with own and composed arguments', () => {
            const spy = jest.fn();

            composeRule(() => false, spy, 1, 2)('value');

            expect(spy).toBeCalledWith('value', 1, 2);
        });
    });

    describe('::composeConditionalRule', () => {
        it(`when condition is truthy, rule should be executed`, () => {
            const spy = jest.fn();

            composeConditionalRule(() => true, spy)(1, []);

            expect(spy).toBeCalledWith(1, []);
        });

        it(`when condition is falsy, rule should NOT be executed`, () => {
            const spy = jest.fn();

            composeConditionalRule(() => false, spy)(undefined, []);

            expect(spy).not.toBeCalled();
        });
    });
});
