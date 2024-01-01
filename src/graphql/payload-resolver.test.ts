import fn from './payload-resolver';

describe('form payload resolver', () => {
    it('should invoke ::valueTransformer if it been provided, with ::value as payload', () => {
        const spy = jest.fn();
        const c = [
            {
                items: [
                    {
                        attr: 'test',
                        value: 1,
                        valueTransformer: spy,
                    },
                ],
            },
        ];

        fn(c);

        expect(spy).toBeCalledWith(c[0].items[0].value);
    });

    it('should pass result of ::valueTransformer in to payload instead of ::value', () => {
        const c = [
            {
                items: [
                    {
                        attr: 'test',
                        value: 1,
                        valueTransformer: () => 2,
                    },
                ],
            },
        ];

        expect(fn(c)).toMatchSnapshot();
    });

    it(`should pass ::value 'as is' into payload`, () => {
        const c = [
            {
                items: [
                    {
                        attr: 'test',
                        value: 1,
                    },
                ],
            },
        ];

        expect(fn(c)).toMatchSnapshot();
    });

    it(`should aggregate resolved fields' values with same ::attr into array`, () => {
        const c = [
            {
                items: [
                    {
                        attr: 'test',
                        value: 1,
                        flags: 0x10,
                    }
                ],
            },
            {
                items: [
                    {
                        attr: 'test',
                        value: 1,
                        valueTransformer: (v) => 2,
                        flags: 0x10,
                    }
                ],
            },
        ];

        expect(fn(c)).toMatchSnapshot();
    });
});
