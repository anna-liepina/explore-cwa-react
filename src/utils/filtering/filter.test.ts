import { ITreeNodeProps } from '../../component/tree/tree-node';
import { filter } from './filter';
import type { ITextChunk } from './filter';

describe('tree filter engine', () => {
    const dataProviderChildlessNodes = (): [string, string, ITextChunk[]][] => [
        [
            'player',
            'a',
            [
                { v: 'pl', isMatch: false },
                { v: 'a', isMatch: true },
                { v: 'yer', isMatch: false },
            ]
        ],
        ['text', 'text', [{ v: 'text', isMatch: true }]],
        ['TEXT text', 'text', [{ v: 'TEXT', isMatch: true }, { v: ' ', isMatch: false }, { v: 'text', isMatch: true }]],
        [
            'TEXT text text text',
            'text',
            [
                { v: 'TEXT', isMatch: true },
                { v: ' ', isMatch: false },
                { v: 'text', isMatch: true },
                { v: ' ', isMatch: false },
                { v: 'text', isMatch: true },
                { v: ' ', isMatch: false },
                { v: 'text', isMatch: true },
            ]
        ],
        ['TTT', 't', [{ v: 'T', isMatch: true }, { v: 'T', isMatch: true }, { v: 'T', isMatch: true }]],
        ['T T', 't', [{ v: 'T', isMatch: true }, { v: ' ', isMatch: false }, { v: 'T', isMatch: true }]],
        ['TEXT', 't', [{ v: 'T', isMatch: true }, { v: 'EX', isMatch: false }, { v: 'T', isMatch: true }]],
        ['TEXT', 'te', [{ v: 'TE', isMatch: true }, { v: 'XT', isMatch: false }]],
    ];

    const dataProviderWithoutMatches = (): [string, string][] => [
        [
            'text',
            'a',
        ]
    ];

    const dataProviderWithChildNodes = (): [string, ITreeNodeProps, string, ITreeNodeProps][] => [
        [
            'aaa > bbb > CCC',
            {
                text: 'aaa',
                nodes: [
                    {
                        text: 'bbb',
                        nodes: [
                            {
                                text: 'CCC',
                                nodes: [
                                ],
                            },
                        ],
                    },
                ],
            },
            'c',
            {
                text: 'aaa',
                isExpanded: true,
                isVisible: true,
                chunks: undefined,
                nodes: [
                    {
                        text: 'bbb',
                        isExpanded: true,
                        isVisible: true,
                        chunks: undefined,
                        nodes: [
                            {
                                text: 'CCC',
                                isExpanded: false,
                                isVisible: true,
                                chunks: [
                                    { v: 'C', isMatch: true },
                                    { v: 'C', isMatch: true },
                                    { v: 'C', isMatch: true },
                                ],
                                nodes: [],
                            },
                        ],
                    },
                ],
            },
        ],
        [
            'aaa > bbb > CCC',
            {
                text: 'aaa',
                nodes: [
                    {
                        text: 'bbb',
                        nodes: [
                            {
                                text: 'CCC',
                                nodes: [
                                ],
                            },
                        ],
                    },
                ],
            },
            '',
            {
                text: 'aaa',
                isExpanded: false,
                isVisible: false,
                chunks: undefined,
                nodes: [
                    {
                        text: 'bbb',
                        isExpanded: false,
                        isVisible: false,
                        chunks: undefined,
                        nodes: [
                            {
                                text: 'CCC',
                                isExpanded: false,
                                isVisible: false,
                                chunks: undefined,
                                nodes: [],
                            },
                        ],
                    },
                ],
            },
        ]
    ];

    const dataProviderMixedNodes = (): [string, string, ITextChunk[]|undefined][] => [
        ['text', 'a', undefined],
        [
            'player',
            'a',
            [
                { v: 'pl', isMatch: false },
                { v: 'a', isMatch: true },
                { v: 'yer', isMatch: false },
            ]
        ],
        [
            'text',
            'text',
            [
                { v: 'text', isMatch: true }
            ]
        ],
        [
            'TEXT text',
            'text',
            [
                { v: 'TEXT', isMatch: true },
                { v: ' ', isMatch: false },
                { v: 'text', isMatch: true }
            ]
        ],
        [
            'TEXT text text text',
            'text',
            [
                { v: 'TEXT', isMatch: true },
                { v: ' ', isMatch: false },
                { v: 'text', isMatch: true },
                { v: ' ', isMatch: false },
                { v: 'text', isMatch: true },
                { v: ' ', isMatch: false },
                { v: 'text', isMatch: true },
            ]
        ],
        ['TTT', 't', [{ v: 'T', isMatch: true }, { v: 'T', isMatch: true }, { v: 'T', isMatch: true }]],
        ['T T', 't', [{ v: 'T', isMatch: true }, { v: ' ', isMatch: false }, { v: 'T', isMatch: true }]],
        ['TEXT', 't', [{ v: 'T', isMatch: true }, { v: 'EX', isMatch: false }, { v: 'T', isMatch: true }]],
        ['TEXT', 'te', [{ v: 'TE', isMatch: true }, { v: 'XT', isMatch: false }]],
    ];

    describe(`searching of ::pattern in childless nodes`, () => {
        describe(`::pattern not present in ::text cases`, () => {
            dataProviderWithoutMatches()
                .forEach(([text, pattern]) => {
                    it(`searching for "${pattern}" in "${text}", expect [::chunks] to be undefined`, () => {
                        const v = { text } as ITreeNodeProps;
    
                        filter(v, pattern);
                        expect(v.chunks).toBeUndefined();
                    });
                });
        });

        dataProviderChildlessNodes()
            .forEach(([text, pattern, result]) => {
                describe(`searching for "${pattern}" in "${text}"`, () => {
                    it(`expect [::chunks] to have length ${result.length}`, () => {
                        const v = { text } as ITreeNodeProps;

                        filter(v, pattern);
                        expect(v.chunks).toHaveLength(result.length);
                    });

                    it(`expect [::isMatch] in chunk to be TRUE, if it matches ::pattern, otherwise FALSE`, () => {
                        const v = { text } as ITreeNodeProps;

                        filter(v, pattern);
                        expect(v.chunks).toEqual(result);
                    });
                });
            });
    });

    describe(`searching of ::pattern in nodes with children & propogation of ::isExpanded, ::isVisible fields`, () => {
        dataProviderWithChildNodes()
            .forEach(([title, v, pattern, expected]) => {
                it(`${title} [pattern: "${pattern}"]`, () => {
                    filter(v, pattern);

                    expect(v).toEqual(expected);
                });
        });
    });

    describe('propogation of [::isExpanded] field', () => {
        dataProviderMixedNodes()
            .forEach(([text, pattern, c]) => {
                it(`searching for "${pattern}" in "${text}", expect to be ${`${!!c}`.toUpperCase()}`, () => {
                    const v = { text };

                    const result = filter(v, pattern);

                    expect(result).toBe(!!c);
                });
            });
    });

    describe('propogation of [::isVisible] field', () => {
        dataProviderMixedNodes()
            .forEach(([text, pattern, c]) => {
                it(`searching for "${pattern}" in "${text}", expect to be ${`${!!c}`.toUpperCase()}`, () => {
                    const v = { text };

                    const result = filter(v, pattern);

                    expect(result).toBe(!!c);
                });
            });
    });
});
