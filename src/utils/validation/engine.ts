import type { Validator } from "./rules";

export interface FieldConfig {
    validators?: Validator[];
    value?: any;
    errors?: string[];
}

export interface SectionConfig {
    items: FieldConfig[];
}

const executeValidations = (item: FieldConfig, config: SectionConfig[]): boolean => {
    const { validators, value } = item;

    if (!Array.isArray(validators)) {
        return true;
    }

    let isValid = true;

    for (const validationRule of validators) {
        const validationResult = validationRule(value, config);

        /** if result is a string, then it is considered as error, otherwise it considered as valid */
        if (typeof validationResult === 'string') {
            isValid = false;

            item.errors ||= [];
            item.errors.push(validationResult);
        }
    }

    return isValid;
}

/**
 * @param {Array} config
 * @param {Array} validationLimitation
 *
 * example of validationLimitation
 *  [[sectionId, itemId]] - will validate only item in specific section
 *  [[sectionId, undefined]] - will validate entire section, if item is not defined
 */
export const validationEngine = (config: SectionConfig[], validationLimitation?: [number, number?][]): boolean => {
    let isValid = true;

    if (Array.isArray(validationLimitation)) {
        for (const [sectionId, itemId] of validationLimitation) {
            if (undefined === itemId) {
                for (const item of config[sectionId].items) {
                    if (!executeValidations(item, config)) {
                        isValid = false;
                    }
                }

                continue;
            }

            if (!executeValidations(config[sectionId].items[itemId], config)) {
                isValid = false;
            }
        }

        return isValid;
    }

    for (const { items } of config) {
        for (const item of items) {
            if (!executeValidations(item, config)) {
                isValid = false;
            }
        }
    }

    return isValid;
}
