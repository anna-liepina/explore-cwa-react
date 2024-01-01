import { FormFlags, hasFlag } from './byteFlags';


export interface IFormSectionConfig {
    items: IFormFieldConfig[]
}

export interface IFormFieldConfig {
    // component: React.ComponentType;
    value: any;
    attr: string;
    valueTransformer?: (value: any) => any;
    flags?: number;
}

type Value = string |number | boolean;
export type IFormPayload = Record<string, Value|Value[]>

const resolvePayload = (config: IFormSectionConfig[]): IFormPayload => {
    const result: IFormPayload = {};

    for (const { items } of config) {
        for (const { value, valueTransformer: fn, attr, flags } of items) {
            const v = typeof fn === 'function' ? fn(value) : value;

            /** aggregate values in array */
            if (hasFlag(flags!, FormFlags.AGGIGATE_VALUE_IN_ARRAY)) {
                result[attr] ||= [];
                (result[attr] as Value[]).push(v);
            } else {
                result[attr] = v;
            }
        }
    }

    return result;
}

export default resolvePayload;