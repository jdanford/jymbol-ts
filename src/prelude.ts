import { initialEnv, Env } from "./env";
import { NativeFunction } from "./function";
import { Symbol } from "./symbol";
import { tryAsString } from "./utils";
import { VM } from "./vm";

const coreFunctions = [
    new NativeFunction("cons", { arity: 2 }, ([head, tail], { vm }) => vm.heap.allocCons(head, tail)),
    new NativeFunction("list", {}, (values, { vm }) => vm.heap.allocList(values)),
    new NativeFunction("fn", { arity: 2, evalArgs: false }, (values, { vm }) => vm.heap.alloc(Symbol.fn, values)),
    new NativeFunction("quote", { arity: 1, evalArgs: false }, ([value]) => value),
    new NativeFunction("read", { arity: 1 }, ([value], { vm }) => vm.read(tryAsString(value))),
    new NativeFunction("eval", { arity: 1 }, ([value], { vm, env }) => vm.eval(value, env)),
];

export function bootstrap(vm: VM): Env {
    let env = initialEnv;

    for (let fn of coreFunctions) {
        env = vm.define(fn.name, fn, env);
    }

    return env;
}
