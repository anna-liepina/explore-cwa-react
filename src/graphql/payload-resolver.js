import { hasSequence } from 'byte-sequence-calculator';

export default (c) => {
    const obj = {};

    for (const { items } of c) {
        for (const { value, valueTransformer: fn, attr, seq } of items) {
            const v = typeof fn === 'function' ? fn(value) : value;

            /** aggregate values in array */
            if (hasSequence(seq, 0x10)) {
                if (undefined === obj[attr]) {
                    obj[attr] = [];
                }

                obj[attr].push(v);
            } else {
                obj[attr] = v;
            }
        }
    }

    return obj;
}
