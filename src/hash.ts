import { hash as hashSingle } from "immutable";
import { ObjectValue } from "./objectValue";

export type PrimitiveOrHashable = undefined | null | boolean | number | string | ObjectValue | PrimitiveOrHashable[];

export function hash(...values: PrimitiveOrHashable[]): number {
    if (values.length === 1) {
        const [value] = values;
        if (value instanceof Array) {
            return hash(...value);
        }
    }

    return values.reduce((currentHash: number, value) => hashSingle(value) ^ currentHash, 0);
}
