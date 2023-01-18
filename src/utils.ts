import { NativeFunction } from "./function";
import { Ref } from "./ref";
import { Symbol } from "./symbol";
import { isNativeFunction, isNumber, isRef, isString, isSymbol, Value } from "./value";

export function checkType(type: Symbol, expectedType: Symbol) {
    if (type !== expectedType) {
        throw new Error(`Expected type \`${expectedType}\`, got \`${type}\``)
    }
}

export function tryAsNumber(value: Value): number {
    if (!isNumber(value)) {
        throw new Error(`Expected number, got \`${value}\``);
    }

    return value;
}

export function tryAsString(value: Value): string {
    if (!isString(value)) {
        throw new Error(`Expected string, got \`${value}\``);
    }

    return value;
}

export function tryAsSymbol(value: Value): Symbol {
    if (!isSymbol(value)) {
        throw new Error(`Expected symbol, got \`${value}\``);
    }

    return value;
}

export function tryAsRef(value: Value): Ref {
    if (!isRef(value)) {
        throw new Error(`Expected ref, got \`${value}\``);
    }

    return value;
}

export function tryAsNativeFunction(value: Value): NativeFunction {
    if (!isNativeFunction(value)) {
        throw new Error(`Expected native function, got \`${value}\``);
    }

    return value;
}
