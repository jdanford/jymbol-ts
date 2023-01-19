import { Env } from "./env";
import { hash } from "./hash";
import { ObjectValue } from "./objectValue";
import { Value } from "./value";
import { VM } from "./vm";

export interface NativeFunctionContext {
    readonly vm: VM;
    readonly env: Env;
}

export type RawNativeFunction = (
    values: Value[],
    context: NativeFunctionContext,
) => Value | [Value, Env];

export interface NativeFunctionParams {
    readonly arity?: number | undefined;
    readonly evalArgs?: boolean;
}

export class NativeFunction implements ObjectValue {
    readonly name: string;
    readonly arity: number | undefined;
    readonly evalArgs: boolean;
    readonly fn: RawNativeFunction;

    constructor(
        name: string,
        { arity = undefined, evalArgs = true }: NativeFunctionParams,
        fn: RawNativeFunction,
    ) {
        this.name = name;
        this.arity = arity;
        this.evalArgs = evalArgs;
        this.fn = fn;
    }

    hashCode(): number {
        return hash(this.name, this.arity, this.evalArgs);
    }

    apply(values: Value[], context: NativeFunctionContext): [Value, Env] {
        const result = this.fn(values, context);
        if (result instanceof Array) {
            return result;
        }

        return [result, context.env];
    }
}
