import { hasFlag, addFlag, removeFlag } from './byteFlags';

describe(`byte flag calculator`, () => {
    describe(`::hasFlag`, () => {
        [
            { flags: 0x01, flag: 0x01 },
            { flags: 0x03, flag: 0x01 },
            { flags: 0x05, flag: 0x04 },
            { flags: 0x07, flag: 0x02 },
        ].forEach(({ flags, flag }) => {
            it(`expected ${true}, as 0x${flag.toString(16)} is presented in 0x${flags.toString(16)}`, () => {
                expect(hasFlag(flags, flag)).toBeTruthy();
            });
        });

        [
            { flags: 0x00, flag: 0x01 },
            { flags: 0x00, flag: 0x02 },
            { flags: 0x01, flag: 0x02 },
            { flags: 0x03, flag: 0x04 },
            { flags: 0x06, flag: 0x01 },
        ].forEach(({ flags, flag }) => {
            it(`expected ${false}, as 0x${flag.toString(16)} isn't presented in 0x${flags.toString(16)}`, () => {
                expect(hasFlag(flags, flag)).toBeFalsy();
            });
        });
    });

    describe(`::addFlag`, () => {
        [
            { flags: 0x00, flag: 0x01, expected: 0x01 },
            { flags: 0x01, flag: 0x01, expected: 0x01 },
            { flags: 0x01, flag: 0x02, expected: 0x03 },
            { flags: 0x03, flag: 0x04, expected: 0x07 },
            { flags: 0x06, flag: 0x01, expected: 0x07 },
        ].forEach(({ flags, flag, expected }) => {
            it(`expected 0x${expected.toString(16)}, merging 0x${flag.toString(16)}, ${flags.toString(16)}`, () => {
                expect(addFlag(flags, flag)).toBe(expected);
            });
        });
    });

    describe(`::removeFlag`, () => {
        [
            { flags: 0x00, flag: 0x01, expected: 0x00 },
            { flags: 0x02, flag: 0x01, expected: 0x02 },
            { flags: 0x12, flag: 0x02, expected: 0x10 },
            { flags: 0x04, flag: 0x04, expected: 0x00 },
            { flags: 0x02, flag: 0x04, expected: 0x02 },
            { flags: 0xFF, flag: 0xFF, expected: 0x00 },
            { flags: 0xFF, flag: 0x0F, expected: 0xF0 },
            { flags: 0xFF, flag: 0xF0, expected: 0x0F },
        ].forEach(({ flags, flag, expected }) => {
            it(`expected 0x${expected.toString(16)}, dropping 0x${flag.toString(16)} from 0x${flags.toString(16)}`, () => {
                expect(removeFlag(flags, flag)).toBe(expected);
            });
        });
    });

    /**
     * as JS convert any Flag to {Number},
     * there is no point to test it, as it is only JS behaviour,
     * tests below are left for demonstration purposes
     */
    describe(` >>> demonstration test suites <<<`, () => {
        describe(`::hasFlag`, () => {
            [
                { flags: 0o1,   flag: 0x01 }, /** avoid use numbers with leading zeros, use 0o */
                { flags: 0b101, flag: 0b1  },
                { flags: 5,     flag: 0o4  },
                { flags: 0o7,   flag: 1    },
            ].forEach(({ flags, flag }) => {
                it(`expected ${true}, as ${flag} is presented in ${flags}`, () => {
                    expect(hasFlag(flags, flag)).toBeTruthy();
                });
            });

            [
                { flags: 0o00, flag: 1 },
                { flags: 0x00, flag: 0b10 },
                { flags: 0b01, flag: 0o2 },
                { flags: 0b11, flag: 0x4 },
                { flags: 0x06, flag: 0b1 },
            ].forEach(({ flags, flag }) => {
                it(`expected ${false}, as ${flag} isn't presented in ${flags}`, () => {
                    expect(hasFlag(flags, flag)).toBeFalsy();
                });
            });
        });

        describe(`::addFlag`, () => {
            [
                { flags: 0x0, flag: 0o1, expected: 0b1 },
                { flags: 0x1, flag: 0o1, expected: 0b1 },
                { flags: 0x1, flag: 0o2, expected: 0b11 },
                { flags: 0x3, flag: 0o4, expected: 0b111 },
                { flags: 0x6, flag: 0o1, expected: 0b111 },
            ].forEach(({ flags, flag, expected }) => {
                it(`expected ${expected}, merging ${flag} into ${flags}`, () => {
                    expect(addFlag(flags, flag)).toBe(expected);
                });
            });
        });

        describe(`::removeFlag`, () => {
            [
                { flags: 0,   flag: 0x01, expected: 0o0 },
                { flags: 2,   flag: 0x01, expected: 0o2 },
                { flags: 18,  flag: 0x02, expected: 0o20 },
                { flags: 4,   flag: 0x04, expected: 0o0 },
                { flags: 2,   flag: 0x04, expected: 0o2 },
                { flags: 255, flag: 0xFF, expected: 0o0 },
                { flags: 255, flag: 0x0F, expected: 0o360 },
                { flags: 255, flag: 0xF0, expected: 0o17 },
            ].forEach(({ flags, flag,  expected}) => {
                it(`expected ${expected}, dropping ${flag} from ${flags}`, () => {
                    expect(removeFlag(flags, flag)).toBe(expected);
                });
            });
        });
    });
});
