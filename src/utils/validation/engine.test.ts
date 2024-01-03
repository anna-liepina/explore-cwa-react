import { validationEngine } from './engine';
import type { SectionConfig } from './engine';
import type { Validator } from './rules';

describe('validation engine', () => {
    const dataProvider = (): SectionConfig[] => [
        {
            items: [
            ],
        },
        {
            items: [
                {},
                {}
            ],
        },
    ];

    const neverFailValidator: Validator = () => true;
    const alwaysFailValidator: Validator = () => '{{error message}}';

    describe('[default mode]', () => {
        it(`should return TRUE when validators are NOT defined, expected NO error messages in snapshot`, () => {
            const config = dataProvider();

            expect(validationEngine(config)).toBe(true);
            expect(config).toMatchSnapshot();
        });

        it(`should return TRUE when validators are empty, expected NO error messages in snapshot`, () => {
            const config = dataProvider();

            config[0].items.push({ validators: [] });

            expect(validationEngine(config)).toBe(true);
            expect(config).toMatchSnapshot();
        });

        it(`should return TRUE when all defined validators PASS, expected NO error messages in snapshot`, () => {
            const config = dataProvider();

            config[0].items.push({
                validators: [
                    neverFailValidator,
                ],
            });

            expect(validationEngine(config)).toBe(true);
            expect(config).toMatchSnapshot();
        });

        it(`should return FALSE when all defined validators FAIL, expected error messages in snapshot`, () => {
            const config = dataProvider();

            config[0].items.push({
                validators: [
                    alwaysFailValidator,
                ],
            });

            expect(validationEngine(config)).toBe(false);
            expect(config).toMatchSnapshot();
        });

        it(`should return FALSE when at least one of defined validators FAIL, expected error messages in snapshot`, () => {
            const config = dataProvider();

            config[0].items.push({
                validators: [
                    neverFailValidator,
                    alwaysFailValidator
                ],
            });

            expect(validationEngine(config)).toBe(false);
            expect(config).toMatchSnapshot();
        });
    });

    describe('[enforced scope mode]', () => {
        describe('[scope limited to entire section]', () => {
            it(`should return TRUE when all validators in a scope PASS`, () => {
                const config = dataProvider();

                config[0].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[0] = {
                    value: '{{item-1-0}}',
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[1] = {
                    value: '{{item-1-1}}',
                    validators: [
                        jest.fn(),
                    ],
                };

                expect(validationEngine(config, [[1]])).toBe(true);

                expect(config[0].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[0].validators![0]).toBeCalledWith('{{item-1-0}}', config);
                expect(config[1].items[1].validators![0]).toBeCalledWith('{{item-1-1}}', config);

                expect(config).toMatchSnapshot();
            });

            it(`should return FALSE when all validators in a scope FAIL`, () => {
                const config = dataProvider();

                config[0].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[0] = {
                    value: '{{item-1-0}}',
                    validators: [
                        jest.fn(() => 'error'),
                    ],
                };
                config[1].items[1] = {
                    value: '{{item-1-1}}',
                    validators: [
                        jest.fn(() => 'error'),
                    ],
                };

                expect(validationEngine(config, [[1]])).toBe(false);

                expect(config[0].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[0].validators![0]).toBeCalledWith('{{item-1-0}}', config);
                expect(config[1].items[1].validators![0]).toBeCalledWith('{{item-1-1}}', config);

                expect(config).toMatchSnapshot();
            });

            it(`should return FALSE when at least one validator in a scope FAIL`, () => {
                const config = dataProvider();

                config[0].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[0] = {
                    value: '{{item-1-0}}',
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[1] = {
                    value: '{{item-1-1}}',
                    validators: [
                        jest.fn(() => 'error'),
                    ],
                };

                expect(validationEngine(config, [[1]])).toBe(false);

                expect(config[0].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[0].validators![0]).toBeCalledWith('{{item-1-0}}', config);
                expect(config[1].items[1].validators![0]).toBeCalledWith('{{item-1-1}}', config);

                expect(config).toMatchSnapshot();
            });
        });

        describe('[scope limited to specific item]', () => {
            it(`should return TRUE when all validators in a scope PASS`, () => {
                const config = dataProvider();

                config[0].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[1] = {
                    value: '{{item-1-1}}',
                    validators: [
                        jest.fn(),
                    ],
                };

                expect(validationEngine(config, [[1, 1]])).toBe(true);

                expect(config[0].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[1].validators![0]).toBeCalledWith('{{item-1-1}}', config);

                expect(config).toMatchSnapshot();
            });

            it(`should return FALSE when all validators in a scope FAIL`, () => {
                const config = dataProvider();

                config[0].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[1] = {
                    value: '{{item-1-1}}',
                    validators: [
                        jest.fn(() => 'error'),
                        jest.fn(() => 'error'),
                    ],
                };

                expect(validationEngine(config, [[1, 1]])).toBe(false);

                expect(config[0].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[1].validators![0]).toBeCalledWith('{{item-1-1}}', config);
                expect(config[1].items[1].validators![1]).toBeCalledWith('{{item-1-1}}', config);

                expect(config).toMatchSnapshot();
            });

            it(`should return FALSE when at least one validator in a scope FAIL`, () => {
                const config = dataProvider();

                config[0].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[0] = {
                    validators: [
                        jest.fn(),
                    ],
                };
                config[1].items[1] = {
                    value: '{{item-1-1}}',
                    validators: [
                        jest.fn(),
                        jest.fn(() => 'error'),
                    ],
                };

                expect(validationEngine(config, [[1, 1]])).toBe(false);

                expect(config[0].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[0].validators![0]).not.toBeCalled();
                expect(config[1].items[1].validators![0]).toBeCalledWith('{{item-1-1}}', config);
                expect(config[1].items[1].validators![1]).toBeCalledWith('{{item-1-1}}', config);

                expect(config).toMatchSnapshot();
            });
        });
    });
});
