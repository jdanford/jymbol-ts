import { Ref } from "./ref";
import { Symbol } from "./symbol";
import { Quoted } from "./quoted";
import { NativeFunction } from "./function";

export type Atom = number | string | Symbol;
export type Value = Atom | Quoted | Ref | NativeFunction;

export function isAtom(value: Value): value is Atom {
    return isNumber(value) || isString(value) || isSymbol(value);
}

export function isNumber(value: Value): value is number {
    return typeof value === "number";
}

export function isString(value: Value): value is string {
    return typeof value === "string";
}

export function isSymbol(value: Value): value is Symbol {
    return value instanceof Symbol;
}

export function isQuoted(value: Value): value is Quoted {
    return value instanceof Quoted;
}

export function isRef(value: Value): value is Ref {
    return value instanceof Ref;
}

export function isNativeFunction(value: Value): value is NativeFunction {
    return value instanceof NativeFunction;
}
