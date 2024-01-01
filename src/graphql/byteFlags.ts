/** returns true if {v} sequence bytes are preset in {seq} sequence */
export const hasFlag = (seq: number, v: number) => (seq & v) === v;

/** return new sequence using binary AND */
export const addFlag = (seq: number, v: number) => seq | v;

/** exclude {v} sequence from {seq} */
export const removeFlag = (seq: number, v: number) => seq & ~v;

export const enum FormFlags {
    AGGIGATE_VALUE_IN_ARRAY = 0x10,
}
