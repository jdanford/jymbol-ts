import { Env } from "./env";
import { NativeFunction } from "./function";
import { Heap } from "./heap";
import { Parser } from "./parser";
import { bootstrap } from "./prelude";
import { Quoted } from "./quoted";
import { Ref } from "./ref";
import { checkLength, sized } from "./sized";
import { Symbol } from "./symbol";
import { SymbolTable } from "./symbolTable";
import { tryAsNativeFunction, tryAsRef, tryAsSymbol } from "./utils";
import { isAtom, isQuoted, isRef, isSymbol, Value } from "./value";

export class VM {
    readonly symbolTable: SymbolTable;
    readonly heap: Heap;
    readonly globalEnv: Env;

    constructor() {
        this.symbolTable = new SymbolTable();
        this.heap = new Heap();
        this.globalEnv = bootstrap(this);
    }

    define(name: string, value: Value, env: Env): Env {
        const symbol = this.symbolTable.intern(name);
        return env.set(symbol, value);
    }

    read(input: string): Value {
        return Parser.parse(this, input);
    }

    eval(value: Value, env: Env): [Value, Env] {
        if (isSymbol(value)) {
            return this.evalSymbol(value, env);
        }

        if (isQuoted(value)) {
            return this.evalQuote(value, env);
        }

        if (isRef(value)) {
            return this.evalRef(value, env);
        }

        return [value, env];
    }

    private evalSymbol(symbol: Symbol, env: Env): [Value, Env] {
        const value = env.get(symbol);
        if (value === undefined) {
            throw new Error(`Undefined symbol \`${symbol}\``);
        }

        return [value, env];
    }

    private evalQuote(quoted: Quoted, env: Env): [Value, Env] {
        if (quoted.quote === "quote") {
            return [quoted.value, env];
        }

        // TODO: handle other quote types
        return [Symbol.nil, env];
    }

    private evalRef(ref: Ref, env: Env): [Value, Env] {
        const [type, values] = this.heap.load(ref);

        if (type === Symbol.cons) {
            const [head, tail] = sized(values, 2);
            return this.apply(head, tail, env);
        }

        throw new Error(`Can't evaluate \`${ref}\``);
    }

    private evalList(list: Value, env: Env): [Value[], Env] {
        const values: Value[] = [];
        const tailValues = this.heap.loadList(list);
        for (const rawValue of tailValues) {
            const [value, newEnv] = this.eval(rawValue, env);
            values.push(value);
            env = newEnv;
        }

        return [values, env];
    }

    apply(head: Value, tail: Value, env: Env): [Value, Env] {
        const ref = tryAsRef(head);
        const [type, values] = this.heap.load(ref);

        if (type === Symbol.fn) {
            const [paramList, fnBody] = sized(values, 2);
            return this.applyFn(paramList, fnBody, tail, env);
        }

        if (type === Symbol["native-fn"]) {
            const [value] = sized(values, 1);
            const fn = tryAsNativeFunction(value);
            return this.applyNative(fn, tail, env);
        }

        throw new Error(`Can't apply \`${ref}\``);
    }

    private applyFn(paramList: Value, fnBody: Value, tail: Value, env: Env): [Value, Env] {
        const params = this.heap.loadList(paramList);
        const [args, newEnv] = this.evalList(tail, env);
        env = newEnv;

        const arity = params.length;
        checkLength(args, arity);

        let fnEnv = env;
        for (let i = 0; i < arity; i++) {
            const param = params[i];
            const arg = args[i];
            const symbol = tryAsSymbol(param);
            fnEnv = fnEnv.set(symbol, arg);
        }

        return this.eval(fnBody, fnEnv);
    }

    private applyNative(fn: NativeFunction, tail: Value, env: Env): [Value, Env] {
        const values = this.heap.loadList(tail);
        const context = { env, vm: this };
        return fn.apply(values, context);
    }

    render(value: Value): string {
        if (isSymbol(value)) {
            return this.symbolTable.resolve(value);
        }

        if (isAtom(value)) {
            return value.toString();
        }

        if (isRef(value)) {
            const [type, values] = this.heap.load(value);
            if (type === Symbol.cons) {
                return this.renderList(value);
            } else {
                const tag = this.symbolTable.resolve(type);
                return this.renderCompound([tag, ...values], "#(", ")");
            }
        }

        return value.toString();
    }

    private renderList(list: Value): string {
        const values = this.heap.loadList(list);
        return this.renderCompound(values);
    }

    private renderCompound(values: Value[], openingBrace = "(", closingBrace = ")"): string {
        const stringValues = values.map((value) => this.render(value));
        const body = stringValues.join(" ");
        return openingBrace + body + closingBrace;
    }
}
